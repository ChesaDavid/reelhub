import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration failed");
            } else {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <main className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white p-6">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg w-full transition duration-300"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Do you have an account?
                    <Link
                        to="/login"
                        className="text-blue-400 hover:underline ml-1"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}
