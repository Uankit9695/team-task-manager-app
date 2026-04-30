const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks")); 
app.use("/api/users", require("./routes/users"));  // ✅ ADD THIS LINE

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});