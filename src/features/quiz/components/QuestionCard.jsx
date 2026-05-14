import React from 'react';
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({ 
  currentQ, 
  currentIdx, 
  handleAnswer, 
  isLocked, 
  userAnswer, 
  isTestMode 
}) {
  if (!currentQ) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentIdx}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-5xl mx-auto flex flex-col justify-center items-center flex-1 pb-20 relative"
      >
        <div className="w-full bg-[rgba(15,20,30,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-10 md:p-16 mb-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <h2 className="text-xl md:text-3xl leading-loose text-white font-semibold drop-shadow-md" dangerouslySetInnerHTML={{ __html: currentQ.question || "" }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="max-w-full max-h-72 object-contain mx-auto mt-8 rounded-xl border border-[rgba(255,255,255,0.1)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]" />}
        </div>
        
        {isLocked && (
          <div className="absolute top-0 right-0 p-4 opacity-50 flex items-center gap-2 text-cyan-400">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
            <span className="text-xs uppercase tracking-widest font-bold">Processing</span>
          </div>
        )}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {currentQ.displayOptions.map((opt, i) => {
            let statusClasses = "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] text-gray-200 hover:bg-[rgba(255,255,255,0.08)] hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(0,210,255,0.2)] hover:text-white rounded-2xl h-auto aspect-auto";
            let showCorrectIcon = false;
            let showWrongIcon = false;

            if (isLocked) {
              if (isTestMode) {
                if (opt.text === userAnswer) {
                  statusClasses = "bg-cyan-500/20 border-cyan-400 text-white neon-box-blue rounded-2xl h-auto aspect-auto";
                } else {
                  statusClasses = "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.05)] text-gray-500 rounded-2xl h-auto aspect-auto";
                }
              } else {
                if (opt.text === currentQ.answer) {
                  statusClasses = "bg-green-600/40 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.8)] ring-2 ring-green-500/50 rounded-2xl h-auto aspect-auto";
                  showCorrectIcon = true;
                } else if (opt.text === userAnswer) {
                  statusClasses = "bg-red-600/40 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] ring-2 ring-red-500/50 rounded-2xl h-auto aspect-auto";
                  showWrongIcon = true;
                } else {
                  statusClasses = "bg-[rgba(0,0,0,0.4)] border-[rgba(255,255,255,0.05)] text-gray-500 rounded-2xl h-auto aspect-auto";
                }
              }
            }
            
            return (
              <button 
                key={`${currentIdx}-${i}`}
                className={`flex items-center w-full min-h-[5rem] px-8 py-6 rounded-2xl border backdrop-blur-md transition-all duration-300 h-auto aspect-auto ${!isLocked ? 'hover:-translate-y-1 cursor-pointer' : 'cursor-default'} ${statusClasses}`}
                onClick={() => handleAnswer(opt.text)}
                disabled={isLocked}
              >
                {opt.text && <span className="text-left w-full block text-base md:text-lg leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: opt.text }} />}
                {opt.img && <img src={opt.img} alt={`Option ${i+1}`} className="max-w-full max-h-32 object-contain rounded my-2" />}
                
                {showCorrectIcon && <CheckCircle2 className="shrink-0 ml-4 text-green-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" size={24} />}
                {showWrongIcon && <XCircle className="shrink-0 ml-4 text-red-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" size={24} />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
