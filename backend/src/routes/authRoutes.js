const express = require("express");
const router = express.Router();
const { poolPromise, sql } = require("../db");

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Thiếu email hoặc mật khẩu",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("email", sql.NVarChar(100), String(email).trim())
      .query(`
        SELECT user_id, [name], [email], [password], [phone], [address], [role]
        FROM Users
        WHERE [email] = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    const user = result.recordset[0];

    if (String(user.password) !== String(password)) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    const role = user.role || "user";
    const token = `user-${user.user_id}-${role}-token`;

    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.user_id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        role,
      },
    });
  } catch (error) {
    console.error("POST /api/login error:", error);
    console.error("SQL message:", error?.originalError?.info?.message || error.message);

    return res.status(500).json({
      message: error?.originalError?.info?.message || error.message || "Lỗi đăng nhập",
    });
  }
});

// POST /api/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone = "", address = "" } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Thiếu thông tin đăng ký",
      });
    }

    const pool = await poolPromise;

    const existed = await pool
      .request()
      .input("email", sql.NVarChar(100), String(email).trim())
      .query(`
        SELECT user_id
        FROM Users
        WHERE [email] = @email
      `);

    if (existed.recordset.length > 0) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    await pool
      .request()
      .input("name", sql.NVarChar(100), String(name).trim())
      .input("email", sql.NVarChar(100), String(email).trim())
      .input("password", sql.NVarChar(255), String(password))
      .input("phone", sql.NVarChar(15), String(phone).trim() || null)
      .input("address", sql.NVarChar(255), String(address).trim() || null)
      .input("role", sql.NVarChar(20), "user")
      .query(`
        INSERT INTO Users ([name], [email], [password], [phone], [address], [role])
        VALUES (@name, @email, @password, @phone, @address, @role)
      `);

    const userResult = await pool
      .request()
      .input("email", sql.NVarChar(100), String(email).trim())
      .query(`
        SELECT TOP 1 user_id, [name], [email], [phone], [address], [role]
        FROM Users
        WHERE [email] = @email
        ORDER BY user_id DESC
      `);

    const newUser = userResult.recordset[0];
    const role = newUser.role || "user";
    const token = `user-${newUser.user_id}-${role}-token`;

    return res.json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser.user_id,
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
        address: newUser.address || "",
        role,
      },
    });
  } catch (error) {
    console.error("POST /api/register error:", error);
    return res.status(500).json({
      message: error?.originalError?.info?.message || error.message || "Lỗi đăng ký tài khoản",
    });
  }
});

module.exports = router;