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
      <div className="transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-4">
        {/* Header with Icon and Animation */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 animate-in fade-in duration-700">Create New Note</h3>
            <p className="text-sm text-gray-600 animate-in fade-in duration-700 delay-100">Share your ideas with the team</p>
          </div>
        </div>

        {/* Form Fields with Staggered Animation */}
        <div className="space-y-6">
          {/* Title Input */}
          <div className="animate-in slide-in-from-left duration-500 delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-2 transform transition-colors duration-200">
              Note Title
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Enter a descriptive title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-300 hover:shadow-sm transform focus:scale-[1.02]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="animate-in slide-in-from-right duration-500 delay-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <div className="relative group">
              <textarea
                placeholder="Write your note content here... Share your thoughts, ideas, or important information."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-300 hover:shadow-sm resize-none transform focus:scale-[1.01] min-h-[120px]"
                rows={5}
              />
              <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Express yourself</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="animate-in fade-in duration-500 delay-400">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${title ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${content ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${title && content ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
              </div>
              <span className="text-gray-600">
                {title && content ? 'Ready to create!' : title ? 'Add some content...' : 'Start with a title...'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Animation */}
        <div className="flex justify-end space-x-3 mt-8 animate-in slide-in-from-bottom duration-500 delay-500">
          <button
            onClick={onClose}
            className="group px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-200 hover:scale-105 hover:shadow-lg transform active:scale-95 focus:ring-4 focus:ring-gray-200"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </span>
          </button>
          
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white`}
          >
            <span className="flex items-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Note</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Floating Particles Animation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20 animation-delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-20 animation-delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-20 animation-delay-3000"></div>
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          animation-fill-mode: both;
        }
        .slide-in-from-bottom-4 {
          animation: slideInFromBottom 0.5s ease-out;
        }
        .slide-in-from-left {
          animation: slideInFromLeft 0.5s ease-out;
        }
        .slide-in-from-right {
          animation: slideInFromRight 0.5s ease-out;
        }
        .slide-in-from-bottom {
          animation: slideInFromBottom 0.3s ease-out;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }

        @keyframes slideInFromBottom {
          from {
            transform: translateY(16px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-16px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInFromRight {
          from {
            transform: translateX(16px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Modal>
  );
}