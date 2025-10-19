import React, { useState } from 'react';
import { Brain, Send, Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

const AIBusinessAnalyst: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis(`Based on your query: "${query}", here's my analysis:\n\n• Market trends indicate strong growth potential\n• Consider diversifying your revenue streams\n• Focus on customer retention strategies\n• Optimize operational efficiency`);
      setIsAnalyzing(false);
    }, 2000);
  };

  const quickPrompts = [
    "Analyze my business performance",
    "What are growth opportunities?",
    "How can I improve cash flow?",
    "Market expansion strategies"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-8 h-8" />
          <h1 className="text-2xl font-bold">AI Business Analyst</h1>
        </div>
        <p className="text-primary-100">
          Get intelligent insights and recommendations powered by AI to grow your business
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Prompts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setQuery(prompt)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <span className="text-sm text-gray-700">{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-900">Ask the AI Analyst</h2>
        </div>
        <div className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about your business... (e.g., How can I increase my revenue? What are the best marketing strategies for my industry?)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
          />
          <button
            onClick={handleAnalyze}
            disabled={!query.trim() || isAnalyzing}
            className="w-full md:w-auto px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">AI Analysis Results</h2>
          </div>
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line text-gray-700">
              {analysis}
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How it works</h3>
            <p className="text-sm text-blue-700">
              Our AI Business Analyst uses advanced algorithms to analyze your business data and provide 
              personalized recommendations. Ask questions about strategy, operations, marketing, or finances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBusinessAnalyst;
