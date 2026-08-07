// src/pages/AIBusinessAnalyst.tsx
import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useAIBusinessAnalyst } from './hooks/useAIBusinessAnalyst';
import type { AnalysisTypeId } from '../services/aiBusinessAnalystTypes';

const AIBusinessAnalyst: React.FC = () => {
  const {
    query,
    setQuery,
    isAnalyzing,
    messages,
    runAnalysis,
    // clearConversation available in hook if needed later
    clearConversation: _clearConversation,
  } = useAIBusinessAnalyst();

  const convoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    if (convoRef.current) {
      convoRef.current.scrollTop = convoRef.current.scrollHeight;
    }
  }, [messages]);

  const quickPrompts: Array<{ text: string; type: AnalysisTypeId }> = [
    { text: 'Identify the top three growth opportunities for a township retail business', type: 'MARKET_RESEARCH' },
    { text: 'Create a clear user story map for a small vendor onboarding process', type: 'USER_STORY' },
  ];

  const handleQuickPrompt = (text: string) => { setQuery(text); runAnalysis(text); };
  const handleAnalyze = () => runAnalysis();

  return (
    <div className="min-h-screen relative bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-32">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Where should we begin?</h1>
        </div>

        <div ref={convoRef} className="min-h-[60vh]"> 
          {(!messages || messages.length === 0) && (
            <div className="text-gray-500 text-center mt-6">Hi — ask me anything about SeventyTwoX. Try quick suggestions below.</div>
          )}

          <div className="flex flex-col gap-4 mt-6">
            {messages && messages.map((m, i) => (
              <div key={i} className={`max-w-[70%] ${m.role === 'user' ? 'ml-auto bg-blue-50 text-gray-900' : 'mr-auto bg-gray-100 text-gray-900'} p-4 rounded-lg shadow-sm`}>
                <div className="whitespace-pre-wrap text-sm">{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Input bar pinned to bottom */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="max-w-3xl w-full px-6 pointer-events-auto">
          <div className="bg-white border border-gray-200 rounded-full p-3 flex items-center gap-3 shadow-lg">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      runAnalysis();
                    }
                  }}
                  placeholder="Ask anything"
                  className="flex-1 px-4 py-3 rounded-full resize-none h-12 border-none outline-none"
                />
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              className="ml-2 h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {quickPrompts.map((p, idx) => (
                <button key={idx} onClick={() => { setQuery(p.text); runAnalysis(p.text); }} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                  {p.text}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBusinessAnalyst;
