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
    <div className="setup-container">
      <h2 className="subject-title">{subject?.toUpperCase()}</h2>
      <div className="config-card">
        <section>
          <h4>QUIZ TYPE</h4>
          <div className="button-group">
            {["lesson", "volume", "full"].map(t => (
              <button key={t} className={quizType === t ? "active" : ""} onClick={() => setQuizType(t)}>{t.toUpperCase()}</button>
            ))}
          </div>
        </section>

        {quizType === "lesson" && (
          <section>
            <h4>SELECT LESSONS</h4>
            <div className="button-group scrollable-group">
              {availableLessons.map(lesson => (
                <button 
                  key={lesson}
                  className={selectedLessons.includes(lesson) ? "active" : ""}
                  onClick={() => setSelectedLessons(prev => prev.includes(lesson) ? prev.filter(l => l !== lesson) : [...prev, lesson])}
                >
                  Lesson {lesson}
                </button>
              ))}
            </div>
          </section>
        )}

        {quizType === "volume" && (
          <section>
            <h4>SELECT VOLUME</h4>
            <div className="button-group">
              {availableVolumes.map(vol => (
                <button 
                  key={vol}
                  className={selectedVolume === vol ? "active" : ""}
                  onClick={() => setSelectedVolume(vol)}
                >
                  Volume {vol}
                </button>
              ))}
              <button 
                className={selectedVolume === "all" ? "active" : ""}
                onClick={() => setSelectedVolume("all")}
              >
                All Volumes
              </button>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3 w-full my-4">
          <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
            <span className="text-sm md:text-base text-gray-200 font-medium">Practice Mode (Instant Feedback)</span>
            <button role="switch" aria-checked={!isTestMode} onClick={() => setIsTestMode(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${!isTestMode ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!isTestMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {!isTestMode && (
            <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
              <span className="text-sm md:text-base text-gray-200 font-medium">Repeat Wrong Answers</span>
              <button role="switch" aria-checked={repeatWrong} onClick={() => setRepeatWrong(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${repeatWrong ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${repeatWrong ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}
          <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
            <span className="text-sm md:text-base text-gray-200 font-medium">Shuffle Questions</span>
            <button role="switch" aria-checked={shuffleQ} onClick={() => setShuffleQ(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shuffleQ ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleQ ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex justify-between items-center bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
            <span className="text-sm md:text-base text-gray-200 font-medium">Shuffle Options</span>
            <button role="switch" aria-checked={shuffleOpt} onClick={() => setShuffleOpt(prev => !prev)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${shuffleOpt ? 'bg-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.5)]' : 'bg-[rgba(255,255,255,0.2)]'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${shuffleOpt ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        <section>
          <h4>TIMER PER QUESTION</h4>
          <div className="button-group">
            {[0, 5, 10, 15].map(t => (
              <button 
                key={t} 
                className={timerLimit === t ? "active" : ""} 
                onClick={() => setTimerLimit(t)}
              >
                {t === 0 ? "OFF" : `${t}s`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4>GLOBAL TIMER (MINUTES)</h4>
          <div className="button-group">
            {[0, 5, 10, 30].map(t => (
              <button 
                key={t} 
                className={globalTimerLimit === t ? "active" : ""} 
                onClick={() => setGlobalTimerLimit(t)}
              >
                {t === 0 ? "OFF" : `${t}m`}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4>NUMBER OF QUESTIONS</h4>
          <div className="button-group">
            {[0, 15, 20].map(n => (
              <button 
                key={n} 
                className={questionCount === n ? "active" : ""} 
                onClick={() => setQuestionCount(n)}
              >
                {n === 0 ? "ALL" : n}
              </button>
            ))}
          </div>
        </section>

        <button className="start-btn" onClick={startQuiz}>START SPRINT</button>
      </div>
    </div>
  );
}
