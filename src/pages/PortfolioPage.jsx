import React from 'react';
import { useNavigate } from 'react-router-dom';
import Galaxy from '../components/Galaxy';
import ClickSpark from '../components/ClickSpark';

export default function PortfolioPage() {
  const navigate = useNavigate();

  return (
    <ClickSpark isDark={true}>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 text-center">
        <Galaxy isDark={true} />
        <div className="z-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 max-w-2xl shadow-[0_0_20px_rgba(0,210,255,0.1)]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#7fdfff] tracking-wide">S.K. SREEHARI</h1>
          <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-200">
            Welcome to my portfolio. I am a developer passionate about creating interactive and educational web experiences like MARKSPRINT.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 border border-[#2aa8d8] text-[#2aa8d8] font-bold rounded-lg transition-all duration-300 hover:bg-[#2aa8d8] hover:text-white hover:shadow-[0_0_15px_rgba(42,168,216,0.5)]"
          >
            Back to MarkSprint
          </button>
        </div>
      </div>
    </ClickSpark>
  );
}
