// src/pages/AIBusinessAnalyst.tsx
import React from 'react';

import {
  Send,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Database,
  Shield,
  Target,
  BarChart,
  Globe,
} from 'lucide-react';
import { useAIBusinessAnalyst } from './hooks/useAIBusinessAnalyst';
import type { AnalysisTypeId } from '../services/aiBusinessAnalystTypes';

const AIBusinessAnalyst: React.FC = () => {
  const {
    query,
    setQuery,
    isAnalyzing,
    analysis,
    analysisType,
    setAnalysisType,
    tokensUsed,
    usageStats,
    error,
    runAnalysis,
  } = useAIBusinessAnalyst();

  const quickPrompts: Array<{ text: string; type: AnalysisTypeId; icon: React.ComponentType<any> }> = [
    {
      text: "Identify the top three growth opportunities for a township retail business",
      type: "MARKET_RESEARCH",
      icon: Globe,
    },
    {
      text: "Create a clear user story map for a small vendor onboarding process",
      type: "USER_STORY",
      icon: Database,
    },
    {
      text: "Outline a SWOT and local risk plan for launching a community services startup",
      type: "SWOT_ANALYSIS",
      icon: TrendingUp,
    },
  ];

  const analysisTypes: Array<{
    id: AnalysisTypeId;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  }> = [
    {
      id: 'REQUIREMENT_ANALYSIS',
      label: 'Requirements',
      icon: Lightbulb,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'USER_STORY',
      label: 'User Stories',
      icon: Database,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'SWOT_ANALYSIS',
      label: 'SWOT',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'MARKET_RESEARCH',
      label: 'Market Research',
      icon: Globe,
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'FINANCIAL_PROJECTION',
      label: 'Financial',
      icon: BarChart,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'RISK_ASSESSMENT',
      label: 'Risk Assessment',
      icon: Shield,
      color: 'from-rose-500 to-rose-600',
    },
  ];

  const handleQuickPrompt = (text: string, type: AnalysisTypeId) => {
    setQuery(text);
    setAnalysisType(type);
  };

  const handleAnalyze = () => {
    runAnalysis();
  };

  const getTypeLabel = (typeId: string) => {
    const type = analysisTypes.find((t) => t.id === typeId);
    return type ? type.label : 'Analysis';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Business Analyst</h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Generate fast business insights, user stories, market analysis, and risk assessments with a simple prompt.
            </p>
          </div>
          {usageStats && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-center min-w-[180px]">
              <div className="text-sm text-gray-500">Tokens used</div>
              <div className="text-2xl font-bold text-gray-900">
                {usageStats.tokensUsed?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {usageStats.tokensRemaining?.toLocaleString() || 30000} remaining
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Select Analysis Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {analysisTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = analysisType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setAnalysisType(type.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isSelected
                    ? `bg-gradient-to-r ${type.color} text-white`
                    : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-1 mx-auto" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Selected: <span className="font-semibold text-blue-600">{getTypeLabel(analysisType)}</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Prompts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {quickPrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text, prompt.type)}
                className="text-left p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {prompt.text}
                    </span>
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {prompt.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Ask the AI Analyst</h2>
        </div>
        <div className="space-y-4">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analysis Type: <span className="font-semibold text-blue-600">{getTypeLabel(analysisType)}</span>
            </label>
          </div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Describe your business scenario for ${getTypeLabel(analysisType).toLowerCase()}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
            rows={4}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="text-sm text-gray-500">
              {usageStats && (
                <>
                  Token usage: <span className="font-medium">{usageStats.percentageUsed?.toFixed(1)}%</span>
                  <span className="mx-2">•</span>
                  Requests today: <span className="font-medium">{usageStats.requestsToday || 0}</span>
                </>
              )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md flex items-center justify-center space-x-2 min-w-[140px]"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
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
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">AI Analysis Results</h2>
            <p className="text-sm text-gray-500 mt-1">
              Generated with {getTypeLabel(analysisType)}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {analysis}
            </div>
          </div>
          {tokensUsed > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {tokensUsed} tokens used
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AIBusinessAnalyst;