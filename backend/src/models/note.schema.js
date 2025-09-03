const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure your User model is named "User"
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = noteSchema;
