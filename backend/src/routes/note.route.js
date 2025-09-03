const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRoom,
  addNote,
  updateNote,
  removeCollaborator,
  getAllRooms, // <- import the new controller
} = require("../controllers/note.controller");

// Create a room
router.post("/rooms", createRoom);

// Get all rooms
router.get("/rooms", getAllRooms);

// Get a specific room
router.get("/rooms/:roomId", getRoom);

// Add note to a room
router.post("/rooms/:roomId/notes", addNote);

// Update a note
router.put("/rooms/:roomId/notes/:noteId", updateNote);

// Remove collaborator from a note
router.put("/rooms/:roomId/notes/:noteId/remove-collaborator", removeCollaborator);

module.exports = router;
