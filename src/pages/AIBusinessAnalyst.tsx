// src/pages/AIBusinessAnalyst.tsx
import React from 'react';

import {
  Brain,
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
import type { AnalysisTypeId } from './hooks/useAIBusinessAnalyst';

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
      text: "Analyze requirements for a mobile banking app",
      type: "REQUIREMENT_ANALYSIS",
      icon: Lightbulb,
    },
    {
      text: "Generate user stories for an e-commerce checkout",
      type: "USER_STORY",
      icon: Database,
    },
    {
      text: "SWOT analysis for a food delivery startup",
      type: "SWOT_ANALYSIS",
      icon: TrendingUp,
    },
    {
      text: "Market research for fitness tech products",
      type: "MARKET_RESEARCH",
      icon: Globe,
    },
    {
      text: "Financial projections for SaaS business",
      type: "FINANCIAL_PROJECTION",
      icon: BarChart,
    },
    {
      text: "Risk assessment for cloud migration",
      type: "RISK_ASSESSMENT",
      icon: Shield,
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
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Brain className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">AI Business Analyst</h1>
              <p className="text-blue-100 mt-1">
                Powered by Google Flan-T5-Base • Spring Boot Backend
              </p>
            </div>
          </div>
          {usageStats && (
            <div className="text-right bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <div className="text-2xl font-bold">
                {usageStats.tokensUsed?.toLocaleString() || 0}
              </div>
              <div className="text-sm opacity-90">tokens used</div>
              <div className="text-xs mt-1">
                {usageStats.tokensRemaining?.toLocaleString() || 30000} remaining
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 text-blue-100 text-sm">
          Get intelligent business insights powered by AI. 30,000 free tokens/month.
        </div>
      </div>

      {/* Analysis Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Analysis Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {analysisTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = analysisType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setAnalysisType(type.id)}
                className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                  isSelected
                    ? `bg-gradient-to-r ${type.color} text-white shadow-md`
                    : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-2 mx-auto" />
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Quick Prompts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.text, prompt.type)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all hover:bg-blue-50 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Analysis Results</h2>
                <p className="text-sm text-gray-500">
                  Generated with {getTypeLabel(analysisType)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {getTypeLabel(analysisType)}
              </span>
              {tokensUsed > 0 && (
                <span className="text-sm text-gray-500">
                  {tokensUsed} tokens
                </span>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-6 border border-gray-200">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed font-medium">
              {analysis}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Generated by Flan-T5-Base AI Model</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Spring Boot Backend</span>
              <span>•</span>
              <span>Hugging Face API</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2 text-lg">How It Works</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Backend Technology</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Spring Boot REST API</li>
                  <li>Google Flan-T5-Base AI Model</li>
                  <li>Hugging Face Inference API</li>
                  <li>30,000 free tokens/month</li>
                </ul>
              </div>
              <div className="text-sm text-blue-800">
                <div className="font-semibold mb-1">Capabilities</div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Business requirement analysis</li>
                  <li>User story generation</li>
                  <li>SWOT & market analysis</li>
                  <li>Financial projections</li>
                  <li>Risk assessment</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 text-xs text-blue-600 bg-white/50 rounded-lg p-3">
              <strong>Note:</strong> The AI uses your Hugging Face API key (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). 
              Token usage is tracked automatically. Reset occurs monthly.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AIBusinessAnalyst;