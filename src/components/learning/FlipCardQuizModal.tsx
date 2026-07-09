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
  materialId?: string;
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

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [fillBlankSelected, setFillBlankSelected] = useState<string | null>(null);
  const [matchSelectedTerm, setMatchSelectedTerm] = useState<string | null>(null);
  const [matchMapping, setMatchMapping] = useState<Record<string, string>>({});
  const [matchDefinitions, setMatchDefinitions] = useState<string[]>([]);
  const [orderedSteps, setOrderedSteps] = useState<string[]>([]);
  const [categorizeAssignments, setCategorizeAssignments] = useState<Record<string, string>>({});
  const [revealedExplanation, setRevealedExplanation] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = shuffledQuestions.length;
  const currentQ = shuffledQuestions[index] ?? null;

  const percentage = useMemo(
    () => (total ? Math.round((score / total) * 100) : 0),
    [score, total]
  );

  const progress = useMemo(
    () => (total ? Math.round(((index + 1) / total) * 100) : 0),
    [index, total]
  );

  const passed = percentage >= passPercentage;

  // RESET STATE (clean fix for your error)
  useEffect(() => {
    if (!isOpen || !questions.length) return;

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);

    setCompleted(false);
    setIndex(0);
    setSelectedAnswer(null);
    setFillBlankSelected(null);
    setMatchSelectedTerm(null);
    setMatchMapping({});
    setMatchDefinitions([]);
    setOrderedSteps([]);
    setCategorizeAssignments({});
    setRevealedExplanation(false);
    setFeedback('idle');
    setScore(0);
    setXp(0);
    setStreak(0);
    setQuizStarted(false);
  }, [isOpen, questions]);

  useEffect(() => {
    if (!currentQ) return;

    setSelectedAnswer(null);
    setFillBlankSelected(null);
    setMatchSelectedTerm(null);
    setMatchMapping({});
    setCategorizeAssignments({});
    setRevealedExplanation(false);
    setFeedback('idle');

    if (currentQ.type === 'match_pairs' && currentQ.pairs) {
      setMatchDefinitions(
        currentQ.pairs.map((p) => p.definition).sort(() => Math.random() - 0.5)
      );
    }

    if (currentQ.type === 'order_steps' && currentQ.steps) {
      setOrderedSteps([...currentQ.steps].sort(() => Math.random() - 0.5));
    }
  }, [currentQ]);

  useEffect(() => {
    if (completed && passed) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [completed, passed]);

  const isQuestionAnswered = useMemo(() => {
    if (!currentQ) return false;

    switch (currentQ.type) {
      case 'fill_blank':
        return !!fillBlankSelected;
      case 'match_pairs':
        return currentQ.pairs?.every((p) => matchMapping[p.term]);
      case 'order_steps':
        return orderedSteps.length === currentQ.steps?.length;
      case 'categorize':
        return currentQ.items?.every((i) => categorizeAssignments[i.label]);
      default:
        return selectedAnswer !== null;
    }
  }, [currentQ, selectedAnswer, fillBlankSelected, matchMapping, orderedSteps, categorizeAssignments]);

  const handleSubmit = () => {
    if (!currentQ || feedback !== 'idle') return;

    let correct = false;

    switch (currentQ.type) {
      case 'fill_blank':
        correct = fillBlankSelected === currentQ.correctWord;
        break;
      case 'match_pairs':
        correct = currentQ.pairs?.every((p) => matchMapping[p.term] === p.definition) ?? false;
        break;
      case 'order_steps':
        correct = currentQ.steps?.every((s, i) => orderedSteps[i] === s) ?? false;
        break;
      case 'categorize':
        correct = currentQ.items?.every((i) => categorizeAssignments[i.label] === i.category) ?? false;
        break;
      default:
        correct = selectedAnswer === currentQ.correctAnswer;
    }

    if (correct) {
      setFeedback('correct');
      setScore((v) => v + 1);
      setStreak((v) => v + 1);
      setXp((v) => v + 10);
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }
  };

  const next = () => {
    if (index + 1 >= total) {
      setCompleted(true);
    } else {
      setIndex((v) => v + 1);
    }
  };

  const retry = () => {
    setQuizStarted(true);
    setCompleted(false);
    setIndex(0);
    setScore(0);
    setXp(0);
    setStreak(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {showConfetti && <Confetti />}

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
            onPass={() => onPass(score, total, percentage)}
            onRetry={retry}
            onClose={onClose}
          />
        ) : (
          <>
            <FlipCardQuizModalInteraction
              currentQuestion={currentQ}
              currentQuestionIndex={index}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={setSelectedAnswer}
              matchSelectedTerm={matchSelectedTerm}
              onMatchTermSelect={setMatchSelectedTerm}
              matchMapping={matchMapping}
              onMatchMappingChange={setMatchMapping}
              matchDefinitions={matchDefinitions}
              orderedSteps={orderedSteps}
              onOrderedStepsChange={setOrderedSteps}
              onOrderTouched={() => undefined}
              categorizeAssignments={categorizeAssignments}
              onCategorizeAssignmentChange={setCategorizeAssignments}
              fillBlankSelected={fillBlankSelected}
              onFillBlankSelect={setFillBlankSelected}
              feedback={feedback}
            />

            <QuizSubmit
              onSubmit={handleSubmit}
              disabled={!isQuestionAnswered || feedback !== 'idle'}
              passPercentage={passPercentage}
            />

            <QuizFeedback
              feedback={feedback}
              score={score}
              totalQuestions={total}
              streak={streak}
              explanation={currentQ?.explanation}
              revealedExplanation={revealedExplanation}
              onToggleExplanation={() => setRevealedExplanation((v) => !v)}
              onNext={next}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FlipCardQuizModal;