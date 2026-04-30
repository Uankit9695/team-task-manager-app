const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect, isAdmin } = require("../middleware/auth");

// 🔹 Create Task (Admin only)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Get Tasks
// Admin → all tasks
// Member → only assigned tasks
router.get("/", protect, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name");
    } else {
      tasks = await Task.find({
        assignedTo: { $in: [req.user.id] } // 🔥 FIX
      }).populate("assignedTo", "name");
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Update Task (Admin OR assigned user)
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json("Task not found");

    const isOwner = task.assignedTo?.includes(req.user.id); // 🔥 FIX
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return res.status(403).json("Not allowed");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    ).populate("assignedTo", "name");

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔹 Dashboard API
router.get("/dashboard", protect, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({
        assignedTo: { $in: [req.user.id] } // 🔥 FIX
      });
    }

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Done").length;
    const pending = tasks.filter(t => t.status !== "Done").length;

    const overdue = tasks.filter(
      t => t.dueDate && t.dueDate < new Date() && t.status !== "Done"
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;