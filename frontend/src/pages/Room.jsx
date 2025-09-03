/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axiosInstance from "../api/axiosInstance";
import CreateNote from "../components/CreateNote";
import EditNote from "../components/EditNote";

const SOCKET_URL = "http://localhost:7000";

export default function Room() {
  const [socket, setSocket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [roomData, setRoomData] = useState(null);

  const location = useLocation();
  const { roomId: urlRoomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const userName = location.state?.userName || user?.name || user?.username || 'Anonymous';
  const roomId = location.state?.roomId || urlRoomId;

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axiosInstance.get(`/notes/rooms/${roomId}`);
        if (data?.room) {
          setNotes(data.room.notes || []);
          setRoomData(data.room);
        }
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setTimeout(() => navigate('/'), 2000);
      }
    };
    if (roomId) fetchRoom();
  }, [roomId, navigate]);

  // Socket setup
  // Inside your useEffect for socket
useEffect(() => {
  if (!roomId || !userName) return;

  const s = io(SOCKET_URL);
  setSocket(s);

  s.emit("joinRoom", { roomId, username: userName });

  // Handle note creation
  s.on("noteCreated", (newNote) => {
    console.log("noteCreated", newNote);
    // newNote is already the populated note, no .data.note
    setNotes((prev) => [...prev, newNote]);
  });

  // Handle note update
  s.on("noteUpdated", (updatedNote) => {
    console.log("noteUpdated", updatedNote);
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  });

  return () => {
    s.emit("leaveRoom", { roomId, username: userName });
    s.disconnect();
  };
}, [roomId, userName]);


  if (!roomData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading room...</div>
      </div>
    );
  }

  // Format date nicely
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Room: {roomData.roomId || roomId}
          </h2>
          <p className="text-sm text-gray-500">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Logged in as <span className="font-semibold">{user.name}</span>
          </span>
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Back to Home
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            ➕ New Note
          </button>
        </div>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white p-4 rounded-md shadow-md">
                <h4 className="font-semibold mb-2">{note.title}</h4>
                <p className="mb-2 text-gray-700">{note.content}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Last updated: {formatDate(note.updatedAt)} | Active collaborators: {note.collaborators?.length || 0}
                  </p>
                  <button
                    onClick={() => setEditNote(note)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showCreate && (
          <CreateNote
            roomId={roomId}
            username={userName}
            socket={socket}
            onClose={() => setShowCreate(false)}
          />
        )}

        {editNote && (
          <EditNote
            note={editNote}
            roomId={roomId}
            username={userName}
            socket={socket}
            onClose={() => setEditNote(null)}
          />
        )}
      </main>
    </div>
  );
}
