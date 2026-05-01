const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/auth"); // 🔥 isAdmin हटाया

// 🔹 Create Task
router.post("/", protect, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Get Tasks
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "title");

    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Update Task
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("assignedTo", "name");

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Dashboard
router.get("/dashboard", protect, async (req, res) => {
  try {
    const tasks = await Task.find();

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Done").length;
    const pending = tasks.filter(t => t.status !== "Done").length;

    const overdue = tasks.filter(
      t => t.dueDate && t.dueDate < new Date() && t.status !== "Done"
    ).length;

    res.json({ total, completed, pending, overdue });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;