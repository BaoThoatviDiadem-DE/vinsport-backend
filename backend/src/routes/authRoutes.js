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
      .input("email", sql.NVarChar, String(email).trim())
      .query(`
        SELECT user_id, name, email, password, phone, address
        FROM Users
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    const user = result.recordset[0];

    if (user.password !== password) {
      return res.status(401).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }

    return res.json({
      message: "Đăng nhập thành công",
      token: `user-${user.user_id}-token`,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      },
    });
  } catch (error) {
    console.error("POST /api/login error:", error);
    return res.status(500).json({
      message: "Lỗi đăng nhập",
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
      .input("email", sql.NVarChar, String(email).trim())
      .query(`
        SELECT user_id
        FROM Users
        WHERE email = @email
      `);

    if (existed.recordset.length > 0) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const insertResult = await pool
      .request()
      .input("name", sql.NVarChar, String(name).trim())
      .input("email", sql.NVarChar, String(email).trim())
      .input("password", sql.NVarChar, String(password))
      .input("phone", sql.NVarChar, String(phone))
      .input("address", sql.NVarChar, String(address))
      .query(`
        INSERT INTO Users (name, email, password, phone, address)
        OUTPUT INSERTED.user_id, INSERTED.name, INSERTED.email, INSERTED.phone, INSERTED.address
        VALUES (@name, @email, @password, @phone, @address)
      `);

    const newUser = insertResult.recordset[0];

    return res.json({
      message: "Đăng ký thành công",
      token: `user-${newUser.user_id}-token`,
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || "",
        address: newUser.address || "",
      },
    });
  } catch (error) {
    console.error("POST /api/register error:", error);
    return res.status(500).json({
      message: "Lỗi đăng ký tài khoản",
    });
  }
});

module.exports = router;