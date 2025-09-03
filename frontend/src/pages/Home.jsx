import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { clearUser } from "../redux/userSlice";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [newRoomId, setNewRoomId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Fetch all rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axiosInstance.get("/notes/rooms");
        setRooms(data.rooms || []);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    if (!newRoomId) return alert("Enter room ID");
    try {
      const { data } = await axiosInstance.post("/notes/rooms", {
        roomId: newRoomId,
        adminId: user.userId,
      });
      
      // Navigate with state containing userName and roomId
      navigate(`/user/room/${data.room._id}`, {
        state: {
          userName: user.name || user.username, // Adjust based on your user object structure
          roomId: data.room._id,
          customRoomId: data.room.roomId // if you need the custom room ID too
        }
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const joinRoom = (room) => {
    // Navigate with state containing userName and roomId
    navigate(`/user/room/${room._id}`, {
      state: {
        userName: user.name || user.username, // Adjust based on your user object structure
        roomId: room._id,
        customRoomId: room.roomId // if you need the custom room ID too
      }
    });
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Collaborative Notes</h2>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="w-full max-w-2xl mb-4">
        <p className="text-gray-600">
          Welcome, <span className="font-semibold">{user.name || user.username}</span>
        </p>
      </div>

      {/* Rooms List */}
      <div className="w-full max-w-2xl mb-6">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Available Rooms</h4>
        <div className="bg-white shadow rounded-md p-4">
          {rooms.length === 0 ? (
            <p className="text-gray-500">No rooms available.</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room._id}
                className="flex justify-between items-center mb-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => joinRoom(room)}
              >
                <div>
                  <p className="font-semibold">{room.roomId}</p>
                  <p className="text-sm text-gray-500">
                    Active Users: {room.activeUsers?.length || 0}
                  </p>
                </div>
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the div onClick from firing
                    joinRoom(room);
                  }}
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Room Section */}
      <div className="w-full max-w-2xl">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Create New Room</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New Room ID"
            value={newRoomId}
            className="flex-1 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setNewRoomId(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}