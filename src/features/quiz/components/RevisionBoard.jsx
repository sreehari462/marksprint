import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function RevisionBoard({ engine }) {
  const { quizQuestions, setQuizMode } = engine;

  // Trigger MathJax rendering after content updates
  useEffect(() => {
    const renderMath = async () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise();
        } catch (err) {
          console.log("MathJax error:", err);
        }
      }
    };
    const timer1 = setTimeout(renderMath, 100);
    const timer2 = setTimeout(renderMath, 500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [quizQuestions]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col pb-32 pt-12 md:pt-16 px-6 font-sans relative">
      
      {/* Massive Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tighter mb-10 text-center drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]">
          Revision - All Questions
        </h1>
        
        <div className="w-full max-w-xl bg-[rgba(15,20,30,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-10">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-400 tracking-widest uppercase mb-2">Total Questions</p>
              <p className="text-4xl font-black text-cyan-400 drop-shadow-md">{quizQuestions.length}</p>
            </div>
          </div>
          
          <button 
            className="w-full flex items-center justify-center gap-2 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={20} /> Back to Filters
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl font-sans">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center tracking-tight drop-shadow-md uppercase">Questions & Answers</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
        </div>
        
        <div className="flex flex-col gap-12">
          {quizQuestions.map((item, idx) => (
            <div key={idx} className="bg-[rgba(15,20,30,0.6)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-10 md:p-14 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
              
              <div className="flex items-start gap-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] text-gray-300 font-bold text-sm shrink-0">{idx + 1}</span>
                <h3 className="text-lg md:text-xl text-white font-medium leading-loose drop-shadow-sm flex-1 pt-0.5" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.question) }} />
              </div>

              {item.question_image && <img src={item.question_image} alt="Question" className="max-w-full md:max-w-[400px] ml-12 mb-8 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-[0_5px_15px_rgba(0,0,0,0.4)]" />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ml-12 mb-8">
                {item.displayOptions && item.displayOptions.map((option, optIdx) => (
                  <div 
                    key={optIdx} 
                    className={`p-5 rounded-xl flex items-start gap-4 border ${option.text === item.answer ? 'bg-green-500/10 border-green-500/20 text-green-100' : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-gray-300'}`}
                  >
                    {option.text === item.answer && <CheckCircle2 size={24} className="text-green-400 shrink-0 mt-0.5" />}
                    <div className="flex-1">
                      {option.img && <img src={option.img} alt="Option" className="max-w-[150px] mb-2 rounded border border-[rgba(255,255,255,0.1)]" />}
                      <span className="text-base font-semibold text-white/90 block" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.text) }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="ml-12 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="block text-[10px] uppercase tracking-widest opacity-80 mb-2 font-bold text-gray-400">Correct Answer</span>
                <span className="text-base font-semibold text-cyan-300" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.answer) }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button 
            className="w-full max-w-md flex items-center justify-center gap-2 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_10px_50px_rgba(0,210,255,0.5)]"
            onClick={() => setQuizMode("setup")}
          >
            <ArrowLeft size={20} /> Back to Filters
          </button>
        </div>
      </div>
    </div>
  );
}
