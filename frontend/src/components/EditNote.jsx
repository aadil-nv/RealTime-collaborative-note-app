import React, { useState } from "react";
import Modal from "./Modal";
import { useSelector } from "react-redux";

export default function EditNote({ note, roomId, username, socket, onClose }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  const handleUpdate = async () => {
    if (!socket) return alert("Socket not connected");
    try {
      setLoading(true);
      socket.emit("updateNote", { roomId, noteId: note._id, title, content, username,userId:user.userId });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}
