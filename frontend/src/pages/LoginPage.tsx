import { LogIn } from 'lucide-react';

function LoginPage() {
    return (
        <div className='flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg h-screen'>
            <div className="w-1/2 bg-[#1a1e2a] text-white p-8 rounded-3xl shadow-lg flex flex-col items-center">
                <img src="src/assets/logo_1.png" alt="Logo" className="w-42 h-42 mb-4" />
                <form>
                    <div className="bg-[#ffffff3d] px-4 py-2 text-white rounded-2xl my-5" >
                        <input className='appearance-none border-none outline-none p-0 m-0 bg-tansparent' type="text" id="username" name="username" placeholder='Username...' required />
                    </div>
                    <div className="bg-[#ffffff3d]  px-4 py-2 text-white rounded-2xl my-5" >
                        <input className='appearance-none border-none outline-none p-0 m-0 bg-tansparent' type="password" id="password" name="password" placeholder='Password...' required />
                    </div>
                    <div className="bg-[#1a1e2a]  rounded-3xl shadow-lg flex flex-col justify-start gap-4">
                        <a
                            href='/'
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 bg-gradient-to-r from-pink-500 to-fuchsia-500  hover:from-pink-600 hover:to-fuchsia-600 text-white font-semibold rounded-xl transition-all duration-300  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-[#1a1e2a]"
                        >
                            <LogIn size={20} />
                            Log In
                        </a>
                        <span className="w-full flex items-center justify-center text-gray-400 text-sm">OR</span>
                        <div className="rounded-2xl bg-white flex items-center justify-center text-black font-bold text-sm gap-2 px-3 py-2">
                            <img src='src/assets/google.svg' alt="G" className="w-6 h-6" /> Sign in with Google
                        </div>
                        <a href="#" className="w-full flex items-center justify-center text-gray-400 text-sm my-10">New User? Create Account</a>
                    </div>
                </form>
            </div >
        </div >
    );

}
export default LoginPage;
