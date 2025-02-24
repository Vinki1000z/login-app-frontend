import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ setToken, setRole }) {
  const backend_url="https://login-app-backend-arev.onrender.com";
  const [form, setForm] = useState("login");
  const [user, setUser] = useState({ name: "", email: "", password: "", mobile: "", age: "", dob: "", work: "", role: "user" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = form === "login" ? "/api/users/login" : "/api/users/register";
      const { data } = await axios.post(`${backend_url}${url}`, user);
      console.log(data);

      if (form === "login") {
        // Store token & role
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.user.role);

        // Update parent state
        setToken(data.token);
        setRole(data.user.role);

        // Navigate based on role
        navigate(data.user.role === "admin" ? "/admin" : "/user");
      }
      setMessage(data.message || "Success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          {form === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {form === "register" && (
            <>
              <input type="text" name="name" placeholder="Name" className="input" onChange={handleChange} required />
              <select name="role" className="input" onChange={handleChange} required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </>
          )}
          <input type="email" name="email" placeholder="Email" className="input" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} required />
          {form === "register" && (
            <>
              <input type="text" name="mobile" placeholder="Mobile" className="input" onChange={handleChange} required />
              <input type="number" name="age" placeholder="Age" className="input" onChange={handleChange} required />
              <input type="date" name="dob" className="input" onChange={handleChange} required />
              <input type="text" name="work" placeholder="Work" className="input" onChange={handleChange} required />
            </>
          )}
          <button type="submit" className="btn">
            {form === "login" ? "Login" : "Register"}
          </button>
        </form>
        {message && <p className="text-center text-red-500 mt-2">{message}</p>}
        <p className="text-center mt-3 text-gray-600">
          {form === "login" ? "New user? " : "Already have an account? "}
          <button className="text-blue-500" onClick={() => setForm(form === "login" ? "register" : "login")}>
            {form === "login" ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
        }
        .btn {
          width: 100%;
          background: #007bff;
          color: white;
          padding: 10px;
          border-radius: 5px;
          cursor: pointer;
          border: none;
          font-weight: bold;
        }
        .btn:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
}
