const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  let token;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else {
    token = header;
  }

  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Invalid token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Admin only");
  }
  next();
};

module.exports = { protect, isAdmin };