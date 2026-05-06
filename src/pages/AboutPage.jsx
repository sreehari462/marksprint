import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code } from 'lucide-react';
import Galaxy from '../components/Galaxy';
import ClickSpark from '../components/ClickSpark';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <ClickSpark isDark={true}>
      <div className="min-h-screen w-full relative flex flex-col items-center justify-center bg-[#0b1f2a] text-[#9fe3ff] p-4 text-center">
        <Galaxy isDark={true} />
        <div className="z-10 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 max-w-3xl shadow-[0_0_20px_rgba(0,210,255,0.1)]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#7fdfff] tracking-wide">ABOUT MARKSPRINT</h1>
          
          <div className="text-left text-lg md:text-xl leading-relaxed mb-8 text-gray-200 space-y-4">
            <p>
              <strong>MARKSPRINT</strong> is an open-source, interactive quiz engine designed to help 12th-grade students master one-mark questions. 
            </p>
            <p>
              Built with a focus on speed, accuracy, and a premium user experience, the application features a robust testing suite, practice modes, global timers, and instant feedback loops.
            </p>
            <p>
              This project is built using React, Vite, and Tailwind CSS. It features a scalable, feature-sliced architecture and is optimized for seamless deployment on Vercel.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-3 border border-[#2aa8d8] text-[#2aa8d8] font-bold rounded-lg transition-all duration-300 hover:bg-[#2aa8d8] hover:text-white hover:shadow-[0_0_15px_rgba(42,168,216,0.5)]"
            >
              Back to Home
            </button>
            <a 
              href="https://github.com/sreehari462/marksprint" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#2aa8d8] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#1a88b8] hover:shadow-[0_0_15px_rgba(42,168,216,0.5)]"
            >
              <Code size={20} /> View Source
            </a>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
