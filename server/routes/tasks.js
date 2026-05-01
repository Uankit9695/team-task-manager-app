const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/auth");

// 🔹 CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json("Title and Project required");
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || []
    });

    res.json(task);
  } catch (err) {
    console.log("TASK CREATE ERROR:", err);
    res.status(500).json(err.message);
  }
});

// 🔹 GET TASKS (🔥 SAFE VERSION)
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "title");

    res.json(tasks);
  } catch (err) {
    console.log("GET TASK ERROR:", err);

    // 🔥 fallback (old data safe)
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch {
      res.json([]);
    }
  }
});

// 🔹 UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("assignedTo", "name")
      .populate("project", "title");

    res.json(updatedTask);
  } catch (err) {
    console.log("UPDATE TASK ERROR:", err);
    res.status(500).json(err.message);
  }
});

// 🔹 DASHBOARD
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