import React from "react";
import NoteEditor from "./EditNote";

export default function NoteList({ notes, socket, roomId, username }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteEditor key={note._id} note={note} socket={socket} roomId={roomId} username={username} />
      ))}
    </div>
  );
}
