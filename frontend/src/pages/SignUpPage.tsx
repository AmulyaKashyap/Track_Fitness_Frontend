import { UserPlus } from 'lucide-react';
import api from '../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Password: at least 8 alphanumeric characters
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    const signUp = async (email: string, password: string) => {
        await api.post("/createUser", { name: email, password });
    };

    const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters and contain both letters and numbers.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await signUp(email, password);
            alert("Account created! Please log in.");
            navigate("/login");
        } catch (err: any) {
            alert("Sign up failed!\n" + err.message);
        }
    };

    return (
        <div className="flex flex-col bg-[url('./assets/background.png')] bg-cover bg-center bg-no-repeat items-center justify-center p-6 rounded-3xl shadow-lg h-screen">
            <div className="w-1/2 bg-[#00000063] text-white p-8 rounded-3xl shadow-lg flex flex-col items-center">
                <img src="src/assets/logo_1.png" alt="Logo" className="w-42 h-42 mb-4" />
                <form>
                    <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5">
                        <input
                            className='appearance-none border-none outline-none p-0 m-0 bg-transparent'
                            type="email"
                            id="username"
                            name="username"
                            placeholder='Email address...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5">
                        <input
                            className='appearance-none border-none outline-none p-0 m-0 bg-transparent'
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Password...'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5">
                        <input
                            className='appearance-none border-none outline-none p-0 m-0 bg-transparent'
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder='Confirm Password...'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="rounded-3xl shadow-lg flex flex-col justify-start gap-4">
                        <button
                            onClick={handleSignUp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
                        >
                            <UserPlus size={20} />
                            Sign Up
                        </button>
                        <a href="/login" className="w-full flex items-center justify-center text-gray-400 text-sm my-10">Already have an account? Log In</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;