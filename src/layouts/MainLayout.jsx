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
        
        {/* Persistent Header */}
        <div className="header sticky top-0 z-50 w-full flex justify-between items-center px-4 h-16 bg-[#100063] border-b-2 border-[#2aa8d8]">
          <div className="w-10">
            {!isHome && (
              <button className="back-btn flex items-center justify-center text-[#7fdfff] hover:text-white transition-colors" onClick={() => navigate("/")}>
                <Home size={20} />
              </button>
            )}
          </div>
          
          <div className="logo font-bold tracking-widest text-white cursor-pointer" onClick={() => navigate("/")}>
            MARKSPRINT
          </div>
          
          <div className="toggle w-10 flex justify-end text-xl cursor-pointer text-white" onClick={toggleTheme}>
            {dark ? "🌙" : "☀️"}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="w-full h-full flex flex-col relative z-10 pt-4 px-4">
          <Outlet />
        </div>
      </div>
    </ClickSpark>
  );
}
