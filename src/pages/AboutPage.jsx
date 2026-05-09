import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code } from 'lucide-react';
import Galaxy from '../components/Galaxy';
import ClickSpark from '../components/ClickSpark';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <ClickSpark isDark={true}>
      {/* Ensure scrollbar is visible and styled */}
      <div className="min-h-screen w-full relative flex flex-col items-center bg-[#0b1f2a] text-[#9fe3ff] p-4 text-center py-12 overflow-y-auto scrollbar-visible">
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-visible::-webkit-scrollbar {
            width: 10px;
            display: block !important;
          }
          .scrollbar-visible::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
          }
          .scrollbar-visible::-webkit-scrollbar-thumb {
            background: #2aa8d8;
            border-radius: 5px;
          }
          .scrollbar-visible::-webkit-scrollbar-thumb:hover {
            background: #00d2ff;
          }
          /* For Firefox */
          .scrollbar-visible {
            scrollbar-width: auto;
            scrollbar-color: #2aa8d8 rgba(0, 0, 0, 0.2);
          }
        `}} />
        
        <Galaxy isDark={true} />
        
        <div className="z-10 max-w-4xl w-full space-y-12 md:space-y-16 my-8">
          {/* About Title Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <h1 className="text-4xl md:text-5xl font-bold text-[#7fdfff] tracking-wide">ABOUT MARKSPRINT</h1>
          </div>

          <br></br>

          {/* Main Description Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <p className="text-lg md:text-xl text-[#9fe3ff] leading-relaxed">
              <strong>MARKSPRINT</strong> is an open-source, interactive quiz engine designed to help 12th-grade Tamil Nadu State Board students master one-mark questions.
            </p>
          </div>

          <br></br>

          {/* How It Works Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00d2ff] mb-8 text-left">⚙️ How It Works</h2>
            <ul className="list-disc list-inside space-y-4 text-gray-300 text-left">
              <li><strong>Select a Subject:</strong> Choose from Physics, Chemistry, Maths, Computer Science, Biology, English, or Tamil.</li>
              <li><strong>Customize Your Sprint:</strong> Pick specific chapters, set global or per-question timers, and shuffle options.</li>
              <li><strong>Practice Mode vs Test Mode:</strong> Use Practice Mode for instant correct/wrong feedback, or Test Mode to simulate real exam pressure.</li>
              <li><strong>Review & Learn:</strong> After the sprint, get a detailed breakdown of your accuracy and review exactly what you got wrong with the correct answers provided.</li>
            </ul>
          </div>

          <br></br>

          {/* Creator Credits Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00d2ff] mb-8">Special Credits</h2>
            <p className="text-gray-300 mb-8">
              This project was made possible with the invaluable contributions of:
            </p>
            <div className="space-y-8 mb-8">
              <div>
                <p className="text-lg font-bold text-[#7fdfff]">S. SARAVANAN</p>
                <a 
                  href="https://saravanan-portfolio.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#2aa8d8] hover:text-[#00d2ff] transition-colors duration-300 flex items-center justify-center gap-2 mt-3"
                >
                  View Portfolio <ExternalLink size={16} />
                </a>
              </div>
              <div>
                <p className="text-lg font-bold text-[#7fdfff]">K.P. SURYA</p>
                <a 
                  href="https://surya-portfolio.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#2aa8d8] hover:text-[#00d2ff] transition-colors duration-300 flex items-center justify-center gap-2 mt-3"
                >
                  View Portfolio <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          <br></br>

          {/* Tech Stack Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00d2ff] mb-8">💻 Tech Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
              <div className="text-left">
                <h3 className="font-bold text-[#7fdfff] mb-3">Frontend Core</h3>
                <p>React 19 & Vite Bundler</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#7fdfff] mb-3">Styling & UI</h3>
                <p>Tailwind CSS v4 & Framer Motion</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#7fdfff] mb-3">Data & Parsing</h3>
                <p>PapaParse (Client-side CSV loading)</p>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#7fdfff] mb-3">Special Rendering</h3>
                <p>MathJax (For advanced formulas)</p>
              </div>
            </div>
          </div>

          <br></br>

          {/* Action Buttons Card */}
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-none p-8 shadow-[0_0_20px_rgba(0,210,255,0.1)] mb-12">
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/')} 
                className="px-8 py-3 border border-[#2aa8d8] text-[#2aa8d8] font-bold rounded-none transition-all duration-300 hover:bg-[#2aa8d8] hover:text-white hover:shadow-[0_0_15px_rgba(42,168,216,0.5)] w-full md:w-auto"
              >
                Back to Home
              </button>
              <a 
                href="https://github.com/sreehari462/marksprint" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#2aa8d8] text-white font-bold rounded-none transition-all duration-300 hover:bg-[#1a88b8] hover:shadow-[0_0_15px_rgba(42,168,216,0.5)] w-full md:w-auto"
              >
                <Code size={20} /> View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </ClickSpark>
  );
}
