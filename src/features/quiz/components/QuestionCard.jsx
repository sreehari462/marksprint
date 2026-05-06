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
        className="question-container w-full max-w-4xl mx-auto flex flex-col justify-center items-center min-h-[60vh]"
      >
        <div className="w-full bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 mb-8 shadow-2xl">
          <h2 className="question-text text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: currentQ.question || "" }} />
          {currentQ.question_image && <img src={currentQ.question_image} alt="Question" className="q-image mx-auto mt-4" />}
        </div>
        
        <div className="options-grid w-full gap-4">
          {currentQ.displayOptions.map((opt, i) => {
            let status = "";
            if (isLocked) {
              if (isTestMode) {
                if (opt.text === userAnswer) status = "selected";
              } else {
                if (opt.text === currentQ.answer) status = "correct";
                else if (opt.text === userAnswer) status = "wrong";
              }
            }
            
            return (
              <button 
                key={`${currentIdx}-${i}`}
                className={`option-btn ${status} ${status === 'selected' ? 'border-[#00d2ff] bg-[rgba(0,210,255,0.1)] shadow-[0_0_15px_rgba(0,210,255,0.2)]' : ''} hover:scale-[1.02] transition-transform duration-200 active:scale-95`}
                onClick={() => handleAnswer(opt.text)}
                disabled={isLocked}
              >
                {opt.text && <span className="text-left w-full block" dangerouslySetInnerHTML={{ __html: opt.text }} />}
                {opt.img && <img src={opt.img} alt={`Option ${i+1}`} className="opt-image" />}
                {!isTestMode && status === "correct" && <CheckCircle2 className="icon shrink-0 ml-auto" />}
                {!isTestMode && status === "wrong" && <XCircle className="icon shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
