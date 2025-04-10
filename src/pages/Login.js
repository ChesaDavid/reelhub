import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { app } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in user:", userCredential.user);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google sign-in result:", result.user);
            navigate("/");
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white p-6">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        disabled={loading}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-2 rounded-lg w-full transition duration-300"
                    >
                        {loading ? "Logging in..." : "Login with Email"}
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
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-white disabled:bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="w-5 h-5" 
                    />
                    {loading ? "Connecting..." : "Login with Google"}
                </button>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?
                    <Link to="/register" className="text-blue-400 hover:underline ml-1">
                        Register
                    </Link>
                </p>
            </div>
        </main>
    );
}