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
      socket.emit("updateNote", { roomId, noteId: note._id, title, content, username, userId: user.userId });
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if content has changed
  const hasChanges = title !== note.title || content !== note.content;

  return (
    <Modal onClose={onClose}>
      <div className="transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-4">
        {/* Header with Icon and Animation */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 animate-in fade-in duration-700">Edit Note</h3>
            <p className="text-sm text-gray-600 animate-in fade-in duration-700 delay-100">Update and improve your note</p>
          </div>
        </div>

        {/* Change Indicator */}
        {hasChanges && (
          <div className="animate-in slide-in-from-top duration-300 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-800 font-medium">Unsaved changes detected</span>
            </div>
          </div>
        )}

        {/* Form Fields with Staggered Animation */}
        <div className="space-y-6">
          {/* Title Input */}
          <div className="animate-in slide-in-from-left duration-500 delay-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Title
            </label>
            <div className="relative group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-300 hover:shadow-sm transform focus:scale-[1.02]"
              />
              {title !== note.title && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none animate-in fade-in duration-300">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600 font-medium">Modified</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="animate-in slide-in-from-right duration-500 delay-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note Content
            </label>
            <div className="relative group">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder-gray-400 text-gray-900 bg-white hover:border-gray-300 hover:shadow-sm resize-none transform focus:scale-[1.01] min-h-[120px]"
                rows={5}
              />
              {content !== note.content && (
                <div className="absolute bottom-3 right-3 animate-in fade-in duration-300">
                  <div className="flex items-center space-x-1 bg-white rounded-full px-2 py-1 shadow-sm border">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600 font-medium">Editing</span>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Refine your thoughts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="animate-in fade-in duration-500 delay-400">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last saved: {new Date(note.updatedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${title ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${content ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${hasChanges ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
                <span className="text-gray-600">
                  {hasChanges ? 'Ready to save changes' : 'No changes made'}
                </span>
              </div>
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
              <span>{hasChanges ? 'Discard' : 'Close'}</span>
            </span>
          </button>
          
          <button
            onClick={handleUpdate}
            disabled={loading || !hasChanges}
            className={`group px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-4 shadow-lg hover:shadow-xl ${
              loading 
                ? 'bg-green-400 cursor-not-allowed focus:ring-green-200' 
                : !hasChanges
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-200'
            } text-white`}
          >
            <span className="flex items-center space-x-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : hasChanges ? (
                <>
                  <svg className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Up to date</span>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-8 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-16 right-16 w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-20 animation-delay-1000"></div>
          <div className="absolute bottom-16 left-16 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-20 animation-delay-2000"></div>
          <div className="absolute bottom-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-20 animation-delay-3000"></div>
          {hasChanges && (
            <>
              <div className="absolute top-12 left-1/2 w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-30 animation-delay-500"></div>
              <div className="absolute bottom-12 left-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping opacity-30 animation-delay-1500"></div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-in {
          animation-fill-mode: both;
        }
        .slide-in-from-bottom-4 {
          animation: slideInFromBottom 0.5s ease-out;
        }
        .slide-in-from-top {
          animation: slideInFromTop 0.3s ease-out;
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
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
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
        @keyframes slideInFromTop {
          from {
            transform: translateY(-16px);
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
      `}</style>
    </Modal>
  );
}