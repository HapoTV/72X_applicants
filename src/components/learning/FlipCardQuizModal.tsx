import React, { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import QuizHeader from './QuizHeader';
import QuizProgress from './QuizProgress';
import FlipCardQuizModalStart from './FlipCardQuizModalStart';
import FlipCardQuizModalCompletion from './FlipCardQuizModalCompletion';
import FlipCardQuizModalInteraction from './FlipCardQuizModalInteraction';
import QuizSubmit from './QuizSubmit';
import QuizFeedback from './QuizFeedback';

interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'match_pairs' | 'order_steps' | 'categorize' | 'fill_blank';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;

  pairs?: { term: string; definition: string }[];
  steps?: string[];
  categories?: string[];
  items?: { label: string; category: string }[];
  template?: string;
  wordBank?: string[];
  correctWord?: string;
}

interface Props {
  isOpen: boolean;
  moduleTitle: string;
  questions: QuizQuestion[];
  passPercentage?: number;
  onClose: () => void;
  onPass: (score: number, total: number, percentage: number) => void;
}

type Feedback = 'idle' | 'correct' | 'incorrect';

const FlipCardQuizModal: React.FC<Props> = ({
  isOpen,
  moduleTitle,
  questions,
  passPercentage = 50,
  onClose,
  onPass,
}) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);

  const [fillBlankSelected, setFillBlankSelected] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  const [showConfetti, setShowConfetti] = useState(false);

  // Derived
  const total = shuffledQuestions.length;
  const currentQ = shuffledQuestions[index] ?? null; // ✅ guard against undefined

  const percentage = useMemo(
    () => (total ? Math.round((score / total) * 100) : 0),
    [score, total]
  );

  const progress = useMemo(
    () => (total ? Math.round(((index + 1) / total) * 100) : 0),
    [index, total]
  );

  const passed = percentage >= passPercentage;

  // Reset progress-related state only
  const resetProgress = () => {
    setCompleted(false);
    setIndex(0);
    setSelectedAnswer(null);
    setFillBlankSelected(null);
    setFeedback('idle');
    setScore(0);
    setXp(0);
    setStreak(0);
  };

  // Full reset (used for retry)
  const resetQuiz = () => {
    resetProgress();
    setQuizStarted(false);
  };

  // Shuffle questions on open
  useEffect(() => {
    if (!isOpen || !questions.length) return;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);

    resetProgress(); // safe reset, doesn’t touch quizStarted
  }, [isOpen, questions]);

  // Confetti
  useEffect(() => {
    if (completed && passed) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [completed, passed]);

  const handleSubmit = () => {
    if (!currentQ || feedback !== 'idle') return;

    let correct = false;

    if (currentQ.type === 'fill_blank') {
      if (!fillBlankSelected) return;
      correct = fillBlankSelected === currentQ.correctWord;
    } else {
      if (selectedAnswer === null) return;
      correct = selectedAnswer === currentQ.correctAnswer;
    }

    if (correct) {
      setFeedback('correct');
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setXp((x) => x + 10);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      setCompleted(true);
      return;
    }

    setIndex((i) => i + 1);
    setSelectedAnswer(null);
    setFillBlankSelected(null);
    setFeedback('idle');
  };

  const retry = () => {
    const reshuffled = [...shuffledQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(reshuffled);
    resetQuiz();
    setQuizStarted(true);
  };

  const handlePass = () => {
    onPass(score, total, percentage);
  };

  if (!isOpen) return null;

  if (quizStarted && !completed && !currentQ) {
    return <div className="text-center p-10">Loading next question...</div>; // ✅ safe fallback
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {showConfetti && <Confetti numberOfPieces={400} recycle={false} />}

      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
        <QuizHeader onClose={onClose} />

        <QuizProgress
          currentQuestion={index + 1}
          totalQuestions={total}
          progressPercentage={progress}
          xp={xp}
          streak={streak}
          quizStarted={quizStarted}
          completed={completed}
        />

        {!quizStarted ? (
          <FlipCardQuizModalStart
            moduleTitle={moduleTitle}
            onStart={() => setQuizStarted(true)}
          />
        ) : completed ? (
          <FlipCardQuizModalCompletion
            passed={passed}
            score={score}
            totalQuestions={total}
            percentage={percentage}
            onPass={handlePass}
            onRetry={retry}
            onClose={onClose}
          />
        ) : (
          <>
            <FlipCardQuizModalInteraction
              currentQuestion={currentQ}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
              fillBlankSelected={fillBlankSelected}
              onFillBlankSelect={setFillBlankSelected}
              feedback={feedback}
            />

            <QuizSubmit
              onSubmit={handleSubmit}
              disabled={
                feedback !== 'idle' ||
                !(selectedAnswer !== null || fillBlankSelected !== null)
              }
              passPercentage={passPercentage}
            />

            <QuizFeedback
              feedback={feedback}
              score={score}
              totalQuestions={total}
              streak={streak}
              explanation={currentQ?.explanation}
              onNext={next}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FlipCardQuizModal;
