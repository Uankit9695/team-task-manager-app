const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  // 🔥 MULTIPLE USERS SUPPORT
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo"
  },

  dueDate: Date
});

module.exports = mongoose.model("Task", taskSchema);