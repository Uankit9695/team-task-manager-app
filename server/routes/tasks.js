const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");

// 🔹 Create Task
router.post("/", protect, async (req, res) => {
  try {
    const { title, project, assignedTo } = req.body;

    // 🔥 VALIDATION
    if (!title || !project) {
      return res.status(400).json("Title and Project are required");
    }

    const task = await Task.create({
      title,
      project,
      assignedTo: assignedTo || []
    });

    res.json(task);
  } catch (err) {
    console.log("TASK CREATE ERROR:", err);  // 🔥 important
    res.status(500).json(err.message);
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
    console.log("GET TASK ERROR:", err);
    res.status(500).json(err.message);
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
    console.log("UPDATE TASK ERROR:", err);
    res.status(500).json(err.message);
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
    console.log("DASHBOARD ERROR:", err);
    res.status(500).json(err.message);
  }
});

module.exports = router;