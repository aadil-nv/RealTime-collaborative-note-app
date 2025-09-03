import React from "react";

export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md shadow-md relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
