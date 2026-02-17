import React, { useEffect, useMemo, useState } from 'react';
import { Brain, ChevronDown, ChevronUp, Flame, Sparkles, Star, Trophy, X } from 'lucide-react';
import Confetti from 'react-confetti';

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

interface FlipCardQuizModalProps {
  isOpen: boolean;
  moduleTitle: string;
  questions: QuizQuestion[];
  passPercentage?: number;
  onClose: () => void;
  onPass: (score: number, totalQuestions: number, percentage: number) => void;
}

type FeedbackState = 'idle' | 'correct' | 'incorrect';

const FlipCardQuizModal: React.FC<FlipCardQuizModalProps> = ({
  isOpen,
  moduleTitle,
  questions,
  passPercentage = 50,
  onClose,
  onPass,
}) => {
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [revealedExplanation, setRevealedExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // moved confetti trigger effect below, after 'completed' and 'passed' are defined

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [matchSelectedTerm, setMatchSelectedTerm] = useState<string | null>(null);
  const [matchMapping, setMatchMapping] = useState<Record<string, string>>({});

  const [orderedSteps, setOrderedSteps] = useState<string[]>([]);
  const [orderTouched, setOrderTouched] = useState(false);

  const [categorizeAssignments, setCategorizeAssignments] = useState<Record<string, string>>({});

  const [fillBlankSelected, setFillBlankSelected] = useState<string | null>(null);

  const playTone = async (frequency: number, durationMs: number, type: OscillatorType, volume: number) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = frequency;

      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      osc.start(now);
      osc.stop(now + durationMs / 1000);

      await new Promise<void>((resolve) => {
        osc.onended = () => resolve();
      });
    } finally {
      try {
        await ctx.close();
      } catch {
        // ignore
      }
    }
  };

  const playCorrectSound = async () => {
    try {
      await playTone(660, 110, 'sine', 0.18);
      await playTone(880, 140, 'sine', 0.2);
      await playTone(1320, 160, 'triangle', 0.16);
    } catch {
      // ignore
    }
  };

  const playIncorrectSound = async () => {
    try {
      await playTone(330, 180, 'sine', 0.16);
      await playTone(220, 220, 'sine', 0.14);
    } catch {
      // ignore
    }
  };

  const totalQuestions = shuffledQuestions.length;
  const currentQ = shuffledQuestions[currentQuestionIndex];

  const progressPct = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  }, [currentQuestionIndex, totalQuestions]);

  const percentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((score / totalQuestions) * 100);
  }, [score, totalQuestions]);

  const passed = percentage >= passPercentage;

  // Trigger confetti once when the quiz is completed and passed
  useEffect(() => {
    if (completed && passed) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [completed, passed]);

  useEffect(() => {
    if (!isOpen) return;

    const shuffled = [...questions]
      .map((q) => ({ q, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ q }) => q);

    setShuffledQuestions(shuffled);
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback('idle');
    setRevealedExplanation(false);
    setScore(0);
    setXp(0);
    setStreak(0);
    setCompleted(false);

    setMatchSelectedTerm(null);
    setMatchMapping({});
    setOrderedSteps([]);
    setOrderTouched(false);
    setCategorizeAssignments({});
    setFillBlankSelected(null);
  }, [isOpen, questions]);

  useEffect(() => {
    const q = currentQ;
    if (!q) return;

    setSelectedAnswer(null);
    setMatchSelectedTerm(null);
    setMatchMapping({});
    setCategorizeAssignments({});
    setFillBlankSelected(null);
    setOrderTouched(false);

    if (q.type === 'order_steps' && q.steps && q.steps.length > 0) {
      const shuffledSteps = [...q.steps]
        .map((s) => ({ s, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ s }) => s);
      setOrderedSteps(shuffledSteps);
    } else {
      setOrderedSteps([]);
    }
  }, [currentQuestionIndex, currentQ?.id]);

  const getQuestionType = (q?: QuizQuestion) => q?.type || 'multiple_choice';

  const isResponseComplete = (q?: QuizQuestion): boolean => {
    if (!q) return false;
    const t = getQuestionType(q);
    if (t === 'multiple_choice') return selectedAnswer !== null;
    if (t === 'match_pairs') {
      const pairs = q.pairs || [];
      if (pairs.length === 0) return false;
      return pairs.every((p) => Boolean(matchMapping[p.term]));
    }
    if (t === 'order_steps') {
      const steps = q.steps || [];
      if (steps.length === 0) return false;
      return orderTouched && orderedSteps.length === steps.length;
    }
    if (t === 'categorize') {
      const items = q.items || [];
      if (items.length === 0) return false;
      return items.every((i) => Boolean(categorizeAssignments[i.label]));
    }
    if (t === 'fill_blank') {
      return Boolean(fillBlankSelected);
    }
    return false;
  };

  const isCorrectResponse = (q?: QuizQuestion): boolean => {
    if (!q) return false;
    const t = getQuestionType(q);

    if (t === 'multiple_choice') return selectedAnswer === q.correctAnswer;

    if (t === 'match_pairs') {
      const pairs = q.pairs || [];
      if (pairs.length === 0) return false;
      return pairs.every((p) => matchMapping[p.term] === p.definition);
    }

    if (t === 'order_steps') {
      const steps = q.steps || [];
      if (steps.length === 0) return false;
      if (orderedSteps.length !== steps.length) return false;
      return steps.every((s, idx) => orderedSteps[idx] === s);
    }

    if (t === 'categorize') {
      const items = q.items || [];
      if (items.length === 0) return false;
      return items.every((i) => categorizeAssignments[i.label] === i.category);
    }

    if (t === 'fill_blank') {
      if (!q.correctWord) return false;
      return fillBlankSelected === q.correctWord;
    }

    return false;
  };

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleSubmit = () => {
    if (!currentQ) return;
    if (!isResponseComplete(currentQ)) return;
    if (feedback !== 'idle') return;

    const isCorrect = isCorrectResponse(currentQ);

    if (isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setXp((prev) => prev + 10 + Math.min(20, streak * 2));
      void playCorrectSound();
    } else {
      setFeedback('incorrect');
      setStreak(0);
      void playIncorrectSound();
    }
  };

  const goNext = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= totalQuestions) {
      setCompleted(true);
      return;
    }

    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setFeedback('idle');
    setRevealedExplanation(false);

    setMatchSelectedTerm(null);
    setMatchMapping({});
    setOrderTouched(false);
    setCategorizeAssignments({});
    setFillBlankSelected(null);
  };

  const handleRetry = () => {
    const reshuffled = [...shuffledQuestions]
      .map((q) => ({ q, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ q }) => q);

    setShuffledQuestions(reshuffled);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback('idle');
    setRevealedExplanation(false);
    setScore(0);
    setXp(0);
    setStreak(0);
    setCompleted(false);

    setMatchSelectedTerm(null);
    setMatchMapping({});
    setOrderedSteps([]);
    setOrderTouched(false);
    setCategorizeAssignments({});
    setFillBlankSelected(null);
  };

  const handlePass = () => {
    onPass(score, totalQuestions, percentage);
  };

  if (!isOpen) return null;

  const renderFrontInteraction = () => {
    if (!currentQ) return null;
    const t = getQuestionType(currentQ);

    if (t === 'multiple_choice') {
      return (
        <div className="space-y-3">
          {currentQ?.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedAnswer === idx
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      );
    }

    if (t === 'match_pairs') {
      const pairs = currentQ.pairs || [];
      const terms = pairs.map((p) => p.term);
      const definitions = [...pairs.map((p) => p.definition)]
        .map((d) => ({ d, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ d }) => d);

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-600">Terms</div>
            {terms.map((term) => (
              <button
                key={term}
                onClick={() => setMatchSelectedTerm(term)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  matchSelectedTerm === term
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{term}</span>
                  {matchMapping[term] ? (
                    <span className="text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-1">Matched</span>
                  ) : (
                    <span className="text-xs text-gray-400">Select</span>
                  )}
                </div>
                {matchMapping[term] && <div className="mt-2 text-xs text-gray-600">→ {matchMapping[term]}</div>}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-600">Definitions</div>
            {definitions.map((def) => (
              <button
                key={def}
                onClick={() => {
                  if (!matchSelectedTerm) return;
                  setMatchMapping((prev) => ({ ...prev, [matchSelectedTerm]: def }));
                  setMatchSelectedTerm(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  matchSelectedTerm
                    ? 'border-gray-200 hover:bg-gray-50 text-gray-800'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!matchSelectedTerm}
              >
                <span className="text-sm">{def}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setMatchSelectedTerm(null);
                setMatchMapping({});
              }}
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Matches
            </button>
          </div>
        </div>
      );
    }

    if (t === 'order_steps') {
      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-600">Arrange the steps</div>
          {orderedSteps.map((step, idx) => (
            <div key={`${step}-${idx}`} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                {idx + 1}
              </div>
              <div className="flex-1 text-sm font-medium text-gray-800">{step}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (idx === 0) return;
                    setOrderTouched(true);
                    setOrderedSteps((prev) => {
                      const copy = [...prev];
                      const tmp = copy[idx - 1];
                      copy[idx - 1] = copy[idx];
                      copy[idx] = tmp;
                      return copy;
                    });
                  }}
                  className={`px-3 py-1 text-sm rounded-lg ${idx === 0 ? 'bg-blue-300 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  disabled={idx === 0}
                >
                  Up
                </button>
                <button
                  onClick={() => {
                    if (idx === orderedSteps.length - 1) return;
                    setOrderTouched(true);
                    setOrderedSteps((prev) => {
                      const copy = [...prev];
                      const tmp = copy[idx + 1];
                      copy[idx + 1] = copy[idx];
                      copy[idx] = tmp;
                      return copy;
                    });
                  }}
                  className={`px-3 py-1 text-sm rounded-lg ${idx === orderedSteps.length - 1 ? 'bg-orange-300 text-white cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                  disabled={idx === orderedSteps.length - 1}
                >
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (t === 'categorize') {
      const cats = currentQ.categories || [];
      const items = currentQ.items || [];

      return (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-600">Assign each item to a category</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cats.map((cat) => (
              <div key={cat} className="border border-gray-200 rounded-xl p-3">
                <div className="text-sm font-semibold text-gray-900 mb-2">{cat}</div>
                <div className="space-y-2">
                  {items
                    .filter((i) => categorizeAssignments[i.label] === cat)
                    .map((i) => (
                      <div key={`${cat}-${i.label}`} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                        {i.label}
                      </div>
                    ))}
                  {items.filter((i) => categorizeAssignments[i.label] === cat).length === 0 && (
                    <div className="text-xs text-gray-500">Drop items here by assigning below</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-xl p-3">
            <div className="text-sm font-semibold text-gray-900 mb-2">Items</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map((i) => {
                const assigned = categorizeAssignments[i.label];
                return (
                  <button
                    key={i.label}
                    onClick={() => {
                      if (cats.length === 0) return;
                      setCategorizeAssignments((prev) => {
                        const current = prev[i.label];
                        const idx = current ? cats.indexOf(current) : -1;
                        const next = cats[(idx + 1) % cats.length];
                        return { ...prev, [i.label]: next };
                      });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-gray-900">{i.label}</span>
                      <span className="text-xs text-gray-700 bg-white border border-gray-200 rounded-full px-2 py-1">
                        {assigned || 'Unassigned'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCategorizeAssignments({})}
              className="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Categories
            </button>
          </div>
        </div>
      );
    }

    if (t === 'fill_blank') {
      const template = currentQ.template || '';
      const bank = currentQ.wordBank || [];
      const rendered = template.includes('____')
        ? template.replace('____', fillBlankSelected ? fillBlankSelected : '____')
        : template;

      return (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
            {rendered}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">Word bank</div>
            <div className="flex flex-wrap gap-2">
              {bank.map((w) => (
                <button
                  key={w}
                  onClick={() => setFillBlankSelected(w)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    fillBlankSelected === w
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  {w}
                </button>
              ))}
              <button
                onClick={() => setFillBlankSelected(null)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}
      <div className="bg-white rounded-2xl p-8 max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
              <p className="text-sm text-gray-600">Complete this checkpoint to continue your learning journey.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>
              {quizStarted && !completed ? `Question ${currentQuestionIndex + 1} of ${totalQuestions}` : 'Checkpoint'}
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                <Star className="w-4 h-4" />
                <span className="text-xs font-semibold">XP {xp}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-800 px-2 py-1 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="text-xs font-semibold">Streak {streak}</span>
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {!quizStarted ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-50 border border-primary-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Checkpoint: Knowledge Gate</h3>
            <p className="text-gray-600 mb-2">You finished:</p>
            <p className="text-gray-900 font-semibold mb-6">"{moduleTitle}"</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left max-w-lg mx-auto mb-6">
              <p className="text-blue-900 font-semibold">Complete this quiz to continue to the next learning material.</p>
              <p className="text-blue-800 text-sm mt-1">No answers are revealed on incorrect attempts. You must demonstrate mastery.</p>
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 text-lg font-semibold"
            >
              Start Knowledge Check
            </button>
          </div>
        ) : completed ? (
          <div className={`text-center py-8 transition-all duration-500 ${passed ? 'bg-gradient-to-b from-green-50 to-white' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
            {passed ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                    <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-800 mb-3">Awesome! 🎉</h3>
                  <p className="text-green-700 mb-2 text-lg">You've passed with {percentage}%!</p>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Great job! You've unlocked the next learning material.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handlePass}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Continue Learning →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                    <div className="text-4xl">💡</div>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">Keep Going! 🌱</h3>
                  <p className="text-blue-700 mb-2">You scored {score} out of {totalQuestions} ({percentage}%)</p>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You're making progress! Review the material and try again. Every attempt helps you learn.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 border border-blue-300 text-blue-700 bg-white hover:bg-blue-50 rounded-lg font-medium transition-colors"
                  >
                    ↻ Try Again
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Review Material
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div
                className="relative w-full h-[460px]"
              >
                <div
                  className={`absolute inset-0 rounded-2xl border p-6 transition-colors ${
                    feedback === 'correct'
                      ? 'border-green-300 bg-green-50'
                      : feedback === 'incorrect'
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-700 font-bold">
                        {currentQuestionIndex + 1}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900 leading-snug">{currentQ?.question}</p>
                        <p className="text-sm text-gray-600 mt-1">Choose your answer and submit.</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 bg-white/70 border border-gray-200 rounded-full px-3 py-1">
                      Score {score}/{totalQuestions}
                    </div>
                  </div>

                  {renderFrontInteraction()}

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Pass mark: {passPercentage}%</div>
                    <button
                      onClick={handleSubmit}
                      disabled={!isResponseComplete(currentQ) || feedback !== 'idle'}
                      className={`px-6 py-2 rounded-lg transition-all ${
                        !isResponseComplete(currentQ) || feedback !== 'idle'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                      }`}
                    >
                      Submit Answer
                    </button>
                  </div>

                  {feedback !== 'idle' && (
                    <div className="mt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className={`text-xl font-bold ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                            {feedback === 'correct' ? 'Correct! Keep going.' : 'Incorrect — try again!'}
                          </h4>
                          <p className={`mt-1 text-sm ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                            {feedback === 'correct'
                              ? `+${10 + Math.min(20, streak * 2)} XP earned. Your streak grows!`
                              : 'No correct answer is revealed. You must demonstrate mastery to pass.'}
                          </p>
                        </div>
                      </div>

                      {feedback === 'correct' && currentQ?.explanation && (
                        <div className="mt-5">
                          <button
                            onClick={() => setRevealedExplanation((p) => !p)}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white/70 border border-white/60 rounded-lg text-sm font-semibold text-gray-900 hover:bg-white"
                          >
                            {revealedExplanation ? 'Hide why this is correct' : 'Why is this correct?'}
                            {revealedExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {revealedExplanation && (
                            <div className="mt-3 p-4 bg-white/70 border border-white/60 rounded-xl text-gray-900">
                              {currentQ.explanation}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={goNext}
                          className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
                        >
                          Next Card
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlipCardQuizModal;
