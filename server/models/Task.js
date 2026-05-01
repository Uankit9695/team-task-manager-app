const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: String,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },

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