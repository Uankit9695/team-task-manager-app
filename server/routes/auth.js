const express = require("express");
const router = express.Router();   // 🔥 MUST

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin"
    });

    const { password: pwd, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      { id: user._id, role: "admin" },  // 🔥 FORCE ADMIN
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;   // 🔥 MUST