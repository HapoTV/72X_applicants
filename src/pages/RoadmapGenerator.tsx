// src/pages/RoadmapGenerator.tsx
import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { roadmapService } from '../services/RoadmapService';
import type {
  RoadmapGenerationRequest,
  RoadmapFormData,
  UserRoadmapItem
} from '../interfaces/RoadmapData';
import { getUserId } from './roadmapHelpers';
import type { FormData } from './roadmapHelpers';
import RoadmapForm from './components/RoadmapForm';
import SavedRoadmapsList from './components/SavedRoadmapsList';
import RoadmapHistory from './components/RoadmapHistory';

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

  // Load user's roadmaps
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      loadUserRoadmaps();
    }
  }, []);

  const loadUserRoadmaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const roadmaps = await roadmapService.getUserRoadmaps();
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
      await roadmapService.createRoadmap(roadmapData);
      
      setSuccessMessage('Roadmap saved successfully!');
      // Refresh user roadmaps
      loadUserRoadmaps();
      
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
        <Spinner size="xl" color="primary" className="mx-auto mb-4" />
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
      <SavedRoadmapsList userRoadmaps={userRoadmaps} />

      {/* Roadmap History */}
      <RoadmapHistory
        roadmapHistory={roadmapHistory}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onLoadRoadmap={(formData) => {
          setFormData(formData);
          setCurrentStep(3);
        }}
        onDeleteRoadmap={deleteRoadmapFromHistory}
      />

      <RoadmapForm
        currentStep={currentStep}
        formData={formData}
        isGenerating={isGenerating}
        isSaving={isSaving}
        onInputChange={handleInputChange}
        onGoalToggle={handleGoalToggle}
        onStepChange={setCurrentStep}
        onGenerate={generateRoadmap}
        onSave={saveRoadmap}
        onReset={generateNewRoadmap}
      />
    </div>
  );
};

export default RoadmapGenerator;