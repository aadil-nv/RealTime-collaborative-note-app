import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { setUser } from "../redux/userSlice";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !email) return alert("Enter name and email");
    try {
      const { data } = await axiosInstance.post("/users/", { name, email });
      console.log("data", data._id);

      dispatch(setUser({ userId: data._id, name: data.username, email: data.email }));

      if (data._id) {
        navigate("/user/home");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Login</h2>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-3 px-3 py-2 border rounded-md"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full mb-3 px-3 py-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
