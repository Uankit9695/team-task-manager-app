const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth"); // 🔥 isAdmin हटाया

// 🔹 Get all users
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.log("USER ERROR:", err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;