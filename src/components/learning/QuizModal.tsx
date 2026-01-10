import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, Target, Brain } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModalProps {
  isOpen: boolean;
  moduleTitle: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ 
  isOpen, 
  moduleTitle, 
  questions, 
  onClose, 
  onComplete 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quizStarted, showResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleTimeUp = () => {
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const handleQuizComplete = () => {
    onComplete(score, questions.length);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 10 ? 'text-red-600 font-semibold' : ''}>
                {timeLeft}s
              </span>
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {!quizStarted ? (
          /* Quiz start screen */
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to test your knowledge?
            </h3>
            <p className="text-gray-600 mb-6">
              Answer {questions.length} questions about "{moduleTitle}" to unlock your next learning module!
            </p>
            <button
              onClick={startQuiz}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 text-lg font-semibold"
            >
              Start Quiz Challenge
            </button>
          </div>
        ) : showResult ? (
          /* Final results screen */
          <div className="text-center py-8">
            <div className="mb-6">
              {score >= questions.length * 0.8 ? (
                <div className="text-6xl mb-4">🏆</div>
              ) : score >= questions.length * 0.6 ? (
                <div className="text-6xl mb-4">🌟</div>
              ) : (
                <div className="text-6xl mb-4">📚</div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz Complete!
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              You scored <span className="font-bold text-primary-600">{score}</span> out of{' '}
              <span className="font-bold">{questions.length}</span>
            </p>
            <p className="text-gray-600 mb-6">
              {score >= questions.length * 0.8 
                ? "Outstanding! You've mastered this material!"
                : score >= questions.length * 0.6 
                ? "Great job! You have a solid understanding!"
                : "Good effort! Review the material to improve."
              }
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Review Material
              </button>
              <button
                onClick={handleQuizComplete}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ) : (
          /* Question screen */
          <div>
            <div className="mb-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                  {currentQuestion + 1}
                </div>
                <p className="text-lg text-gray-900 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Answer options */}
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    } ${
                      showResult
                        ? index === currentQ.correctAnswer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : selectedAnswer === index && index !== currentQ.correctAnswer
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                        : ''
                    }`}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showResult && currentQ.explanation && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                  <p className="text-blue-800">{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                {showResult ? (
                  <span>Final Results</span>
                ) : (
                  <span>Select an answer above</span>
                )}
              </div>
              
              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <button
                    onClick={() => {
                      setCurrentQuestion(prev => prev - 1);
                      setSelectedAnswer(null);
                      setShowResult(false);
                      setTimeLeft(30);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                <button
                  onClick={showResult ? handleQuizComplete : handleTimeUp}
                  disabled={!showResult && selectedAnswer === null}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    showResult
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : selectedAnswer !== null
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105'
                  }`}
                >
                  {showResult ? 'Finish' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
