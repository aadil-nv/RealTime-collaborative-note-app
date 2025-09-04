import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { clearUser } from "../redux/userSlice";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [newRoomId, setNewRoomId] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

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
      navigate(`/user/room/${data.room._id}`, {
        state: {
          userName: user.name || user.username,
          roomId: data.room._id,
          customRoomId: data.room.roomId,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const joinRoom = (room) => {
    navigate(`/user/room/${room._id}`, {
      state: {
        userName: user.name || user.username,
        roomId: room._id,
        customRoomId: room.roomId,
      },
    });
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomId.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Collaborative Notes</h2>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-2xl mb-4">
        <p className="text-gray-600">
          Welcome, <span className="font-semibold">{user.name || user.username}</span>
        </p>
      </div>

      {/* Create Room at Top */}
      <div className="w-full max-w-2xl mb-6">
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Create New Room</h4>
        <div className="flex gap-2 mb-4">
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

        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="bg-white shadow rounded-md p-4">
          {currentRooms.length === 0 ? (
            <p className="text-gray-500">No rooms available.</p>
          ) : (
            currentRooms.map((room) => (
              <div
                key={room._id}
                className="flex justify-between items-center mb-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => joinRoom(room)}
              >
                <div>
                  <p className="font-semibold">{room.roomId}</p>
                  <p className="text-sm text-gray-500">
                    Notes: {room.notes?.length || 0}
                  </p>
                </div>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinRoom(room);
                  }}
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
