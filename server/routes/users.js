const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, isAdmin } = require("../middleware/auth");

// 🔹 Get all users (Admin only)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log("USER ERROR:", err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;