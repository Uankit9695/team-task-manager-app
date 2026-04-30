const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { protect, isAdmin } = require("../middleware/auth");

// 🔹 Create Project
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json("Title required");
    }

    const project = await Project.create({
      title: req.body.title,
      createdBy: req.user.id,
      members: []
    });

    res.json(project);
  } catch (err) {
    console.log("CREATE PROJECT ERROR:", err);
    res.status(500).json("Server Error");
  }
});

// 🔹 Get Projects
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name");

    res.json(projects);
  } catch (err) {
    console.log("GET PROJECT ERROR:", err);
    res.status(500).json("Server Error");
  }
});

// 🔹 Add Multiple Members (FINAL)
router.put("/:id/members", protect, isAdmin, async (req, res) => {
  try {
    const { members } = req.body;

    if (!members || members.length === 0) {
      return res.status(400).json("Members required");
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { members: { $each: members } } // 🔥 MULTIPLE ADD
      },
      { returnDocument: "after" }
    ).populate("members", "name");

    res.json(project);
  } catch (err) {
    console.log("ADD MEMBER ERROR:", err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;