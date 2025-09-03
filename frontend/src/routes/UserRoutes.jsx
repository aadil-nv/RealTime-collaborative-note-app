import React from "react"; 
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ correct
import { useSelector } from "react-redux";
import Home from "../pages/Home";
import Room from "../pages/Room";

export function UserRoutes() {
  const { userId } = useSelector((state) => state.user);
  console.log("user id from userroutes", userId);
  

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="room/:roomId" element={<Room />} />
    </Routes>
  );
}
