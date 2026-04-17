const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders } = require("../utils/orderStore");

router.post("/orders", (req, res) => {
  const { customer, items, totalAmount, paymentMethod, orderDate } = req.body || {};

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Dữ liệu đơn hàng không hợp lệ",
    });
  }

  const order = createOrder({
    customer,
    items,
    totalAmount,
    paymentMethod,
    orderDate,
  });

  return res.status(201).json({
    message: "Tạo đơn hàng thành công",
    id: order.id,
    order,
  });
});

router.get("/orders", (req, res) => {
  return res.json(getAllOrders());
});

module.exports = router;
