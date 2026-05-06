import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, MousePointerClick } from "lucide-react";
import MagicRings from "../components/MagicRings";

const subjects = ["Physics", "Chemistry", "Maths", "Computer", "Biology", "English", "Tamil"];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showRing, setShowRing] = useState(false);
  const navigate = useNavigate();

  // Subject rotation every 5 seconds
  useEffect(() => {
    if (selected) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selected, index]);

  const next = () => setIndex((prev) => (prev + 1) % subjects.length);
  const prev = () => setIndex((prev) => (prev - 1 + subjects.length) % subjects.length);

  const handleSelect = () => {
    setSelected(subjects[index]);
    setShowRing(true);
    setTimeout(() => setShowRing(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center flex-1 h-full pt-6 md:pt-12 pb-10 font-sans relative overflow-hidden">
      
      {/* Massive soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[rgba(0,210,255,0.15)] to-[rgba(168,85,247,0.15)] rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_20px_rgba(0,210,255,0.4)]"
      >
        MarkSprint
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-xl text-gray-300 font-medium text-sm md:text-base px-4 mb-8 md:mb-12 leading-relaxed"
      >
        A focused assessment platform designed for 12th-grade students to master core concepts through rapid iteration.
      </motion.p>

      {/* The Masterpiece Wheel */}
      <div className="flex flex-col items-center justify-center my-2 w-full relative z-10">
        <div className="flex items-center justify-center gap-6 md:gap-16 w-full max-w-3xl px-4 mb-8 md:mb-12">
          <button 
            className="p-3 md:p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all duration-300 text-gray-400 hover:text-white" 
            onClick={prev}
          >
            <ChevronLeft size={24} strokeWidth={2} />
          </button>
          
          <div className="relative w-48 h-48 md:w-56 md:h-56 flex flex-col items-center justify-center rounded-full group">
            {/* Animated Gradient Border */}
            <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"></div>
            
            {/* Glass Interior */}
            <div className="absolute inset-0 rounded-full bg-[rgba(10,15,30,0.8)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] shadow-[0_0_80px_rgba(0,210,255,0.3)] flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="text-2xl md:text-4xl font-black text-white tracking-tight text-center px-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                  {subjects[index]}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {showRing && (
              <div className="absolute inset-0 z-20 pointer-events-none scale-[1.3] md:scale-[1.4] opacity-80">
                <MagicRings />
              </div>
            )}
          </div>
          
          <button 
            className="p-3 md:p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.08)] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all duration-300 text-gray-400 hover:text-white" 
            onClick={next}
          >
            <ChevronRight size={24} strokeWidth={2} />
          </button>
        </div>

        <button 
          className="relative group px-8 py-3 bg-[rgba(255,255,255,0.05)] text-white text-sm md:text-base font-bold tracking-widest uppercase rounded-xl border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]" 
          onClick={handleSelect}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
          {selected ? <Check size={20} className="relative z-10 text-cyan-400" /> : <MousePointerClick size={20} className="relative z-10 text-cyan-400" />}
          <span className="relative z-10">Select Subject</span>
        </button>
      </div>

      <div className="h-12 flex flex-col items-center justify-center mt-6 md:mt-8">
        {selected ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-2 rounded-full bg-[rgba(0,210,255,0.1)] border border-cyan-500/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]"
          >
            <p className="text-sm font-semibold text-cyan-100 flex items-center gap-2 tracking-wide">
              Subject Locked: <span className="text-white font-bold text-base neon-text-blue">{selected}</span>
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-500 tracking-widest uppercase text-xs font-bold bg-[rgba(0,0,0,0.3)] px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.05)]">Awaiting Selection</p>
        )}
      </div>

      <motion.button 
        whileHover={selected ? { scale: 1.02 } : {}}
        whileTap={selected ? { scale: 0.98 } : {}}
        className={`mt-10 md:mt-12 px-10 md:px-14 py-3 md:py-4 text-base md:text-lg font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${selected ? 'text-white border-0 shadow-[0_0_20px_rgba(0,210,255,0.4)] cursor-pointer group' : 'bg-[rgba(255,255,255,0.02)] text-gray-600 border border-[rgba(255,255,255,0.05)] cursor-not-allowed'}`}
        onClick={() => {
          if (!selected) return;
          navigate(`/quiz/${selected === "Computer" ? "cs" : selected.toLowerCase()}`);
        }}
      >
        {selected && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </>
        )}
        <span className="relative z-10 drop-shadow-md">Proceed to Setup</span>
      </motion.button>
    </div>
  );
}
