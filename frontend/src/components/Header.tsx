import { useStore } from '../store/store';
import { Menu } from 'lucide-react';

const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options as Intl.DateTimeFormatOptions);
};

function Header() {
    const { setIsSidebarOpen } = useStore();

    return (
        <header className="sticky top-0 z-30 bg-[#1a1e2a] px-2 sm:px-4 lg:px-8 py-1 shadow-xl flex items-center justify-between flex-wrap">
            <div className="flex items-center w-full sm:w-auto">
                <img src="/src/assets/logo_1.png" alt="Logo" className="size-16 sm:size-25" />
                <div className="flex flex-col pl-4 sm:pl-10">
                    <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-50 inline whitespace-nowrap">
                        Welcome, Amulya Kashyap👋
                    </h1>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{getCurrentDate()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-200 transition-colors hover:bg-gray-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                </button>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 sm:p-1 text-gray-400 hover:text-gray-200 transition-colors"
                    aria-label="Open sidebar"
                >
                    <Menu size={28} />
                </button>
            </div>
        </header>
    )
}

export default Header;