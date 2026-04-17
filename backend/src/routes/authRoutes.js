const express = require("express");
const router = express.Router();

const demoUsers = [
  {
    id: 1,
    name: "Khách hàng Demo",
    email: "demo@vinsport.vn",
    password: "123456",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    password: "123456",
  },
];

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: "Thiếu email hoặc mật khẩu",
    });
  }

  const user = demoUsers.find(
    (item) =>
      item.email.toLowerCase() === String(email).toLowerCase() &&
      item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Tài khoản hoặc mật khẩu không chính xác",
    });
  }

  return res.json({
    message: "Đăng nhập thành công",
    token: "demo-token-vinsport-123",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = router;
