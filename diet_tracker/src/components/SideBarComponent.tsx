
import { Utensils, Dumbbell, Trophy, LayoutDashboard, X, LogOut, User } from 'lucide-react';
import { useStore } from "../store/store";

function SideBarComponent() {
    const { setIsSidebarOpen, isSidebarOpen } = useStore();

    return (
        <aside
            className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#1a1e2a] p-6 shadow-xl transform transition-transform duration-300 ease-in-out rounded-r-3xl
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                        AK
                    </div>
                    <span className="text-xl font-bold text-gray-50 tracking-wide">OPTIONS: </span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Close sidebar"
                >
                    <X size={24} />
                </button>
            </div>
            <nav className="flex-1">
                <ul className="space-y-3">
                    <li>
                        <a href="/" className="flex items-center gap-3 p-3 bg-fuchsia-600/30 text-fuchsia-300 rounded-xl font-semibold shadow-md transition-colors hover:bg-fuchsia-600/40">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-fuchsia-600/10 hover:text-fuchsia-300">
                            <Utensils size={20} />
                            Diet Tracker
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-fuchsia-600/10 hover:text-fuchsia-300">
                            <Dumbbell size={20} />
                            Exercise Log
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-fuchsia-600/10 hover:text-fuchsia-300">
                            <Trophy size={20} />
                            Achievements
                        </a>
                    </li>

                    <li>
                        <a href="/profile" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-fuchsia-600/10 hover:text-fuchsia-300">
                            <User size={20} />
                            Profile
                        </a>
                    </li>
                    <li>
                        <a href="/login" className="flex items-center gap-3 p-3 text-gray-400 rounded-xl font-semibold transition-colors hover:bg-fuchsia-600/10 hover:text-fuchsia-300">
                            <LogOut size={20} />
                            Log Out
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default SideBarComponent;