// src/pages/RoadmapGenerator.tsx
import React, { useState, useEffect } from 'react';
import { Map, ArrowRight, CheckCircle, Clock, Download, FileText, Trash2, Loader2 } from 'lucide-react';
import { roadmapService } from '../services/RoadmapService';
import type { 
  RoadmapGenerationRequest,
  RoadmapFormData,
  UserRoadmapItem 
} from '../interfaces/RoadmapData';

interface FormData {
  businessType: string;
  industry: string;
  stage: string;
  revenue: string;
  employees: string;
  goals: string[];
  timeline: string;
}

interface SavedRoadmap {
  id: string;
  title: string;
  formData: FormData;
  createdAt: string;
  isExpanded?: boolean;
}

const RoadmapGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    industry: '',
    stage: '',
    revenue: '',
    employees: '',
    goals: [],
    timeline: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [roadmapHistory, setRoadmapHistory] = useState<SavedRoadmap[]>([]);
  const [userRoadmaps, setUserRoadmaps] = useState<UserRoadmapItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const businessTypes = [
    'Retail', 'Food & Beverage', 'Hospitality', 'Beauty & Wellness', 'Healthcare',
    'Service-Based', 'Transportation & Logistics', 'Agriculture', 'Manufacturing & Production',
    'Event & Rental Services', 'Automotive Services', 'Technology & Repair',
    'Corporate & Professional Services', 'Community & Public Sector', 'Other'
  ];

  const industries = [
    'Fast Food/Confectioners', 'Street Vendor/Spaza Shop', 'Farming', 'Hair Salon and Nail Salon',
    'Catering services', 'Butcher/Meat Cutter', 'NPOs & NGOs', 'Marketing & advertising',
    'Tent renters, Mobile Toilet and Fridge', 'Car washes', 'Phone Sellers/Repairers',
    'Craft and handmade goods', 'Internet cafés', 'Mechanic and Tyre Services', 'Grass Cutter', 'Other'
  ];

  const stages = [
    { id: 'startup', name: 'Startup (0-2 years)', desc: 'Just getting started' },
    { id: 'growth', name: 'Growth Stage (2-5 years)', desc: 'Scaling operations' },
    { id: 'established', name: 'Established (5+ years)', desc: 'Optimizing & expanding' }
  ];

  const goals = [
    'Increase Revenue', 'Expand Market Reach', 'Improve Operations', 
    'Build Team', 'Secure Funding', 'Digital Transformation',
    'Customer Retention', 'Cost Reduction'
  ];

  // Get user ID from localStorage
  const getUserId = (): string | null => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.userId || userData.id || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Load user's roadmaps
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      loadUserRoadmaps(userId);
    }
  }, []);

  const loadUserRoadmaps = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const roadmaps = await roadmapService.getUserRoadmaps(userId);
      setUserRoadmaps(roadmaps);
    } catch (err: any) {
      setError(err.message || 'Failed to load your roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const generateRoadmap = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('Please login to generate a roadmap');
      return;
    }

    // Validate form data
    if (!formData.businessType || !formData.industry || !formData.stage || formData.goals.length === 0 || !formData.timeline) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const generationRequest: RoadmapGenerationRequest = {
        businessType: formData.businessType,
        industry: formData.industry,
        stage: formData.stage,
        revenue: formData.revenue,
        employees: formData.employees,
        goals: formData.goals,
        timeline: formData.timeline,
        createdBy: userId
      };

      // Generate roadmap using backend
      await roadmapService.generateRoadmap(generationRequest);
      
      // Save to local history
      const newRoadmap: SavedRoadmap = {
        id: Date.now().toString(),
        title: `Roadmap for ${formData.businessType}`,
        formData: { ...formData },
        createdAt: new Date().toISOString(),
        isExpanded: false
      };
      
      setRoadmapHistory(prev => [newRoadmap, ...prev]);
      setSuccessMessage('Roadmap generated successfully! You can now save it.');
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRoadmap = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('Please login to save roadmap');
      return;
    }

    const title = prompt('Enter a name for your roadmap:', `My ${formData.businessType} Roadmap`);
    if (!title) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const roadmapData: RoadmapFormData = {
        title: title,
        businessType: formData.businessType,
        industry: formData.industry,
        stage: formData.stage,
        revenue: formData.revenue,
        employees: formData.employees,
        goals: formData.goals,
        timeline: formData.timeline,
        isPublic: false,
        isTemplate: false
      };

      // Save to backend
      await roadmapService.createRoadmap(roadmapData, userId);
      
      setSuccessMessage('Roadmap saved successfully!');
      // Refresh user roadmaps
      loadUserRoadmaps(userId);
      
    } catch (err: any) {
      setError(err.message || 'Failed to save roadmap');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRoadmapFromHistory = (roadmapId: string) => {
    setRoadmapHistory(prev => prev.filter(r => r.id !== roadmapId));
  };

  const generateNewRoadmap = () => {
    setCurrentStep(1);
    setFormData({
      businessType: '',
      industry: '',
      stage: '',
      revenue: '',
      employees: '',
      goals: [],
      timeline: ''
    });
    setError(null);
    setSuccessMessage(null);
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceleration Roadmap Generator</h1>
        <p className="text-gray-600">Get a personalized roadmap to accelerate your business growth</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="text-red-600">⚠️</div>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="text-green-600">✓</div>
            <span className="text-green-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* User's Saved Roadmaps */}
      {userRoadmaps.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Saved Roadmaps</h2>
            <div className="text-sm text-gray-600">{userRoadmaps.length} roadmaps</div>
          </div>
          
          <div className="space-y-3">
            {userRoadmaps.slice(0, 3).map((roadmap) => (
              <div key={roadmap.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{roadmap.title}</h3>
                      <p className="text-sm text-gray-600">
                        {roadmap.businessType} • {roadmap.stage} • {roadmapService.formatDate(roadmap.createdAt || '')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${roadmapService.getStatusColor(roadmap.status)}`}>
                      {roadmap.status}
                    </span>
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {roadmap.progress}% Complete
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {userRoadmaps.length > 3 && (
              <div className="text-center pt-2">
                <button 
                  onClick={() => window.location.href = '/roadmaps'}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all {userRoadmaps.length} roadmaps →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roadmap History */}
      {roadmapHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Generated</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showHistory ? 'Hide' : 'Show'} ({roadmapHistory.length})
            </button>
          </div>
          
          {showHistory && (
            <div className="space-y-3">
              {roadmapHistory.map((savedRoadmap) => (
                <div key={savedRoadmap.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{savedRoadmap.title}</h3>
                        <p className="text-sm text-gray-600">
                          {roadmapService.formatDate(savedRoadmap.createdAt)} • 
                          {savedRoadmap.formData.businessType} • {savedRoadmap.formData.stage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setFormData(savedRoadmap.formData);
                          setCurrentStep(3);
                        }}
                        className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        Reuse
                      </button>
                      <button
                        onClick={() => deleteRoadmapFromHistory(savedRoadmap.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
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
                  onChange={(e) => handleInputChange('industry', e.target.value)}
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
                      onChange={(e) => handleInputChange('stage', e.target.value)}
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
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
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
                  onChange={(e) => handleInputChange('employees', e.target.value)}
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
                      onChange={() => handleGoalToggle(goal)}
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
                onChange={(e) => handleInputChange('timeline', e.target.value)}
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
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={generateNewRoadmap}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={generateRoadmap}
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
                onClick={saveRoadmap}
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
                    <FileText className="w-4 h-4" />
                    <span>Save Roadmap</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;