import React from 'react';
import { ArrowRight, CheckCircle, Map, Loader2 } from 'lucide-react';
import { businessTypes, industries, stages, goals } from '../roadmapHelpers';
import type { FormData } from '../roadmapHelpers';

interface RoadmapFormProps {
  currentStep: number;
  formData: FormData;
  isGenerating: boolean;
  isSaving: boolean;
  onInputChange: (field: keyof FormData, value: any) => void;
  onGoalToggle: (goal: string) => void;
  onStepChange: (step: number) => void;
  onGenerate: () => void;
  onSave: () => void;
  onReset: () => void;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({
  currentStep,
  formData,
  isGenerating,
  isSaving,
  onInputChange,
  onGoalToggle,
  onStepChange,
  onGenerate,
  onSave,
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-primary-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Business Basics */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Tell us about your business</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => onInputChange('businessType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => onInputChange('industry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Business Stage *
            </label>
            <div className="space-y-3">
              {stages.map(stage => (
                <label key={stage.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="stage"
                    value={stage.id}
                    checked={formData.stage === stage.id}
                    onChange={(e) => onInputChange('stage', e.target.value)}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    required
                  />
                  <div>
                    <div className="font-medium text-gray-900">{stage.name}</div>
                    <div className="text-sm text-gray-600">{stage.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Current Metrics */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Current business metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue Range
              </label>
              <select
                value={formData.revenue}
                onChange={(e) => onInputChange('revenue', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">Select revenue range</option>
                <option value="0-50k">R0 - R50,000</option>
                <option value="50k-100k">R50,000 - R100,000</option>
                <option value="100k-500k">R100,000 - R500,000</option>
                <option value="500k-1m">R500,000 - R1,000,000</option>
                <option value="1m+">R1,000,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees
              </label>
              <select
                value={formData.employees}
                onChange={(e) => onInputChange('employees', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="">Select team size</option>
                <option value="1">Just me (solopreneur)</option>
                <option value="2-5">2-5 employees</option>
                <option value="6-20">6-20 employees</option>
                <option value="21-50">21-50 employees</option>
                <option value="50+">50+ employees</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Goals & Timeline */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Your growth goals *</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your primary goals (choose at least 1)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {goals.map(goal => (
                <label key={goal} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.goals.includes(goal)}
                    onChange={() => onGoalToggle(goal)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline for achieving goals *
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => onInputChange('timeline', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            >
              <option value="">Select timeline</option>
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="2years">2+ years</option>
            </select>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => onStepChange(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentStep < 3 ? (
          <button
            onClick={() => onStepChange(currentStep + 1)}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={onReset}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button
              onClick={onGenerate}
              disabled={isGenerating || formData.goals.length === 0}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Map className="w-4 h-4" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Roadmap</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapForm;
