import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage setToken={setToken} setRole={setRole} />} />
        <Route
          path="/user"
          element={token && role === "user" ? <UserDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={token && role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
