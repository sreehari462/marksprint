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

const DEFAULT_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Maths',
  'Computer Science',
  'Biology',
  'English',
  'Tamil'
];

export function useContentManager() {
  // State Management
  const [allQuestions, setAllQuestions] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState(DEFAULT_SUBJECTS);
  const [availableLessons, setAvailableLessons] = useState([]);
  const [availableVolumes, setAvailableVolumes] = useState([]);
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState('1');
  
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all CSV data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Load from localStorage first (decrypt if storage key is provided)
        const storedData = localStorage.getItem('contentManagerData');
        let localQuestions = [];
        let localSubjects = [...DEFAULT_SUBJECTS];

        if (storedData) {
          try {
            const storageKey = import.meta.env.VITE_CONTENT_MANAGER_STORAGE_KEY || null;
            let parsed = null;
            if (storageKey) {
              try {
                const bytes = CryptoJS.AES.decrypt(storedData, storageKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                parsed = JSON.parse(decrypted);
              } catch (e) {
                console.warn('Failed to decrypt contentManagerData with provided storage key. Falling back to plaintext parsing.');
                parsed = JSON.parse(storedData);
              }
            } else {
              // No storage key configured; read as plaintext but log a warning
              console.warn('No VITE_CONTENT_MANAGER_STORAGE_KEY configured; contentManagerData will be read in plaintext. Configure a storage key to enable encryption.');
              parsed = JSON.parse(storedData);
            }

            localQuestions = parsed.questions || [];
            if (parsed.subjects && parsed.subjects.length > 0) {
              localSubjects = [...new Set([...DEFAULT_SUBJECTS, ...parsed.subjects])];
            }
          } catch (e) {
            console.error('Error parsing stored contentManagerData:', e);
          }
        }

        // Load from all CSV files in parallel
        const csvPromises = Object.entries(CSV_MAP).map(async ([subjectKey, csvUrl]) => {
          try {
            const response = await fetch(csvUrl);
            if (!response.ok) return [];
            
            const text = await response.text();
            return new Promise((resolve) => {
              Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                  const mapped = results.data
                    .filter(q => (q.question && q.question.trim()) || q.question_image)
                    .map(q => ({
                      id: `csv-${subjectKey}-${Math.random().toString(36).substr(2, 9)}`,
                      subject: DEFAULT_SUBJECTS.find(s => 
                        s.toLowerCase().replace(/\s+/g, '') === subjectKey.toLowerCase().replace(/\s+/g, '')
                      ) || subjectKey,
                      lesson: q.lesson || '1',
                      volume: q.vol || '1',
                      question: q.question || '',
                      option_1: q.option_1 || '',
                      option_2: q.option_2 || '',
                      option_3: q.option_3 || '',
                      option_4: q.option_4 || '',
                      answer: q.answer || '',
                      question_image: q.question_image || '',
                      option_1_image: q.option_1_image || '',
                      option_2_image: q.option_2_image || '',
                      option_3_image: q.option_3_image || '',
                      option_4_image: q.option_4_image || '',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      isFromCSV: true
                    }));
                  resolve(mapped);
                },
                error: () => resolve([])
              });
            });
          } catch (e) {
            return [];
          }
        });

        const allCsvResults = await Promise.all(csvPromises);
        const flattenedCsvQuestions = allCsvResults.flat();

        // Merge CSV questions with local questions, avoiding duplicates
        const finalQuestions = [...localQuestions];
        flattenedCsvQuestions.forEach(csvQ => {
          const exists = finalQuestions.some(q => 
            q.subject === csvQ.subject && 
            q.question === csvQ.question &&
            q.lesson === csvQ.lesson &&
            q.volume === csvQ.volume
          );
          if (!exists) {
            finalQuestions.push(csvQ);
          }
        });

        setAllQuestions(finalQuestions);
        setAvailableSubjects(localSubjects);
      } catch (error) {
        console.error('Error loading Content Manager data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Update available lessons when subject or volume changes
  useEffect(() => {
    if (selectedSubject) {
      const lessons = [...new Set(
        allQuestions
          .filter(q => q.subject === selectedSubject && q.volume === selectedVolume)
          .map(q => q.lesson)
          .filter(Boolean)
      )].sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.toString().localeCompare(b.toString());
      });
      setAvailableLessons(lessons);
    }
  }, [selectedSubject, selectedVolume, allQuestions]);

  // Update available volumes when subject changes
  useEffect(() => {
    if (selectedSubject) {
      const volumes = [...new Set(
        allQuestions
          .filter(q => q.subject === selectedSubject)
          .map(q => q.volume)
          .filter(Boolean)
      )].sort();
      setAvailableVolumes(volumes);
      setSelectedVolume(volumes[0] || '1');
    }
  }, [selectedSubject, allQuestions]);

  // Get current questions based on selection
  const currentQuestions = selectedSubject && selectedLesson
    ? allQuestions.filter(
        q => q.subject === selectedSubject && 
             q.lesson === selectedLesson && 
             q.volume === selectedVolume
      )
    : [];

  // Add question
  const handleAddQuestion = useCallback((questionData) => {
    const newQuestion = {
      id: Date.now().toString(),
      subject: selectedSubject,
      lesson: selectedLesson,
      volume: selectedVolume,
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFromCSV: false
    };

    const newQuestions = [...allQuestions, newQuestion];
    setAllQuestions(newQuestions);
    persistData(availableSubjects, newQuestions);
    setShowEditor(false);
    setEditingQuestion(null);
  }, [selectedSubject, selectedLesson, selectedVolume, allQuestions, availableSubjects]);

  // Edit question
  const handleEditQuestion = useCallback((question) => {
    setEditingQuestion(question);
    setShowEditor(true);
  }, []);

  // Update question
  const handleUpdateQuestion = useCallback((updatedQuestion) => {
    const newQuestions = allQuestions.map(q =>
      q.id === updatedQuestion.id
        ? { ...updatedQuestion, updatedAt: new Date().toISOString() }
        : q
    );
    setAllQuestions(newQuestions);
    persistData(availableSubjects, newQuestions);
    setShowEditor(false);
    setEditingQuestion(null);
  }, [allQuestions, availableSubjects]);

  // Delete question
  const handleDeleteQuestion = useCallback((questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
      const newQuestions = allQuestions.filter(q => q.id !== questionId);
      setAllQuestions(newQuestions);
      persistData(availableSubjects, newQuestions);
    }
  }, [allQuestions, availableSubjects]);

  // Add subject
  const handleAddSubject = useCallback((subjectName) => {
    if (!availableSubjects.includes(subjectName)) {
      const newSubjects = [...availableSubjects, subjectName];
      setAvailableSubjects(newSubjects);
      persistData(newSubjects, allQuestions);
    }
  }, [availableSubjects, allQuestions]);

  // Delete subject
  const handleDeleteSubject = useCallback((subjectName) => {
    if (confirm(`Are you sure you want to delete "${subjectName}" and all its questions?`)) {
      const newSubjects = availableSubjects.filter(s => s !== subjectName);
      const newQuestions = allQuestions.filter(q => q.subject !== subjectName);
      setAvailableSubjects(newSubjects);
      setAllQuestions(newQuestions);
      if (selectedSubject === subjectName) {
        setSelectedSubject(null);
        setSelectedLesson(null);
      }
      persistData(newSubjects, newQuestions);
    }
  }, [availableSubjects, allQuestions, selectedSubject]);

  // Import CSV
  const handleImportCSV = useCallback((importedQuestions) => {
    const newQuestions = [
      ...allQuestions,
      ...importedQuestions.map(q => ({
        ...q,
        id: Date.now().toString() + Math.random(),
        subject: q.subject || selectedSubject,
        lesson: q.lesson || selectedLesson,
        volume: q.vol || selectedVolume,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFromCSV: false
      }))
    ];
    setAllQuestions(newQuestions);
    persistData(availableSubjects, newQuestions);
  }, [allQuestions, availableSubjects, selectedSubject, selectedLesson, selectedVolume]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const filteredQuestions = currentQuestions;

    if (filteredQuestions.length === 0) {
      alert('No questions to export for this selection');
      return;
    }

    const csv = [
      ['question', 'option_1', 'option_2', 'option_3', 'option_4', 'answer', 'lesson', 'vol', 'question_image', 'option_1_image', 'option_2_image', 'option_3_image', 'option_4_image'],
      ...filteredQuestions.map(q => [
        q.question || '',
        q.option_1 || '',
        q.option_2 || '',
        q.option_3 || '',
        q.option_4 || '',
        q.answer || '',
        q.lesson || '',
        q.volume || '',
        q.question_image || '',
        q.option_1_image || '',
        q.option_2_image || '',
        q.option_3_image || '',
        q.option_4_image || ''
      ])
    ];

    const csvContent = csv.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSubject}_Lesson${selectedLesson}_Vol${selectedVolume}.csv`;
    a.click();
  }, [currentQuestions, selectedSubject, selectedLesson, selectedVolume]);

  // Persist data to localStorage
  const persistData = useCallback((subjects, questions) => {
    const data = {
      subjects,
      questions,
      lastUpdated: new Date().toISOString()
    };
    try {
      const storageKey = import.meta.env.VITE_CONTENT_MANAGER_STORAGE_KEY || null;
      if (storageKey) {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), storageKey).toString();
        localStorage.setItem('contentManagerData', encrypted);
      } else {
        console.warn('Persisting contentManagerData in plaintext because no VITE_CONTENT_MANAGER_STORAGE_KEY is configured.');
        localStorage.setItem('contentManagerData', JSON.stringify(data));
      }
    } catch (e) {
      console.error('Failed to persist contentManagerData:', e);
    }
  }, []);

  return {
    // State
    allQuestions,
    availableSubjects,
    availableLessons,
    availableVolumes,
    selectedSubject,
    selectedLesson,
    selectedVolume,
    editingQuestion,
    showEditor,
    loading,
    currentQuestions,

    // Setters
    setSelectedSubject,
    setSelectedLesson,
    setSelectedVolume,
    setShowEditor,
    setEditingQuestion,

    // Handlers
    handleAddQuestion,
    handleEditQuestion,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleAddSubject,
    handleDeleteSubject,
    handleImportCSV,
    handleExportCSV
  };
}
