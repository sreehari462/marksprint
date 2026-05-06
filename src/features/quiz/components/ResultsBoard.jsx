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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center pb-20">
      <div className="result-wrapper w-full">
        <h1 className="result-title text-center">THE RESULT</h1>
        <div className="result-card mx-auto">
          <div className="result-stats">
            <div className="stat-row"><span className="stat-label">Total</span><span className="stat-value">{total}</span></div>
            <div className="stat-row"><span className="stat-label">Correct</span><span className="stat-value correct-text">{correct}</span></div>
            <div className="stat-row"><span className="stat-label">Accuracy</span><span className="stat-value accuracy-text">{accuracy}%</span></div>
          </div>
          <div className="result-actions">
            <button className="retry-btn" onClick={() => window.location.reload()}><Repeat size={20} /> RETRY</button>
            <button className="home-btn" onClick={() => navigate("/")}><Home size={20} /> HOME</button>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#00d2ff]">Review Answers</h2>
        <div className="flex flex-col gap-4">
          {firstAttemptAnswers.map((item, idx) => (
            <div key={idx} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-lg text-white mb-4" dangerouslySetInnerHTML={{ __html: item.questionObj.question }} />
              {item.questionObj.question_image && <img src={item.questionObj.question_image} alt="Question" className="max-w-[200px] mb-4 rounded-lg" />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg flex items-center gap-3 ${item.isCorrect ? 'bg-[rgba(76,175,80,0.2)] border border-[#4caf50] text-[#4caf50]' : 'bg-[rgba(244,67,54,0.2)] border border-[#f44336] text-[#f44336]'}`}>
                  {item.isCorrect ? <CheckCircle2 /> : <XCircle />}
                  <div>
                    <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">Your Answer</span>
                    <span dangerouslySetInnerHTML={{ __html: item.userAnswer || "Skipped / Timeout" }} />
                  </div>
                </div>
                
                {!item.isCorrect && (
                  <div className="p-4 rounded-lg flex items-center gap-3 bg-[rgba(76,175,80,0.2)] border border-[#4caf50] text-[#4caf50]">
                    <CheckCircle2 />
                    <div>
                      <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">Correct Answer</span>
                      <span dangerouslySetInnerHTML={{ __html: item.questionObj.answer }} />
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
