import React, { useEffect } from 'react';
import { Repeat, Home, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

export default function ResultsBoard({ engine }) {
  const navigate = useNavigate();
  const { firstAttemptQuestions, firstAttemptAnswers, firstAttemptCorrect, isTestMode, repeatWrong } = engine;

  const total = firstAttemptQuestions.length;
  // If repeatWrong was on and it's not test mode, they repeated until all correct.
  // Actually, to be strictly accurate, we should score based on firstAttemptCorrect.
  const correct = firstAttemptCorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [accuracy]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center pb-32 pt-12 md:pt-16 px-6 font-sans relative">
      
      {/* Massive Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tighter mb-10 text-center drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]">
          Assessment Results
        </h1>
        
        <div className="w-full max-w-xl bg-[rgba(15,20,30,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-12 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="flex flex-col gap-6 mb-12">
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.4)] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-inner">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Total Questions</span>
              <span className="text-2xl md:text-3xl font-black text-white tabular-nums drop-shadow-md">{total}</span>
            </div>
            
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.4)] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-inner">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Correct Answers</span>
              <span className="text-2xl md:text-3xl font-black text-green-400 tabular-nums drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">{correct}</span>
            </div>
            
            <div className="flex justify-between items-center bg-[rgba(0,0,0,0.4)] p-6 rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-inner">
              <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Accuracy</span>
              <span className="text-3xl md:text-4xl font-black text-cyan-400 tabular-nums neon-text-blue">{accuracy}%</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-5 w-full mt-auto">
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-white text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              onClick={() => window.location.reload()}
            >
              <Repeat size={20} /> Retry Sprint
            </button>
            <button 
              className="relative group flex-1 flex items-center justify-center gap-2 py-4 text-white text-sm font-bold tracking-widest uppercase rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_10px_40px_rgba(0,210,255,0.5)] transition-all duration-300 border border-[rgba(255,255,255,0.2)]"
              onClick={() => navigate("/")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <Home size={20} className="relative z-10" /> <span className="relative z-10 drop-shadow-md">Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-32 w-full max-w-4xl font-sans">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-center tracking-tight drop-shadow-md uppercase">Review Answers</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
        </div>
        
        <div className="flex flex-col gap-12">
          {firstAttemptAnswers.map((item, idx) => (
            <div key={idx} className={`bg-[rgba(15,20,30,0.6)] border-l-4 ${item.isCorrect ? 'border-l-green-500' : 'border-l-red-500'} border-y border-r border-[rgba(255,255,255,0.1)] rounded-r-2xl rounded-l-md p-10 md:p-14 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
              
              <div className="flex items-start gap-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] text-gray-300 font-bold text-sm shrink-0">{idx + 1}</span>
                <h3 className="text-lg md:text-xl text-white font-medium leading-loose drop-shadow-sm flex-1 pt-0.5" dangerouslySetInnerHTML={{ __html: item.questionObj.question }} />
              </div>

              {item.questionObj.question_image && <img src={item.questionObj.question_image} alt="Question" className="max-w-full md:max-w-[400px] ml-12 mb-8 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-[0_5px_15px_rgba(0,0,0,0.4)]" />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ml-12">
                <div className={`p-5 rounded-xl flex items-center gap-4 ${item.isCorrect ? 'bg-green-500/10 border border-green-500/20 text-green-100' : 'bg-red-500/10 border border-red-500/20 text-red-100'}`}>
                  {item.isCorrect ? <CheckCircle2 size={24} className="text-green-400 shrink-0" /> : <XCircle size={24} className="text-red-400 shrink-0" />}
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold text-gray-400">Your Answer</span>
                    <span className="text-base font-semibold text-white/90" dangerouslySetInnerHTML={{ __html: item.userAnswer || "Skipped / Timeout" }} />
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="p-5 rounded-xl flex items-center gap-4 bg-green-500/10 border border-green-500/20 text-green-100">
                    <CheckCircle2 size={24} className="text-green-400 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold text-gray-400">Correct Answer</span>
                      <span className="text-base font-semibold text-white/90" dangerouslySetInnerHTML={{ __html: item.questionObj.answer }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
