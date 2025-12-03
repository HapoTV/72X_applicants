import React, { useState } from 'react';
import { Map, ArrowRight, CheckCircle, Clock, Download, FileText, Trash2 } from 'lucide-react';
import { roadmapService } from '../services/RoadmapService';

const RoadmapGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  interface FormData {
    businessType: string;
    industry: string;
    stage: string;
    revenue: string;
    employees: string;
    goals: string[];
    timeline: string;
  }

  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    industry: '',
    stage: '',
    revenue: '',
    employees: '',
    goals: [],
    timeline: ''
  });
  
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapHistory, setRoadmapHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  interface SavedRoadmap {
    id: string;
    title: string;
    formData: FormData;
    roadmap: any;
    createdAt: string;
    isExpanded?: boolean;
  }

  const businessTypes = [
    'Retail',
    'Food & Beverage',
    'Hospitality',
    'Beauty & Wellness',
    'Healthcare',
    'Service-Based',
    'Transportation & Logistics',
    'Agriculture',
    'Manufacturing & Production',
    'Event & Rental Services',
    'Automotive Services',
    'Technology & Repair',
    'Corporate & Professional Services',
    'Community & Public Sector',
    'Other'
  ];

  const industries = [
    'Fast Food/Confectioners',
    'Street Vendor/Spaza Shop',
    'Farming',
    'Hair Salon and Nail Salon',
    'Catering services',
    'Butcher/Meat Cutter',
    'NPOs & NGOs',
    'Marketing & advertising',
    'Tent renters, Mobile Toilet and Fridge',
    'Car washes',
    'Phone Sellers/Repairers',
    'Craft and handmade goods',
    'Internet cafés',
    'Mechanic and Tyre Services',
    'Grass Cutter',
    'Other'
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

  const handleInputChange = (field: string, value: any) => {
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
    setIsGenerating(true);
    
    try {
      // Create roadmap request from form data
      const roadmapRequest = {
        businessType: formData.businessType,
        industry: formData.industry,
        stage: formData.stage,
        revenue: formData.revenue,
        employees: formData.employees,
        goals: formData.goals,
        timeline: formData.timeline,
        createdBy: 'current-user' // This would come from auth context
      };

      // Generate roadmap using the service
      const generated = await roadmapService.generateRoadmap(roadmapRequest);
      
      // Save to history
      const newRoadmap: SavedRoadmap = {
        id: Date.now().toString(),
        title: `Roadmap ${roadmapHistory.length + 1}`,
        formData: { ...formData },
        roadmap: generated,
        createdAt: new Date().toISOString(),
        isExpanded: false
      };
      
      setRoadmapHistory(prev => [...prev, newRoadmap]);
      setGeneratedRoadmap(generated);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      // Fallback to mock data if service fails
      const fallbackRoadmap = generateMockRoadmap();
      
      // Save fallback to history
      const newRoadmap: SavedRoadmap = {
        id: Date.now().toString(),
        title: `Roadmap ${roadmapHistory.length + 1}`,
        formData: { ...formData },
        roadmap: fallbackRoadmap,
        createdAt: new Date().toISOString(),
        isExpanded: false
      };
      
      setRoadmapHistory(prev => [...prev, newRoadmap]);
      setGeneratedRoadmap(fallbackRoadmap);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockRoadmap = () => {
    // Generate dynamic mock roadmap based on user data
    const stage = formData.stage;
    const goals = formData.goals;
    const timeline = formData.timeline;
    
    let phase1Title = 'Foundation & Quick Wins';
    let phase2Title = 'Growth Acceleration';
    let phase3Title = 'Scale & Optimize';
    let phase1Duration = '0-3 months';
    let phase2Duration = '3-6 months';
    let phase3Duration = '6-12 months';
    
    // Adjust phases based on business stage
    if (stage === 'startup') {
      phase1Title = 'Foundation Setup';
      phase2Title = 'Initial Growth';
      phase3Title = 'Scaling Preparation';
    } else if (stage === 'established') {
      phase1Title = 'Optimization Quick Wins';
      phase2Title = 'Expansion & Innovation';
      phase3Title = 'Market Leadership';
    }

    // Adjust phase durations based on timeline
    if (timeline === '3months') {
      phase1Duration = '0-1 month';
      phase2Duration = '1-2 months';
      phase3Duration = '2-3 months';
    } else if (timeline === '6months') {
      phase1Duration = '0-2 months';
      phase2Duration = '2-4 months';
      phase3Duration = '4-6 months';
    } else if (timeline === '2years') {
      phase1Duration = '0-6 months';
      phase2Duration = '6-12 months';
      phase3Duration = '12-24 months';
    }

    // Generate tasks based on user goals
    const generateTasks = (phase: number) => {
      const tasks = [];
      
      // Base tasks for all phases
      if (phase === 1) {
        tasks.push({ task: 'Optimize your online presence', priority: 'High', duration: '2 weeks' });
        tasks.push({ task: 'Implement basic analytics tracking', priority: 'High', duration: '1 week' });
        
        if (goals.includes('Increase Revenue')) {
          tasks.push({ task: 'Develop revenue optimization strategy', priority: 'High', duration: '3 weeks' });
        }
        if (goals.includes('Customer Retention')) {
          tasks.push({ task: 'Create customer feedback system', priority: 'Medium', duration: '2 weeks' });
        }
        if (goals.includes('Improve Operations')) {
          tasks.push({ task: 'Streamline core operations', priority: 'High', duration: '4 weeks' });
        }
      } else if (phase === 2) {
        tasks.push({ task: 'Launch targeted marketing campaigns', priority: 'High', duration: '6 weeks' });
        
        if (goals.includes('Expand Market Reach')) {
          tasks.push({ task: 'Expand to new market segments', priority: 'High', duration: '8 weeks' });
        }
        if (goals.includes('Build Team')) {
          tasks.push({ task: 'Build strategic partnerships', priority: 'Medium', duration: '4 weeks' });
        }
        if (goals.includes('Digital Transformation')) {
          tasks.push({ task: 'Implement automation tools', priority: 'High', duration: '3 weeks' });
        }
      } else if (phase === 3) {
        if (goals.includes('Secure Funding')) {
          tasks.push({ task: 'Explore funding opportunities', priority: 'Low', duration: '6 weeks' });
        }
        if (goals.includes('Expand Market Reach')) {
          tasks.push({ task: 'Enter new geographic markets', priority: 'High', duration: '12 weeks' });
        }
        if (goals.includes('Build Team')) {
          tasks.push({ task: 'Build advanced team structure', priority: 'Medium', duration: '8 weeks' });
        }
        tasks.push({ task: 'Implement advanced analytics', priority: 'Medium', duration: '4 weeks' });
      }
      
      return tasks;
    };

    return {
      phase1: {
        title: `${phase1Title} (${phase1Duration})`,
        tasks: generateTasks(1)
      },
      phase2: {
        title: `${phase2Title} (${phase2Duration})`,
        tasks: generateTasks(2)
      },
      phase3: {
        title: `${phase3Title} (${phase3Duration})`,
        tasks: generateTasks(3)
      }
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Export roadmap as PDF
  const exportToPDF = async (roadmap: any, title: string) => {
    try {
      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
              .task { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #007bff; }
              .priority-high { border-left-color: #dc3545; }
              .priority-medium { border-left-color: #ffc107; }
              .priority-low { border-left-color: #28a745; }
              .duration { color: #666; font-size: 0.9em; }
              .generated-date { text-align: center; color: #999; margin-top: 30px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            ${Object.entries(roadmap).map(([, phase]: [string, any]) => `
              <h2>${phase.title}</h2>
              ${phase.tasks.map((task: any, index: number) => `
                <div class="task priority-${task.priority.toLowerCase()}">
                  <strong>${index + 1}. ${task.task}</strong>
                  <div class="duration">⏱️ ${task.duration} | Priority: ${task.priority}</div>
                </div>
              `).join('')}
            `).join('')}
            <div class="generated-date">Generated on ${new Date().toLocaleDateString()}</div>
          </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting roadmap:', error);
      alert('Failed to export roadmap. Please try again.');
    }
  };

  // Load roadmap from history
  const loadRoadmapFromHistory = (savedRoadmap: SavedRoadmap) => {
    setGeneratedRoadmap(savedRoadmap.roadmap);
    setShowHistory(false);
  };

  // Delete roadmap from history
  const deleteRoadmapFromHistory = (roadmapId: string) => {
    setRoadmapHistory(prev => prev.filter(r => r.id !== roadmapId));
  };

  // Toggle roadmap expansion in history
  const toggleRoadmapExpansion = (roadmapId: string) => {
    setRoadmapHistory(prev => prev.map(r => 
      r.id === roadmapId ? { ...r, isExpanded: !r.isExpanded } : r
    ));
  };

  // Generate new roadmap
  const generateNewRoadmap = () => {
    setGeneratedRoadmap(null);
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
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceleration Roadmap Generator</h1>
        <p className="text-gray-600">Get a personalized roadmap to accelerate your business growth</p>
      </div>

      {/* Roadmap History */}
      {roadmapHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Previous Roadmaps</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {showHistory ? 'Hide' : 'Show'} History ({roadmapHistory.length})
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
                          Generated on {new Date(savedRoadmap.createdAt).toLocaleDateString()} • 
                          {savedRoadmap.formData.businessType} • {savedRoadmap.formData.stage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => loadRoadmapFromHistory(savedRoadmap)}
                        className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => exportToPDF(savedRoadmap.roadmap, savedRoadmap.title)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>
                      <button
                        onClick={() => deleteRoadmapFromHistory(savedRoadmap.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => toggleRoadmapExpansion(savedRoadmap.id)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        {savedRoadmap.isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                  </div>
                  
                  {savedRoadmap.isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {Object.entries(savedRoadmap.roadmap).map(([key, phase]: [string, any]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-medium text-gray-900 text-sm mb-2">{phase.title}</h4>
                            <div className="space-y-2">
                              {phase.tasks.slice(0, 2).map((task: any, index: number) => (
                                <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                                  <div className="font-medium text-gray-700">{task.task}</div>
                                  <div className="text-gray-500">{task.duration} • {task.priority}</div>
                                </div>
                              ))}
                              {phase.tasks.length > 2 && (
                                <div className="text-xs text-gray-500 text-center">+{phase.tasks.length - 2} more tasks</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!generatedRoadmap ? (
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
                    Business Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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
                  Business Stage
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
              <h3 className="text-lg font-semibold text-gray-900">Your growth goals</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your primary goals (choose up to 4)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {goals.map(goal => (
                    <label key={goal} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal)}
                        onChange={() => handleGoalToggle(goal)}
                        disabled={formData.goals.length >= 4 && !formData.goals.includes(goal)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline for achieving goals
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
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
              <button
                onClick={generateRoadmap}
                disabled={isGenerating}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Map className="w-4 h-4" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Generated Roadmap */
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Personalized Growth Roadmap</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportToPDF(generatedRoadmap, 'Your Personalized Growth Roadmap')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={generateNewRoadmap}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Generate New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(generatedRoadmap).map(([key, phase]: [string, any]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">{phase.title}</h3>
                  <div className="space-y-3">
                    {phase.tasks.map((task: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
