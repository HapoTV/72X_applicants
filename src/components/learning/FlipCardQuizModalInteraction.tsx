import React from 'react';
import QuestionMultipleChoice from './Questions/QuestionMultipleChoice';
import QuestionMatchPairs from './Questions/QuestionMatchPairs';
import QuestionOrderStep from './Questions/QuestionOrderStep';
import QuestionCategorize from './Questions/QuestionCategorize';
import QuestionFillBlank from './Questions/QuestionFillBlank';

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

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface Props {
  currentQuestion?: QuizQuestion;
  currentQuestionIndex: number;

  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;

  matchSelectedTerm: string | null;
  onMatchTermSelect: (term: string | null) => void;
  matchMapping: Record<string, string>;
  onMatchMappingChange: (mapping: Record<string, string>) => void;
  matchDefinitions: string[];

  orderedSteps: string[];
  onOrderedStepsChange: (steps: string[]) => void;
  onOrderTouched: (touched: boolean) => void;

  categorizeAssignments: Record<string, string>;
  onCategorizeAssignmentChange: (assignments: Record<string, string>) => void;

  fillBlankSelected: string | null;
  onFillBlankSelect: (word: string | null) => void;

  feedback: FeedbackState;
}

const FlipCardQuizModalInteraction: React.FC<Props> = ({
  currentQuestion,
  currentQuestionIndex,
  selectedAnswer,
  onAnswerSelect,
  matchSelectedTerm,
  onMatchTermSelect,
  matchMapping,
  onMatchMappingChange,
  matchDefinitions,
  orderedSteps,
  onOrderedStepsChange,
  onOrderTouched,
  categorizeAssignments,
  onCategorizeAssignmentChange,
  fillBlankSelected,
  onFillBlankSelect,
  feedback,
}) => {
  if (!currentQuestion) return null;

  const type = currentQuestion.type || 'multiple_choice';

  // ✅ Clean fill blank rendering
  const renderQuestionText = () => {
    if (type !== 'fill_blank') return currentQuestion.question;

    const template = currentQuestion.template || currentQuestion.question || '';

    if (!template.includes('____')) return template;

    return template.replace('____', fillBlankSelected || '____');
  };

  return (
    <div className="mb-6">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6">
        {/* Question Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary-50 border border-primary-100 text-primary-700 font-bold">
            {currentQuestionIndex + 1}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900">
              {renderQuestionText()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Choose an answer and submit.
            </p>
          </div>
        </div>

        {/* Question Types */}
        {type === 'multiple_choice' && (
          <QuestionMultipleChoice
            options={currentQuestion.options || []}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
            feedback={feedback}
          />
        )}

        {type === 'match_pairs' && currentQuestion.pairs && (
          <QuestionMatchPairs
            pairs={currentQuestion.pairs}
            matchSelectedTerm={matchSelectedTerm}
            onMatchTermSelect={onMatchTermSelect}
            matchMapping={matchMapping}
            onMatchMappingChange={onMatchMappingChange}
            matchDefinitions={matchDefinitions}
          />
        )}

        {type === 'order_steps' && currentQuestion.steps && (
          <QuestionOrderStep
            steps={currentQuestion.steps}
            orderedSteps={orderedSteps}
            onOrderedStepsChange={onOrderedStepsChange}
            onOrderTouched={onOrderTouched}
          />
        )}

        {type === 'categorize' &&
          currentQuestion.categories &&
          currentQuestion.items && (
            <QuestionCategorize
              categories={currentQuestion.categories}
              items={currentQuestion.items}
              categorizeAssignments={categorizeAssignments}
              onCategorizeAssignmentChange={onCategorizeAssignmentChange}
            />
          )}

        {type === 'fill_blank' && currentQuestion.wordBank && (
          <QuestionFillBlank
            wordBank={currentQuestion.wordBank}
            fillBlankSelected={fillBlankSelected}
            onFillBlankSelect={onFillBlankSelect}
          />
        )}
      </div>
    </div>
  );
};

export default FlipCardQuizModalInteraction;