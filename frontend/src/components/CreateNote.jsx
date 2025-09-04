import React, { useState } from "react";
import Modal from "./Modal";

export default function CreateNote({ roomId, username, onClose, socket }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!title) return alert("Title is required");
    if (!socket) return alert("Socket not connected");

    setLoading(true);

    socket.emit("createNote", { roomId, title, content, username });

    setTitle("");
    setContent("");
    setLoading(false);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Content"
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
          onClick={handleCreate}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </Modal>
  );
}
