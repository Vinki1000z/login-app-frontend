import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

function ProtectedRoutes() {
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  useEffect(() => {
    if (token && role) {
      navigate(role === "admin" ? "/admin" : "/user"); // Redirect when user logs in
    }
  }, [token, role, navigate]);

  return (
    <Routes>
      <Route path="/" element={<AuthPage setToken={setToken} setRole={setRole} />} />
      <Route path="/user" element={token && role === "user" ? <UserDashboard /> : <Navigate to="/" />} />
      <Route path="/admin" element={token && role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ProtectedRoutes />
    </Router>
  );
}
