import React from 'react';

interface QuestionMatchPairsProps {
  pairs: { term: string; definition: string }[];
  matchSelectedTerm: string | null;
  onMatchTermSelect: (term: string | null) => void;
  matchMapping: Record<string, string>;
  onMatchMappingChange: (mapping: Record<string, string>) => void;
  matchDefinitions: string[];
}

const QuestionMatchPairs: React.FC<QuestionMatchPairsProps> = ({
  pairs,
  matchSelectedTerm,
  onMatchTermSelect,
  matchMapping,
  onMatchMappingChange,
  matchDefinitions,
}) => {
  const terms = pairs.map((p) => p.term);
  const definitions = matchDefinitions;

  // ✅ Prevent duplicate usage of definitions
  const isDefinitionUsed = (definition: string) =>
    Object.values(matchMapping).includes(definition);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* TERMS */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600">Terms</div>

        {terms.map((term) => {
          const isSelected = matchSelectedTerm === term;
          const mapped = matchMapping[term];

          return (
            <button
              key={term}
              onClick={() => onMatchTermSelect(term)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{term}</span>

                {mapped ? (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-1">
                    ✔ Matched
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Select</span>
                )}
              </div>

              {/* ✅ Show what it's matched to */}
              {mapped && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  → {mapped}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* DEFINITIONS */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600">Definitions</div>

        {definitions.map((def) => {
          const used = isDefinitionUsed(def);

          return (
            <button
              key={def}
              onClick={() => {
                if (!matchSelectedTerm || used) return;

                onMatchMappingChange({
                  ...matchMapping,
                  [matchSelectedTerm]: def,
                });

                onMatchTermSelect(null);
              }}
              disabled={!matchSelectedTerm || used}
              className={`w-full text-left p-3 rounded-xl border transition ${
                used
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : matchSelectedTerm
                  ? 'border-gray-200 hover:bg-gray-50'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-sm">{def}</span>
            </button>
          );
        })}

        {/* RESET */}
        <button
          onClick={() => {
            onMatchTermSelect(null);
            onMatchMappingChange({});
          }}
          className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset Matches
        </button>
      </div>
    </div>
  );
};

export default QuestionMatchPairs;