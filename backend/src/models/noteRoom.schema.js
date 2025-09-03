const mongoose = require("mongoose");
const noteSchema = require("./note.schema");

const noteRoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  adminId: { type: String },
  notes: [noteSchema],
});

module.exports = mongoose.model("NoteRoom", noteRoomSchema);
