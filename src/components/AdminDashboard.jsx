import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Only fetch users with role 'user', not admins
    axios.get("http://localhost:5000/api/users?role=user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
        setIsLoading(false);
        navigate("/");
      });
  }, [navigate]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      // Update the state to remove deleted user
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const toggleBlockUser = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/toggle-block/${id}`, {}, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      
      // Update user's block status in the state based on the returned status
      setUsers(users.map(user => 
        user._id === id ? {...user, isBlocked: response.data.isBlocked} : user
      ));
      
      alert(response.data.message);
    } catch (error) {
      console.error("Error toggling user block status:", error);
      alert("Failed to update user status");
    }
  };

  const handleLogout = () => {
    // Use the onLogout prop from parent component
    if (onLogout) {
      onLogout();
    } else {
      // Fallback if onLogout prop isn't provided
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      navigate("/");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 relative">
      <button
        onClick={handleLogout}
        className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
      >
        Logout
      </button>
      
      <h2 className="text-2xl font-semibold mb-4 mt-12">Admin Panel</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="mt-4">
          {users.map((user) => (
            <li key={user._id} className="border p-4 rounded mb-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                  <p><strong>Work:</strong> {user.work}</p>
                  <p><strong>Status:</strong> {user.isBlocked ? 
                    <span className="text-red-500 font-medium">Blocked</span> : 
                    <span className="text-green-500 font-medium">Active</span>}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => deleteUser(user._id)} 
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => toggleBlockUser(user._id, user.isBlocked)} 
                    className={`${user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-3 py-2 rounded cursor-pointer`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}