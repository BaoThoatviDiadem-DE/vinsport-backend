const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

function mapPaymentMethod(method) {
  const value = String(method || "").toLowerCase();

  if (value === "cod") return "COD";
  if (value === "banking") return "Bank";
  if (value === "momo") return "Momo";

  return "COD";
}

router.post("/orders", async (req, res) => {
  const { customer, items, totalAmount, paymentMethod, orderDate } = req.body || {};

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Dữ liệu đơn hàng không hợp lệ",
    });
  }

  let transaction;

  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const email =
      customer.email && String(customer.email).trim()
        ? String(customer.email).trim()
        : `guest_${Date.now()}@vinsport.local`;

    const name = customer.name ? String(customer.name).trim() : "Khách hàng";
    const phone = customer.phone ? String(customer.phone).trim() : "";
    const address = customer.address ? String(customer.address).trim() : "";
    const payment = mapPaymentMethod(paymentMethod);

    // 1. Tìm user theo email, nếu chưa có thì tạo mới
    let userId;

    const userCheck = await new sql.Request(transaction)
      .input("email", sql.NVarChar, email)
      .query(`
        SELECT TOP 1 user_id
        FROM Users
        WHERE email = @email
      `);

    if (userCheck.recordset.length > 0) {
      userId = userCheck.recordset[0].user_id;

      await new sql.Request(transaction)
        .input("userId", sql.Int, userId)
        .input("name", sql.NVarChar, name)
        .input("phone", sql.NVarChar, phone)
        .input("address", sql.NVarChar, address)
        .query(`
          UPDATE Users
          SET
            name = CASE WHEN @name <> '' THEN @name ELSE name END,
            phone = CASE WHEN @phone <> '' THEN @phone ELSE phone END,
            address = CASE WHEN @address <> '' THEN @address ELSE address END
          WHERE user_id = @userId
        `);
    } else {
      const insertUser = await new sql.Request(transaction)
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, "123456")
        .input("phone", sql.NVarChar, phone)
        .input("address", sql.NVarChar, address)
        .query(`
          INSERT INTO Users (name, email, password, phone, address)
          OUTPUT INSERTED.user_id
          VALUES (@name, @email, @password, @phone, @address)
        `);

      userId = insertUser.recordset[0].user_id;
    }

    // 2. Tạo order
    const orderInsert = await new sql.Request(transaction)
      .input("userId", sql.Int, userId)
      .input("orderDate", sql.DateTime, orderDate ? new Date(orderDate) : new Date())
      .input("status", sql.NVarChar, "Pending")
      .input("totalAmount", sql.Decimal(12, 2), Number(totalAmount) || 0)
      .query(`
        INSERT INTO Orders (user_id, order_date, status, total_amount)
        OUTPUT INSERTED.order_id, INSERTED.order_date, INSERTED.status, INSERTED.total_amount
        VALUES (@userId, @orderDate, @status, @totalAmount)
      `);

    const createdOrder = orderInsert.recordset[0];
    const orderId = createdOrder.order_id;

    // 3. Insert payment
    await new sql.Request(transaction)
      .input("orderId", sql.Int, orderId)
      .input("method", sql.NVarChar, payment)
      .input("status", sql.NVarChar, "Pending")
      .query(`
        INSERT INTO Payments (order_id, method, status)
        VALUES (@orderId, @method, @status)
      `);

    // 4. Insert shipping
    await new sql.Request(transaction)
      .input("orderId", sql.Int, orderId)
      .input("address", sql.NVarChar, address)
      .input("status", sql.NVarChar, "Pending")
      .query(`
        INSERT INTO Shipping (order_id, address, status)
        VALUES (@orderId, @address, @status)
      `);

    // 5. Insert order details + trừ stock
    for (const item of items) {
      const productId = parseInt(item.productId, 10);
      const sizeName = item.size ? String(item.size).trim() : "";
      const colorName = item.color ? String(item.color).trim() : "";
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;

      if (!productId || quantity <= 0 || price <= 0) {
        throw new Error("Thông tin sản phẩm trong đơn hàng không hợp lệ");
      }

      let variantResult;

      if (sizeName && colorName) {
        variantResult = await new sql.Request(transaction)
          .input("productId", sql.Int, productId)
          .input("sizeName", sql.NVarChar, sizeName)
          .input("colorName", sql.NVarChar, colorName)
          .query(`
            SELECT TOP 1 pv.variant_id, pv.stock, pv.price
            FROM ProductVariants pv
            INNER JOIN Sizes s ON pv.size_id = s.size_id
            INNER JOIN Colors c ON pv.color_id = c.color_id
            WHERE pv.product_id = @productId
              AND s.name = @sizeName
              AND c.name = @colorName
          `);
      } else {
        variantResult = await new sql.Request(transaction)
          .input("productId", sql.Int, productId)
          .query(`
            SELECT TOP 1 pv.variant_id, pv.stock, pv.price
            FROM ProductVariants pv
            WHERE pv.product_id = @productId
            ORDER BY pv.variant_id
          `);
      }

      if (variantResult.recordset.length === 0) {
        throw new Error(`Không tìm thấy biến thể cho sản phẩm ID ${productId}`);
      }

      const variant = variantResult.recordset[0];

      if (Number(variant.stock) < quantity) {
        throw new Error(`Sản phẩm ID ${productId} không đủ số lượng tồn kho`);
      }

      await new sql.Request(transaction)
        .input("orderId", sql.Int, orderId)
        .input("variantId", sql.Int, variant.variant_id)
        .input("quantity", sql.Int, quantity)
        .input("price", sql.Decimal(10, 2), price)
        .query(`
          INSERT INTO OrderDetails (order_id, variant_id, quantity, price)
          VALUES (@orderId, @variantId, @quantity, @price)
        `);

      await new sql.Request(transaction)
        .input("variantId", sql.Int, variant.variant_id)
        .input("quantity", sql.Int, quantity)
        .query(`
          UPDATE ProductVariants
          SET stock = stock - @quantity
          WHERE variant_id = @variantId
        `);
    }

    await transaction.commit();

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      id: String(orderId),
      orderId: String(orderId),
      order: {
        id: String(orderId),
        customer,
        items,
        totalAmount: Number(totalAmount) || 0,
        paymentMethod,
        orderDate: createdOrder.order_date,
        status: createdOrder.status,
      },
    });
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (_) {}
    }

    console.error("POST /api/orders error:", error);
    return res.status(500).json({
      message: error.message || "Không thể tạo đơn hàng",
    });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        o.order_id,
        o.order_date,
        o.status,
        o.total_amount,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone
      FROM Orders o
      INNER JOIN Users u ON o.user_id = u.user_id
      ORDER BY o.order_id DESC
    `);

    return res.json(
      result.recordset.map((row) => ({
        id: String(row.order_id),
        orderDate: row.order_date,
        status: row.status,
        totalAmount: Number(row.total_amount) || 0,
        customer: {
          name: row.customer_name || "",
          email: row.customer_email || "",
          phone: row.customer_phone || "",
        },
      }))
    );
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng",
    });
  }
});

module.exports = router;