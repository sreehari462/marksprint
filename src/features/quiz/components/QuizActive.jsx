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

  return (
    <div className="w-full flex flex-col h-full">
      <div className="quiz-header">
        <div className="header-item">
          <span className="header-label">Question</span>
          <span className="header-value">{currentIdx + 1} / {firstAttemptQuestions.length}</span>
        </div>
        
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
            label="Time" 
            warningThreshold={5} 
          />
        )}
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
