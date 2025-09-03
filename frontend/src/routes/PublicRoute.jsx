import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Login";

export function PublicRoutes() {
  const { userId } = useSelector((state) => state.user);

  // If user is logged in, redirect to /user/home
  if (userId) {
    return <Navigate to="/user/home" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Optional: redirect unknown public paths to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
