const express = require("express");
const router = express.Router();

const { verifyToken, requireAdmin } = require("../middlewares/authMiddleware");
const {
  getAdminUsers,
  updateAdminUser,
} = require("../controllers/adminUserController");

router.get("/", verifyToken, requireAdmin, getAdminUsers);
router.put("/:id", verifyToken, requireAdmin, updateAdminUser);

module.exports = router;