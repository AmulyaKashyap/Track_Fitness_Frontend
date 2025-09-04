import { LogIn } from "lucide-react";
import api from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showLoader, setShowLoader] = useState(false); // ✅ Loader state
    const navigate = useNavigate();

    interface LoginResponse {
        accessToken: string;
    }

    const login = async (email: string, password: string) => {
        const response = await api.post<LoginResponse>("/loginUser", {
            email,
            password,
        });
        return response.data;
    };

    const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setShowLoader(true);
        try {
            const data = await login(email, password);
            localStorage.setItem("accessToken", data.accessToken);
            navigate("/");
        } catch (err: any) {
            alert("Login failed!\nUsername or Password incorrect\n" + err.message);
        } finally {
            setShowLoader(false);
        }
    };

    const handleGoogleLogin = () => {
        setShowLoader(true);
        setTimeout(
            window.location.href =
            "http://localhost:8080/api/oauth2/authorization/google", 10000);
    };

    return (
        <div className="relative h-screen">
            {/* Loader Overlay */}
            {showLoader && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex flex-col items-center justify-center z-50 pointer-events-auto">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white mt-4 font-medium drop-shadow-md">Logging in...</p>
                </div>
            )}

            {/* Page Content (always visible) */}
            <div className="flex flex-col bg-cover bg-center bg-no-repeat items-center justify-center p-6 rounded-3xl shadow-lg h-full">
                <div className="w-1/2 bg-[#00000063] text-white p-8 rounded-3xl shadow-lg flex flex-col items-center relative z-10">
                    <img
                        src="src/assets/logo_1.png"
                        alt="Logo"
                        className="w-42 h-42 mb-4"
                    />
                    <form>
                        {/* Username Input */}
                        <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5">
                            <input
                                className="appearance-none border-none outline-none p-0 m-0 bg-transparent w-full"
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5">
                            <input
                                className="appearance-none border-none outline-none p-0 m-0 bg-transparent w-full"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Buttons */}
                        <div className="rounded-3xl shadow-lg flex flex-col justify-start gap-4">
                            <button
                                onClick={handleLogin}
                                disabled={showLoader}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 ${showLoader
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600"
                                    } text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]`}
                            >
                                <LogIn size={20} />
                                Log In
                            </button>

                            <span className="w-full flex items-center justify-center text-gray-400 text-sm">
                                OR
                            </span>

                            {/* Google Login */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={showLoader}
                                className="rounded-2xl bg-white flex items-center justify-center text-black font-bold text-sm gap-2 px-3 py-2 hover:bg-gray-200 transition-all"
                            >
                                <img
                                    src="src/assets/google.svg"
                                    alt="G"
                                    className="w-6 h-6"
                                />{" "}
                                Sign in with Google
                            </button>

                            <a
                                href="/signUp"
                                className="w-full flex items-center justify-center text-gray-400 text-sm my-10"
                            >
                                New User? Create Account
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
