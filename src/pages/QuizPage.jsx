import React from "react";
import { useParams } from "react-router-dom";

import { useQuizEngine } from "../features/quiz/hooks/useQuizEngine";
import QuizSetup from "../features/quiz/components/QuizSetup";
import QuizActive from "../features/quiz/components/QuizActive";
import ResultsBoard from "../features/quiz/components/ResultsBoard";
import RevisionBoard from "../features/quiz/components/RevisionBoard";

export default function QuizPage() {
  const { subject } = useParams();
  const engine = useQuizEngine(subject);

  return (
    <div className="w-full flex-1 h-full flex flex-col items-center">
      {engine.quizMode === "setup" && <QuizSetup engine={engine} subject={subject} />}
      {engine.quizMode === "active" && <QuizActive engine={engine} />}
      {engine.quizMode === "result" && <ResultsBoard engine={engine} />}
      {engine.quizMode === "revision" && <RevisionBoard engine={engine} />}
    </div>
  );
}
