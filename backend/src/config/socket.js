const { Server } = require("socket.io");
const NoteRoom = require("../models/noteRoom.schema");

const activeUsers = {};

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

      io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));

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

    socket.on(
      "updateNote",
      async ({ roomId, noteId, title, content, userId }) => {
        try {
          console.log("calling updateNote", {
            roomId,
            noteId,
            title,
            content,
            userId,
          });

          const room = await NoteRoom.findById(roomId);
          if (!room) return;

          const note = room.notes.id(noteId);
          if (!note) return;

          note.title = title || note.title;
          note.content = content || note.content;

          if (!Array.isArray(note.collaborators)) note.collaborators = [];

          if (
            room.adminId.toString() !== userId &&
            !note.collaborators.includes(userId)
          ) {
            note.collaborators.push(userId);
          }

          note.updatedAt = new Date();
          await room.save();

          const populatedRoom = await room.populate({
            path: "notes.collaborators",
            select: "username email name",
          });

          io.to(roomId).emit("noteUpdated", populatedRoom.notes.id(noteId));

          if (activeUsers[roomId]) {
            io.to(roomId).emit("activeUsers", Array.from(activeUsers[roomId]));
          }
        } catch (err) {
          socket.emit("error", err.message);
        }
      }
    );

    socket.on("createNote", async ({ roomId, title, content, userId }) => {
      try {
        const room = await NoteRoom.findById(roomId);
        if (!room) return;

        const newNote = {
          title,
          content,
          collaborators: [userId],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        room.notes.push(newNote);
        await room.save();

        const populatedRoom = await NoteRoom.findById({ _id: roomId }).populate(
          {
            path: "notes.collaborators",
            select: "name username",
          }
        );

        const createdNote = populatedRoom.notes.id(
          room.notes[room.notes.length - 1]._id
        );

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
