import React from 'react';

export default function QuizSetup({ engine, subject }) {
  const {
    quizType, setQuizType,
    selectedLessons, setSelectedLessons, availableLessons,
    selectedVolume, setSelectedVolume, availableVolumes,
    repeatWrong, setRepeatWrong,
    shuffleQ, setShuffleQ,
    shuffleOpt, setShuffleOpt,
    timerLimit, setTimerLimit,
    globalTimerLimit, setGlobalTimerLimit,
    questionCount, setQuestionCount,
    isTestMode, setIsTestMode,
    startQuiz
  } = engine;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-6 md:pt-14 px-6 pb-20 font-sans relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="flex flex-col mb-12 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(0,210,255,0.3)]">
          {subject?.toUpperCase()}
        </h2>
        <p className="text-base text-gray-300 mt-5 font-medium">Configure your assessment parameters before starting the sprint.</p>
      </div>
      
      <div className="w-full bg-[rgba(15,20,30,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-3xl p-8 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col gap-10 relative overflow-hidden">
        
        {/* Subtle internal top glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <section>
          <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Assessment Scope</h4>
          <div className="grid grid-cols-3 gap-4 p-3 bg-[rgba(0,0,0,0.4)] rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-inner mt-2">
            {["lesson", "volume", "full"].map(t => (
              <button 
                key={t} 
                className={`py-3.5 rounded-xl font-bold text-sm md:text-base tracking-widest transition-all duration-300 ${quizType === t ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(0,210,255,0.4)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`}
                onClick={() => setQuizType(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        {quizType === "lesson" && (
          <section className="animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Select Lessons</h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-[rgba(0,0,0,0.3)] rounded-xl border border-[rgba(255,255,255,0.05)] custom-scrollbar">
              {availableLessons.map(lesson => (
                <button 
                  key={lesson}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedLessons.includes(lesson) ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                >
                  Lesson {lesson}
                </button>
              ))}
            </div>
          </section>
        )}

        {quizType === "volume" && (
          <section className="animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Select Volume</h4>
            <div className="flex flex-wrap gap-3">
              {availableVolumes.map(vol => (
                <button 
                  key={vol}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedVolume === vol ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setSelectedVolume(vol)}
                >
                  Volume {vol}
                </button>
              ))}
              <button 
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 border ${selectedVolume === "all" ? 'bg-purple-500/20 text-purple-300 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                onClick={() => setSelectedVolume("all")}
              >
                All Volumes
              </button>
            </div>
          </section>
        )}

        <section className="flex flex-col w-full bg-[rgba(0,0,0,0.3)] rounded-2xl border border-[rgba(255,255,255,0.05)] overflow-hidden shadow-inner mt-4">
          <div className="flex justify-between items-center px-6 py-6 md:py-8 bg-transparent hover:bg-[rgba(255,255,255,0.03)] transition-colors">
            <span className="text-base text-gray-200 font-semibold tracking-wide">Practice Mode <span className="text-sm text-gray-400 ml-3 font-normal hidden md:inline">Instant feedback on answers</span></span>
            <button role="switch" aria-checked={!isTestMode} onClick={() => setIsTestMode(prev => !prev)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${!isTestMode ? 'bg-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.6)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${!isTestMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
          
          {!isTestMode && (
            <>
              <div className="flex justify-between items-center px-6 py-6 md:py-8 bg-transparent hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                <span className="text-base text-gray-200 font-semibold tracking-wide">Repeat Wrong Answers <span className="text-sm text-gray-400 ml-3 font-normal hidden md:inline">Require correct answers before finishing</span></span>
                <button role="switch" aria-checked={repeatWrong} onClick={() => setRepeatWrong(prev => !prev)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${repeatWrong ? 'bg-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.6)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${repeatWrong ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
            </>
          )}
          
          <div className="flex justify-between items-center px-6 py-6 md:py-8 bg-transparent hover:bg-[rgba(255,255,255,0.03)] transition-colors">
            <span className="text-base text-gray-200 font-semibold tracking-wide">Shuffle Questions</span>
            <button role="switch" aria-checked={shuffleQ} onClick={() => setShuffleQ(prev => !prev)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${shuffleQ ? 'bg-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.6)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${shuffleQ ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent"></div>
          
          <div className="flex justify-between items-center px-6 py-6 md:py-8 bg-transparent hover:bg-[rgba(255,255,255,0.03)] transition-colors">
            <span className="text-base text-gray-200 font-semibold tracking-wide">Shuffle Options</span>
            <button role="switch" aria-checked={shuffleOpt} onClick={() => setShuffleOpt(prev => !prev)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${shuffleOpt ? 'bg-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.6)]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${shuffleOpt ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <section>
            <h4 className="text-[11px] font-bold text-gray-400 tracking-widest mb-4 uppercase">Question Timer</h4>
            <div className="grid grid-cols-4 gap-3">
              {[0, 5, 10, 15].map(t => (
                <button 
                  key={t} 
                  className={`py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 border ${timerLimit === t ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}s`}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[11px] font-bold text-gray-400 tracking-widest mb-4 uppercase">Global Timer</h4>
            <div className="grid grid-cols-4 gap-3">
              {[0, 5, 10, 30].map(t => (
                <button 
                  key={t} 
                  className={`py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 border ${globalTimerLimit === t ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setGlobalTimerLimit(t)}
                >
                  {t === 0 ? "OFF" : `${t}m`}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[11px] font-bold text-gray-400 tracking-widest mb-4 uppercase">Questions</h4>
            <div className="grid grid-cols-3 gap-3">
              {[0, 15, 20].map(n => (
                <button 
                  key={n} 
                  className={`py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 border ${questionCount === n ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]' : 'bg-[rgba(255,255,255,0.02)] text-gray-400 border-[rgba(255,255,255,0.05)] hover:border-gray-500 hover:text-white'}`}
                  onClick={() => setQuestionCount(n)}
                >
                  {n === 0 ? "ALL" : n}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="pt-8">
          <button 
            className="relative group w-full py-5 text-white text-xl font-black tracking-widest uppercase rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,210,255,0.3)] hover:shadow-[0_10px_50px_rgba(0,210,255,0.6)] transition-all duration-300 border border-[rgba(255,255,255,0.2)]" 
            onClick={startQuiz}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 group-hover:scale-[1.03] transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <span className="relative z-10 drop-shadow-md">Start Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
