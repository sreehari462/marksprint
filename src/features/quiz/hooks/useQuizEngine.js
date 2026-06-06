import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import CryptoJS from 'crypto-js';

import physicsCsv from '../../../data/physics.csv?url';
import chemistryCsv from '../../../data/chemistry.csv?url';
import mathsCsv from '../../../data/maths.csv?url';
import csCsv from '../../../data/cs.csv?url';
import biologyCsv from '../../../data/biology.csv?url';
import englishCsv from '../../../data/english.csv?url';
import tamilCsv from '../../../data/tamil.csv?url';

const CSV_MAP = {
  physics: physicsCsv,
  chemistry: chemistryCsv,
  maths: mathsCsv,
  cs: csCsv,
  computer: csCsv,
  biology: biologyCsv,
  english: englishCsv,
  tamil: tamilCsv
};

const SUBJECT_MAP = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  maths: 'Maths',
  cs: 'Computer Science',
  computer: 'Computer Science',
  biology: 'Biology',
  english: 'English',
  tamil: 'Tamil'
};

export function useQuizEngine(subject) {
  // Quiz Configuration State
  const [quizMode, setQuizMode] = useState("setup"); // "setup", "active", "result", "revision"
  const [quizType, setQuizType] = useState("full");
  const [selectedLessons, setSelectedLessons] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("all");
  const [repeatWrong, setRepeatWrong] = useState(true);
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleOpt, setShuffleOpt] = useState(true);
  const [timerLimit, setTimerLimit] = useState(0); // per question timer
  const [globalTimerLimit, setGlobalTimerLimit] = useState(0); // per quiz timer
  const [questionCount, setQuestionCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false); // false = Practice, true = Test

  // Quiz Execution State
  const [allQuestions, setAllQuestions] = useState([]);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // per question
  const [globalTimeLeft, setGlobalTimeLeft] = useState(0); // per quiz
  
  // First Attempt Tracking (for final results & review)
  const [firstAttemptQuestions, setFirstAttemptQuestions] = useState([]);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);
  const [firstAttemptAnswers, setFirstAttemptAnswers] = useState([]); // { questionObj, userAnswer, isCorrect }
  
  // Repeat Loop Tracking
  const [currentRoundWrong, setCurrentRoundWrong] = useState([]);
  const [isInRepeatMode, setIsInRepeatMode] = useState(false);

  // Load CSV Data and merge with localStorage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get the proper subject name for matching
        const properSubjectName = SUBJECT_MAP[subject?.toLowerCase()] || subject;
        
        // Load localStorage data first (decrypt if storage key provided)
        const storedData = localStorage.getItem('contentManagerData');
        let localQuestions = [];
        if (storedData) {
          try {
            const storageKey = import.meta.env.VITE_CONTENT_MANAGER_STORAGE_KEY || null;
            if (storageKey) {
              try {
                const bytes = CryptoJS.AES.decrypt(storedData, storageKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                const parsed = JSON.parse(decrypted);
                localQuestions = parsed.questions || [];
              } catch (e) {
                console.warn('Failed to decrypt contentManagerData with provided storage key; falling back to plaintext parse.');
                const parsed = JSON.parse(storedData);
                localQuestions = parsed.questions || [];
              }
            } else {
              console.warn('No VITE_CONTENT_MANAGER_STORAGE_KEY configured; reading contentManagerData as plaintext.');
              const parsed = JSON.parse(storedData);
              localQuestions = parsed.questions || [];
            }
          } catch (e) {
            console.error('Error parsing contentManagerData:', e);
          }
        }

        const csvFile = CSV_MAP[subject?.toLowerCase()];
        if (!csvFile) {
          throw new Error(`CSV not mapped for ${subject}`);
        }
        const response = await fetch(csvFile);
        if (!response.ok) throw new Error(`Failed to load ${csvFile}`);
        
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          dynamicTyping: false,
          skipEmptyLines: true,
          complete: (results) => {
            let filtered = results.data.filter(q => (q.question && q.question.trim()) || q.question_image);
            
            // Merge with localStorage data
            // First, add all CSV questions
            let mergedQuestions = filtered.map(q => ({
              ...q,
              id: `csv-${subject}-${q.question}-${q.lesson}-${q.vol}`,
              isFromCSV: true,
              subject: properSubjectName
            }));

            // Then, add/override with localStorage questions for this subject
            const localSubjectQuestions = localQuestions.filter(q => q.subject === properSubjectName);
            localSubjectQuestions.forEach(localQ => {
              // Check if this question exists in CSV (by question text and lesson/volume)
              const csvIndex = mergedQuestions.findIndex(q => 
                q.question === localQ.question && 
                q.lesson === localQ.lesson && 
                q.vol === localQ.volume
              );
              
              if (csvIndex !== -1) {
                // Override the CSV question with the edited version
                mergedQuestions[csvIndex] = {
                  ...localQ,
                  subject: properSubjectName,
                  volume: localQ.volume || localQ.vol,
                  vol: localQ.volume || localQ.vol,
                  isFromCSV: false
                };
              } else {
                // Add new question from localStorage
                mergedQuestions.push({
                  ...localQ,
                  subject: properSubjectName,
                  volume: localQ.volume || localQ.vol,
                  vol: localQ.volume || localQ.vol,
                  isFromCSV: false
                });
              }
            });

            setAllQuestions(mergedQuestions);
            const lessons = [...new Set(mergedQuestions.map(q => q.lesson))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
            setAvailableLessons(lessons);
            const volumes = [...new Set(mergedQuestions.map(q => q.vol || q.volume))].filter(Boolean).sort();
            setAvailableVolumes(volumes);
            setLoading(false);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading questions:", error);
        setLoading(false);
      }
    };
    if (subject) loadData();
  }, [subject]);

  // Start Quiz
  const startQuiz = useCallback(() => {
    if (allQuestions.length === 0) {
      alert("No questions available for this subject");
      return;
    }

    let filtered = [...allQuestions];
    if (quizType === "volume" && selectedVolume !== "all") {
      filtered = filtered.filter(q => (q.vol || q.volume) === selectedVolume);
    }
    if (quizType === "lesson" && selectedLessons.length > 0) {
      filtered = filtered.filter(q => selectedLessons.includes(q.lesson));
    }
    if (shuffleQ) {
      filtered.sort(() => Math.random() - 0.5);
    }
    if (questionCount > 0 && questionCount < filtered.length) {
      filtered = filtered.slice(0, parseInt(questionCount));
    }

    filtered = filtered.map(q => {
      const options = [
        { text: q.option_1, img: q.option_1_image },
        { text: q.option_2, img: q.option_2_image },
        { text: q.option_3, img: q.option_3_image },
        { text: q.option_4, img: q.option_4_image }
      ].filter(o => o.text || o.img);
      if (shuffleOpt) options.sort(() => Math.random() - 0.5);
      return { ...q, displayOptions: options };
    });

    setFirstAttemptQuestions(filtered);
    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setFirstAttemptCorrect(0);
    setFirstAttemptAnswers([]);
    setUserAnswer(null);
    setIsLocked(false);
    setIsInRepeatMode(false);
    setCurrentRoundWrong([]);
    setQuizMode("active");
    if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
    if (globalTimerLimit > 0) setGlobalTimeLeft(parseInt(globalTimerLimit) * 60); // Assuming input in minutes
  }, [allQuestions, quizType, selectedVolume, selectedLessons, shuffleQ, questionCount, shuffleOpt, timerLimit, globalTimerLimit]);

  // Handle Answer Submission
  const handleAnswer = useCallback((optionText) => {
    if (isLocked || !quizQuestions[currentIdx]) return;
    
    const currentQ = quizQuestions[currentIdx];
    setUserAnswer(optionText);
    setIsLocked(true);

    const isCorrect = optionText === currentQ.answer;

    if (!isInRepeatMode) {
      setFirstAttemptAnswers(prev => [...prev, { 
        questionObj: currentQ, 
        userAnswer: optionText, 
        isCorrect 
      }]);
      if (isCorrect) setFirstAttemptCorrect(prev => prev + 1);
    }

    let updatedWrong = [...currentRoundWrong];
    if (!isCorrect && repeatWrong && !isTestMode) {
      updatedWrong.push(currentQ);
      setCurrentRoundWrong(updatedWrong);
    }

    const moveToNext = () => {
      if (currentIdx < quizQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setUserAnswer(null);
        setIsLocked(false);
        if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
      } else {
        if (repeatWrong && updatedWrong.length > 0 && !isTestMode) {
          setQuizQuestions(updatedWrong);
          setCurrentRoundWrong([]);
          setCurrentIdx(0);
          setUserAnswer(null);
          setIsLocked(false);
          setIsInRepeatMode(true);
          if (timerLimit > 0) setTimeLeft(parseInt(timerLimit));
        } else {
          setQuizMode("result");
        }
      }
    };

    if (isTestMode) {
      // In test mode, no delay, instantly move to next
      moveToNext();
    } else {
      // In practice mode, show correct/wrong feedback for 1.5s
      setTimeout(moveToNext, 1500);
    }
  }, [isLocked, quizQuestions, currentIdx, isInRepeatMode, repeatWrong, currentRoundWrong, isTestMode, timerLimit]);

  // Finish quiz manually (e.g timeout)
  const finishQuiz = useCallback(() => {
    setQuizMode("result");
  }, []);

  // Start Revision Mode
  const startRevision = useCallback(() => {
    if (allQuestions.length === 0) {
      alert("No questions available for this subject");
      return;
    }

    let filtered = [...allQuestions];
    if (quizType === "volume" && selectedVolume !== "all") {
      filtered = filtered.filter(q => (q.vol || q.volume) === selectedVolume);
    }
    if (quizType === "lesson" && selectedLessons.length > 0) {
      filtered = filtered.filter(q => selectedLessons.includes(q.lesson));
    }
    if (questionCount > 0 && questionCount < filtered.length) {
      filtered = filtered.slice(0, parseInt(questionCount));
    }

    filtered = filtered.map(q => {
      const options = [
        { text: q.option_1, img: q.option_1_image },
        { text: q.option_2, img: q.option_2_image },
        { text: q.option_3, img: q.option_3_image },
        { text: q.option_4, img: q.option_4_image }
      ].filter(o => o.text || o.img);
      return { ...q, displayOptions: options };
    });

    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setQuizMode("revision");
  }, [allQuestions, quizType, selectedVolume, selectedLessons, questionCount]);

  return {
    // Config state
    quizMode, setQuizMode,
    quizType, setQuizType,
    selectedLessons, setSelectedLessons,
    selectedVolume, setSelectedVolume,
    repeatWrong, setRepeatWrong,
    shuffleQ, setShuffleQ,
    shuffleOpt, setShuffleOpt,
    timerLimit, setTimerLimit,
    globalTimerLimit, setGlobalTimerLimit,
    questionCount, setQuestionCount,
    isTestMode, setIsTestMode,
    
    // Data state
    availableLessons, availableVolumes, loading,
    
    // Active Quiz State
    quizQuestions, currentIdx, userAnswer, isLocked,
    timeLeft, setTimeLeft, globalTimeLeft, setGlobalTimeLeft,
    firstAttemptQuestions, firstAttemptCorrect, firstAttemptAnswers,
    isInRepeatMode,
    
    // Actions
    startQuiz, handleAnswer, finishQuiz, startRevision
  };
}
