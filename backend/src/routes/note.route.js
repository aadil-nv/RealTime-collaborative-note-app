const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRoom,
  addNote,
  updateNote,
  removeCollaborator,
  getAllRooms, 
} = require("../controllers/note.controller");

router.post("/rooms", createRoom);
router.get("/rooms", getAllRooms);
router.get("/rooms/:roomId", getRoom);
router.post("/rooms/:roomId/notes", addNote);
router.put("/rooms/:roomId/notes/:noteId", updateNote);
router.put("/rooms/:roomId/notes/:noteId/remove-collaborator", removeCollaborator);

module.exports = router;
