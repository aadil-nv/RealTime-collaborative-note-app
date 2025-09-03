import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoadingFallback from "./components/LoadingFallback";

// Lazy load route groups
const PublicRoutes = lazy(() =>
  import("./routes/PublicRoute").then((module) => ({
    default: module.PublicRoutes,
  }))
);

const UserRoutes = lazy(() =>
  import("./routes/UserRoutes").then((module) => ({
    default: module.UserRoutes,
  }))
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public pages (login, signup, landing, etc.) */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* Protected user pages (home, room, etc.) */}
          <Route path="/user/*" element={<UserRoutes />} />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
