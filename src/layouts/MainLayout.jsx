import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import Galaxy from '../components/Galaxy';
import ClickSpark from '../components/ClickSpark';
import { useTheme } from '../context/ThemeProvider';

export default function MainLayout() {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <ClickSpark isDark={dark}>
      <div className={`${dark ? "app dark" : "app light"} h-screen w-full overflow-y-auto pb-24 relative flex flex-col items-center`}>
        <Galaxy isDark={dark} />
        
        {/* Sleek Modern Header */}
        <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 flex justify-between items-center backdrop-blur-xl bg-[rgba(11,31,42,0.6)] border-b border-[rgba(255,255,255,0.05)] transition-all duration-300">
          <div className="flex items-center gap-4">
            {!isHome && (
              <button 
                className="flex items-center justify-center p-2 rounded-full hover:bg-[rgba(255,255,255,0.1)] text-[#7fdfff] hover:text-white transition-all active:scale-95" 
                onClick={() => navigate("/")}
              >
                <Home size={20} />
              </button>
            )}
            <div 
              className="font-black text-lg md:text-xl tracking-widest text-[#00d2ff] drop-shadow-[0_0_8px_rgba(0,210,255,0.5)] cursor-pointer hover:scale-105 transition-transform" 
              onClick={() => navigate("/")}
            >
              MARKSPRINT
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              className="text-xs md:text-sm font-semibold tracking-wide text-gray-300 hover:text-[#00d2ff] transition-colors"
              onClick={() => navigate("/about")}
            >
              ABOUT
            </button>
            <div 
              className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform drop-shadow-md hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
              onClick={toggleTheme}
            >
              {dark ? "🌙" : "☀️"}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="w-full flex-1 flex flex-col relative z-10 p-4">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="w-full py-6 mt-auto border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)] backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2 text-xs md:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} MARKSPRINT. An Open-Source Project.</p>
          <p className="opacity-75 flex items-center gap-1 mt-1">Proudly hosted on <span className="text-white font-bold tracking-widest">▲ Vercel</span></p>
        </footer>
      </div>
    </ClickSpark>
  );
}
