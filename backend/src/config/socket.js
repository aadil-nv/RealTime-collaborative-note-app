const { Server } = require("socket.io");
const NoteRoom = require("../models/noteRoom.schema");

const activeUsers = {}; // track users per room

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

   socket.on("joinRoom", async ({ roomId, username }) => {
  socket.join(roomId);

  if (!activeUsers[roomId]) activeUsers[roomId] = new Set();
  activeUsers[roomId].add(username);

  // Emit active users
  io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));

  // Notify others in the room
  socket.to(roomId).emit("userJoined", { username });
});

    socket.on("leaveRoom", async ({ roomId, username }) => {
  socket.leave(roomId);
  if (activeUsers[roomId]) {
    activeUsers[roomId].delete(username);
    io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));
    socket.to(roomId).emit("userLeft", { username });
  }
});

    socket.on("updateNote", async ({ roomId, noteId, title, content, userId }) => {
  try {
    console.log("calling updateNote", { roomId, noteId, title, content, userId });

    const room = await NoteRoom.findById(roomId);
    if (!room) return;

    const note = room.notes.id(noteId);
    if (!note) return;

    // Update note fields
    note.title = title || note.title;
    note.content = content || note.content;

    // Ensure collaborators array exists
    if (!Array.isArray(note.collaborators)) note.collaborators = [];

    // Add user to collaborators if:
    // 1. user is not the admin
    // 2. user is not already a collaborator
    if (room.adminId.toString() !== userId && !note.collaborators.includes(userId)) {
      note.collaborators.push(userId);
    }

    note.updatedAt = new Date();
    await room.save();

    // Populate collaborators before emitting
    const populatedRoom = await room.populate({
      path: "notes.collaborators",
      select: "username email name",
    });

    io.to(roomId).emit("noteUpdated", populatedRoom.notes.id(noteId));

    // Emit active users in room
    if (activeUsers[roomId]) {
      io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));
    }
  } catch (err) {
    socket.emit("error", err.message);
  }
});




    socket.on("createNote", async ({ roomId, title, content, userId }) => {
  try {
    const room = await NoteRoom.findById(roomId);
    if (!room) return;

    // Create new note with collaborators as ObjectId array
    const newNote = {
      title,
      content,
      collaborators: [userId], // push the user's ObjectId
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    room.notes.push(newNote);
    await room.save();

    // Populate collaborators before emitting
    const populatedRoom = await NoteRoom.findById({ _id: roomId}).populate({
      path: 'notes.collaborators',
      select: 'name username',
    });

    const createdNote = populatedRoom.notes.id(room.notes[room.notes.length - 1]._id);
    console.log("createdNote==========111", createdNote );
    

    // Emit the newly created note
    io.to(roomId).emit("noteCreated", createdNote);
  } catch (err) {
    socket.emit("error", err.message);
  }
});



    socket.on("disconnecting", () => {
  for (const roomId of socket.rooms) {
    if (roomId === socket.id) continue;
    if (activeUsers[roomId]) {
      activeUsers[roomId].delete(socket.username);
      io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));
      socket.to(roomId).emit("userLeft", { username: socket.username });
    }
  }
});
  });

  return io;
};

module.exports = initSocket;
