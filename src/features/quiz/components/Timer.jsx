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
    <div className={`flex flex-col items-center justify-center p-3 md:px-6 md:py-3 rounded-xl border backdrop-blur-xl transition-all duration-300 font-sans relative overflow-hidden w-full md:w-auto ${timeLeft <= warningThreshold ? 'bg-red-500/20 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)]' : 'bg-[rgba(15,20,30,0.6)] border-cyan-400/70 shadow-[0_0_25px_rgba(0,210,255,0.6)]'}`}>
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${timeLeft <= warningThreshold ? 'via-red-500' : 'via-cyan-400'} to-transparent`}></div>
      <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase mb-0.5">{label}</span>
      <span className={`text-lg md:text-xl font-black tabular-nums tracking-wider ${timeLeft <= warningThreshold ? 'text-red-300 neon-text-red animate-pulse' : 'text-cyan-300 drop-shadow-[0_0_15px_rgba(0,210,255,0.8)]'}`}>
        {displayTime}
      </span>
    </div>
  );
}
