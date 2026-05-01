router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body; // ❌ role हटाओ

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin"   // 🔥 हर user admin बनेगा
    });

    const { password: pwd, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    res.status(500).json(err.message);
  }
});