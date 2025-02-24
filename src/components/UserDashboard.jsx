import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
    const backend_url="https://login-app-backend-arev.onrender.com";
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        axios.get(`${backend_url}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                setUser(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("API Error:", err.response?.data || err);
                // Don't navigate here, just show error state
                setIsLoading(false);
            });
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/");
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <>
            <button
                onClick={handleLogout}
                className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
                {user ? (
                    <div className="border p-4 rounded">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>Work:</strong> {user.work}</p>
                    </div>
                ) : (
                    <p>Error loading user data. <button onClick={() => window.location.reload()} className="text-blue-500 underline">Retry</button></p>
                )}
            </div>
        </>
    );
}