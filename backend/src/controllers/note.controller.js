const NoteRoom = require("../models/noteRoom.schema");
const User = require("../models/user.schema"); // Make sure you have a User model

// Create Note Room
exports.createRoom = async (req, res, next) => {
  try {
    const { roomId, adminId } = req.body;
    if (!roomId) return res.status(400).json({ message: "roomId required" });

    const room = await NoteRoom.create({ roomId, adminId, notes: [] });
    res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
};

// Get Note Room
exports.getRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await NoteRoom.findOne({ _id: roomId })
      .populate("notes.collaborators", "username email"); // populate user details
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ room });
  } catch (err) {
    next(err);
  }
};

// Add Note
exports.addNote = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { title, content, userId } = req.body; // pass userId instead of username

    const room = await NoteRoom.findOne({ _id: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const note = { title, content, collaborators: [userId] };
    room.notes.push(note);
    await room.save();

    // Populate collaborators before sending response
    const savedNote = room.notes[room.notes.length - 1];
    await savedNote.populate("collaborators", "username email");

    res.status(201).json({ note: savedNote });
  } catch (err) {
    next(err);
  }
};

// Update Note
exports.updateNote = async (req, res, next) => {
  try {
    const { roomId, noteId } = req.params;
    const { title, content, userId } = req.body; // pass userId

    const room = await NoteRoom.findOne({ _id: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const note = room.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title || note.title;
    note.content = content || note.content;

    // Add user to collaborators if not already there
    if (!note.collaborators.includes(userId) && room.adminId.toString() !== userId) {
      note.collaborators.push(userId);
    }

    note.updatedAt = new Date();
    await room.save();

    await note.populate("collaborators", "username email"); // populate before sending

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// Remove Collaborator
exports.removeCollaborator = async (req, res, next) => {
  try {
    const { roomId, noteId } = req.params;
    const { userId } = req.body;

    const room = await NoteRoom.findOne({ _id: roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });

    const note = room.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.collaborators = note.collaborators.filter((u) => u.toString() !== userId);
    await room.save();

    await note.populate("collaborators", "username email");

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// Get All Rooms
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await NoteRoom.find({}, { roomId: 1, adminId: 1, notes: 1 })
      .populate("notes.collaborators", "username email"); // populate collaborators in all notes
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
};
