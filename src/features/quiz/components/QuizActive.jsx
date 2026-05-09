import React, { useEffect } from 'react';
import Timer from './Timer';
import QuestionCard from './QuestionCard';

export default function QuizActive({ engine }) {
  const {
    quizQuestions, currentIdx, firstAttemptQuestions, 
    timerLimit, timeLeft, setTimeLeft,
    globalTimerLimit, globalTimeLeft, setGlobalTimeLeft,
    handleAnswer, isLocked, userAnswer, isTestMode, finishQuiz
  } = engine;

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
  }, [currentIdx, isLocked]);

  const currentQ = quizQuestions[currentIdx];

  const handleTimeout = () => {
    if (!isLocked) {
      handleAnswer(null); // submit null answer on timeout
    }
  };

  const handleGlobalTimeout = () => {
    finishQuiz();
  };

  const progressPercentage = ((currentIdx) / firstAttemptQuestions.length) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full pt-8 md:pt-12 px-4 md:px-6 font-sans relative">
      
      {/* Background glow for the active quiz */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="flex flex-col gap-6 mb-10">
        
        {/* Back to Setup Button */}
        <div className="flex justify-end">
          <button 
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-gray-300 hover:text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            onClick={() => {
              if (window.confirm('Are you sure you want to go back to filters? Your progress will be lost.')) {
                window.location.reload();
              }
            }}
          >
            ← Back to Filters
          </button>
        </div>
        
        {/* Timers Row */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
          {globalTimerLimit > 0 && (
            <Timer 
              timeLeft={globalTimeLeft} 
              setTimeLeft={setGlobalTimeLeft} 
              isActive={true} 
              onTimeout={handleGlobalTimeout} 
              label="Total Time" 
              warningThreshold={60} 
            />
          )}

          {timerLimit > 0 && (
            <Timer 
              timeLeft={timeLeft} 
              setTimeLeft={setTimeLeft} 
              isActive={!isLocked} 
              onTimeout={handleTimeout} 
              label="Question Time" 
              warningThreshold={5} 
            />
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col w-full bg-[rgba(15,20,30,0.6)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-5 md:p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex justify-between items-end mb-4">
            <span className="text-[11px] md:text-sm font-bold text-gray-400 tracking-widest uppercase">Progress</span>
            <span className="text-2xl md:text-3xl font-black text-white tabular-nums tracking-wider drop-shadow-md">{currentIdx + 1} <span className="text-gray-500 text-sm md:text-base font-semibold">/ {firstAttemptQuestions.length}</span></span>
          </div>
          <div className="w-full h-4 md:h-5 bg-[rgba(0,0,0,0.6)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 ease-out relative shadow-[0_0_20px_rgba(0,210,255,0.8)]"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/50 blur-[3px]"></div>
            </div>
          </div>
        </div>
      </div>

      <QuestionCard 
        currentQ={currentQ}
        currentIdx={currentIdx}
        handleAnswer={handleAnswer}
        isLocked={isLocked}
        userAnswer={userAnswer}
        isTestMode={isTestMode}
      />
    </div>
  );
}
