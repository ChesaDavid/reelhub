import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";
import { app } from "../firebase";

export default function Register() {
    const [formData, setFormData] = useState({
        diplayName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  

    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.diplayName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    const handleEmailRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await updateProfile(userCredential.user, {
                displayName: formData.diplayName
            });

            setSuccess("Registration successful! Redirecting...");
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/");
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError(error.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white p-6">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleEmailRegister} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="username"
                        value={formData.diplayName}
                        onChange={handleInputChange}
                        placeholder="Username"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-2 rounded-lg w-full transition duration-300"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white disabled:bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="w-5 h-5" 
                    />
                    {loading ? "Connecting..." : "Continue with Google"}
                </button>

                <p className="text-center text-gray-400 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
}