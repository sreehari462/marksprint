import React, { useEffect } from 'react';

export default function Timer({ timeLeft, setTimeLeft, isActive, onTimeout, label, warningThreshold = 5 }) {
  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft <= 0 && isActive) {
      onTimeout();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, setTimeLeft, onTimeout]);

  if (timeLeft === undefined || timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayTime = minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;

  return (
    <div className={`flex flex-col items-center justify-center p-2 md:px-4 md:py-2 rounded-xl border backdrop-blur-xl transition-all duration-300 font-sans relative overflow-hidden ${timeLeft <= warningThreshold ? 'bg-[rgba(220,38,38,0.1)] border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-[rgba(15,20,30,0.6)] border-[rgba(255,255,255,0.1)] shadow-[0_0_20px_rgba(0,0,0,0.5)]'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${timeLeft <= warningThreshold ? 'via-red-500' : 'via-cyan-500/50'} to-transparent`}></div>
      <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-0.5">{label}</span>
      <span className={`text-lg md:text-xl font-black tabular-nums tracking-wider ${timeLeft <= warningThreshold ? 'text-red-400 neon-text-red animate-pulse' : 'text-cyan-300 drop-shadow-[0_0_10px_rgba(0,210,255,0.5)]'}`}>
        {displayTime}
      </span>
    </div>
  );
}
