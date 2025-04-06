import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Login failed");
            } else {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');  // Redirect to dashboard or home
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <main className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white p-6">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg w-full transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-blue-400 hover:underline ml-1"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </main>
    );
}
