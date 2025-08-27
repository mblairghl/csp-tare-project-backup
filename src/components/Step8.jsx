import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, TestTube, BarChart, Target, Plus, Sparkles, X, Edit, Trash2, Zap, TrendingUp, Activity } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step8 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Tab management
  const [activeSubStep, setActiveSubStep] = useState(1);

  // Step completion tracking
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

  // Conversion optimization data
  const [abTestingStrategy, setAbTestingStrategy] = useState({
    testingGoals: '',
    testingMethods: '',
    testingTools: '',
    testingSchedule: ''
  });

  const [conversionTracking, setConversionTracking] = useState({
    trackingSetup: '',
    conversionEvents: '',
    analyticsIntegration: '',
    reportingDashboard: ''
  });

  const [optimizationPlan, setOptimizationPlan] = useState({
    optimizationAreas: '',
    actionPlan: '',
    implementationTimeline: '',
    successMetrics: ''
  });

  // Added optimization items list
  const [addedOptimizationItems, setAddedOptimizationItems] = useState([]);

  // Manual form data
  const [manualForm, setManualForm] = useState({
    type: '',
    title: '',
    description: '',
    details: ''
  });

  // AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved data
  useEffect(() => {
    const savedAbTesting = storageOptimizer.safeGet('step8_ab_testing_strategy');
    const savedTracking = storageOptimizer.safeGet('step8_conversion_tracking');
    const savedOptimization = storageOptimizer.safeGet('step8_optimization_plan');
    const savedItems = storageOptimizer.safeGet('step8_added_optimization_items');
    
    if (savedAbTesting && typeof savedAbTesting === 'object') {
      setAbTestingStrategy(savedAbTesting);
    }
    if (savedTracking && typeof savedTracking === 'object') {
      setConversionTracking(savedTracking);
    }
    if (savedOptimization && typeof savedOptimization === 'object') {
      setOptimizationPlan(savedOptimization);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedOptimizationItems(savedItems);
    }
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const abTestingComplete = Object.values(abTestingStrategy).every(value => value && value.trim().length > 0);
    const trackingComplete = Object.values(conversionTracking).every(value => value && value.trim().length > 0);
    const optimizationComplete = Object.values(optimizationPlan).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = abTestingComplete && trackingComplete && optimizationComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [abTestingStrategy, conversionTracking, optimizationPlan, isStepComplete]);

  // Auto-progression logic for sub-steps
  useEffect(() => {
    const hasAbTestingStrategy = Object.values(abTestingStrategy).every(value => value && value.trim().length > 0);
    const hasConversionTracking = Object.values(conversionTracking).every(value => value && value.trim().length > 0);
    const hasOptimizationPlan = Object.values(optimizationPlan).every(value => value && value.trim().length > 0);
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasAbTestingStrategy) {
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasConversionTracking) {
      setTimeout(() => setActiveSubStep(3), 500);
    } else if (activeSubStep === 3 && hasOptimizationPlan) {
      setTimeout(() => setActiveSubStep(4), 500);
    }
  }, [abTestingStrategy, conversionTracking, optimizationPlan, activeSubStep]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleAbTestingChange = (field, value) => {
    const updated = { ...abTestingStrategy, [field]: value };
    setAbTestingStrategy(updated);
    storageOptimizer.safeSet('step8_ab_testing_strategy', updated);
  };

  const handleTrackingChange = (field, value) => {
    const updated = { ...conversionTracking, [field]: value };
    setConversionTracking(updated);
    storageOptimizer.safeSet('step8_conversion_tracking', updated);
  };

  const handleOptimizationChange = (field, value) => {
    const updated = { ...optimizationPlan, [field]: value };
    setOptimizationPlan(updated);
    storageOptimizer.safeSet('step8_optimization_plan', updated);
  };

  // Manual entry functions
  const openManualModal = (type) => {
    setCurrentModalType(type);
    setManualForm({
      type: type,
      title: '',
      description: '',
      details: ''
    });
    setManualModalOpen(true);
  };

  const handleManualSubmit = () => {
    if (manualForm.title && manualForm.description) {
      const newItem = {
        id: Date.now(),
        type: manualForm.type,
        title: manualForm.title,
        description: manualForm.description,
        details: manualForm.details,
        source: 'manual'
      };
      
      const updated = [...addedOptimizationItems, newItem];
      setAddedOptimizationItems(updated);
      storageOptimizer.safeSet('step8_added_optimization_items', updated);
      setManualModalOpen(false);
    }
  };

  // AI suggestions functions
  const openAiSuggestionsModal = async (type) => {
    setCurrentModalType(type);
    setAiSuggestionsModalOpen(true);
    
    // Generate AI suggestions based on type
    const suggestions = generateAiSuggestions(type);
    setAiSuggestions(suggestions);
  };

  const generateAiSuggestions = (type) => {
    const suggestionsByType = {
      'A/B Testing Strategy': [
        { id: 1, title: 'Landing Page A/B Tests', description: 'Test different landing page elements for better conversion', details: 'Headlines, CTAs, images, forms, value propositions, and page layouts' },
        { id: 2, title: 'Email Campaign Testing', description: 'Optimize email marketing performance', details: 'Subject lines, send times, content formats, personalization, and call-to-actions' },
        { id: 3, title: 'Sales Funnel Optimization', description: 'Test different funnel steps and flows', details: 'Funnel length, step order, form fields, pricing presentation, and checkout process' },
        { id: 4, title: 'Content Performance Tests', description: 'Test different content formats and messaging', details: 'Blog post formats, video vs text, content length, and messaging angles' },
        { id: 5, title: 'Pricing Strategy Tests', description: 'Test different pricing models and presentations', details: 'Price points, payment plans, bundling options, and pricing page layouts' }
      ],
      'Conversion Tracking Setup': [
        { id: 1, title: 'Google Analytics 4 Setup', description: 'Comprehensive GA4 tracking implementation', details: 'Enhanced ecommerce, custom events, conversion goals, and attribution modeling' },
        { id: 2, title: 'Facebook Pixel Integration', description: 'Track social media campaign performance', details: 'Pixel installation, custom conversions, audience building, and campaign optimization' },
        { id: 3, title: 'CRM Conversion Tracking', description: 'Track leads through your sales pipeline', details: 'Lead scoring, pipeline stages, conversion rates, and sales attribution' },
        { id: 4, title: 'Email Marketing Analytics', description: 'Track email campaign effectiveness', details: 'Open rates, click rates, conversion tracking, and subscriber behavior analysis' },
        { id: 5, title: 'Heat Map and User Behavior', description: 'Understand how users interact with your site', details: 'Click tracking, scroll maps, session recordings, and user journey analysis' }
      ],
      'Optimization Action Plan': [
        { id: 1, title: 'Conversion Rate Optimization', description: 'Systematic approach to improving conversions', details: 'Landing page optimization, form optimization, checkout improvements, and UX enhancements' },
        { id: 2, title: 'Lead Quality Improvement', description: 'Attract and convert higher-quality leads', details: 'Lead scoring refinement, qualification processes, and targeting optimization' },
        { id: 3, title: 'Customer Journey Optimization', description: 'Improve the entire customer experience', details: 'Touchpoint optimization, friction reduction, personalization, and retention strategies' },
        { id: 4, title: 'Content Performance Enhancement', description: 'Optimize content for better engagement and conversion', details: 'Content audits, performance analysis, SEO optimization, and content strategy refinement' },
        { id: 5, title: 'Sales Process Optimization', description: 'Streamline and improve sales effectiveness', details: 'Sales script optimization, objection handling, follow-up sequences, and closing techniques' }
      ]
    };
    
    return suggestionsByType[type] || [];
  };

  const addAiSuggestion = (suggestion) => {
    const newItem = {
      id: Date.now(),
      type: currentModalType,
      title: suggestion.title,
      description: suggestion.description,
      details: suggestion.details,
      source: 'ai'
    };
    
    const updated = [...addedOptimizationItems, newItem];
    setAddedOptimizationItems(updated);
    storageOptimizer.safeSet('step8_added_optimization_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // Edit/Delete functions
  const editOptimizationItem = (id) => {
    const item = addedOptimizationItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteOptimizationItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteOptimizationItem = (id) => {
    const updated = addedOptimizationItems.filter(i => i.id !== id);
    setAddedOptimizationItems(updated);
    storageOptimizer.safeSet('step8_added_optimization_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateConversionOptimization();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating conversion optimization:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setAbTestingStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_ab_testing_strategy', { ...abTestingStrategy, ...content });
    } else if (activeSubStep === 2) {
      setConversionTracking(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_conversion_tracking', { ...conversionTracking, ...content });
    } else if (activeSubStep === 3) {
      setOptimizationPlan(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_optimization_plan', { ...optimizationPlan, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Systematically test and optimize every aspect of your customer journey to maximize conversions and improve business performance.",
    steps: [
      { title: 'A/B Testing Strategy', description: 'Plan and execute systematic tests to improve performance.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Conversion Tracking Setup', description: 'Implement comprehensive tracking to measure results.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Optimization Action Plan', description: 'Create actionable plans based on data insights.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasAbTestingStrategy = Object.values(abTestingStrategy).every(value => value && value.trim().length > 0);
  const hasConversionTracking = Object.values(conversionTracking).every(value => value && value.trim().length > 0);
  const hasOptimizationPlan = Object.values(optimizationPlan).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasAbTestingStrategy; // Unlocked when A/B testing strategy complete
      case 3: return hasAbTestingStrategy && hasConversionTracking; // Unlocked when first two complete
      case 4: return hasAbTestingStrategy && hasConversionTracking && hasOptimizationPlan; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'A/B Testing Strategy', icon: TestTube },
    { id: 2, title: 'Conversion Tracking Setup', icon: BarChart },
    { id: 3, title: 'Optimization Action Plan', icon: Target },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">A/B Testing Strategy</h3>
              <p className="text-gray-600 mb-6">
                Plan and execute systematic tests to improve performance across your marketing and sales funnel.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing Goals
                  </label>
                  <textarea
                    value={abTestingStrategy.testingGoals}
                    onChange={(e) => handleAbTestingChange('testingGoals', e.target.value)}
                    placeholder="What specific goals do you want to achieve with A/B testing? Increase conversions, improve engagement, reduce bounce rate..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing Methods
                  </label>
                  <textarea
                    value={abTestingStrategy.testingMethods}
                    onChange={(e) => handleAbTestingChange('testingMethods', e.target.value)}
                    placeholder="What testing methods will you use? Split testing, multivariate testing, sequential testing..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing Tools
                  </label>
                  <textarea
                    value={abTestingStrategy.testingTools}
                    onChange={(e) => handleAbTestingChange('testingTools', e.target.value)}
                    placeholder="What tools will you use for testing? Google Optimize, Optimizely, VWO, Unbounce..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testing Schedule
                  </label>
                  <textarea
                    value={abTestingStrategy.testingSchedule}
                    onChange={(e) => handleAbTestingChange('testingSchedule', e.target.value)}
                    placeholder="How often will you run tests? Weekly, monthly, quarterly testing schedule and priorities..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('A/B Testing Strategy')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('A/B Testing Strategy')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added A/B Testing Strategy Items */}
                {addedOptimizationItems.filter(i => i.type === 'A/B Testing Strategy').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasAbTestingStrategy && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">A/B Testing Strategy Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to conversion tracking setup.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversion Tracking Setup</h3>
              <p className="text-gray-600 mb-6">
                Implement comprehensive tracking systems to measure and analyze conversion performance across all channels.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Setup
                  </label>
                  <textarea
                    value={conversionTracking.trackingSetup}
                    onChange={(e) => handleTrackingChange('trackingSetup', e.target.value)}
                    placeholder="What tracking systems will you implement? Google Analytics, Facebook Pixel, CRM tracking..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversion Events
                  </label>
                  <textarea
                    value={conversionTracking.conversionEvents}
                    onChange={(e) => handleTrackingChange('conversionEvents', e.target.value)}
                    placeholder="What conversion events will you track? Form submissions, purchases, downloads, sign-ups..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analytics Integration
                  </label>
                  <textarea
                    value={conversionTracking.analyticsIntegration}
                    onChange={(e) => handleTrackingChange('analyticsIntegration', e.target.value)}
                    placeholder="How will you integrate analytics? UTM parameters, custom dimensions, cross-platform tracking..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Dashboard
                  </label>
                  <textarea
                    value={conversionTracking.reportingDashboard}
                    onChange={(e) => handleTrackingChange('reportingDashboard', e.target.value)}
                    placeholder="How will you visualize tracking data? Dashboard tools, automated reports, key metrics display..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Conversion Tracking Setup')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Conversion Tracking Setup')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Conversion Tracking Setup Items */}
                {addedOptimizationItems.filter(i => i.type === 'Conversion Tracking Setup').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasConversionTracking && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Conversion Tracking Setup Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to optimization action planning.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Action Plan</h3>
              <p className="text-gray-600 mb-6">
                Create actionable optimization plans based on data insights to systematically improve performance.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Optimization Areas
                  </label>
                  <textarea
                    value={optimizationPlan.optimizationAreas}
                    onChange={(e) => handleOptimizationChange('optimizationAreas', e.target.value)}
                    placeholder="What areas will you focus on optimizing? Landing pages, email campaigns, sales funnel, checkout process..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Plan
                  </label>
                  <textarea
                    value={optimizationPlan.actionPlan}
                    onChange={(e) => handleOptimizationChange('actionPlan', e.target.value)}
                    placeholder="What specific actions will you take? Test variations, implement changes, analyze results..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Implementation Timeline
                  </label>
                  <textarea
                    value={optimizationPlan.implementationTimeline}
                    onChange={(e) => handleOptimizationChange('implementationTimeline', e.target.value)}
                    placeholder="What's your implementation timeline? Weekly tests, monthly reviews, quarterly optimizations..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Metrics
                  </label>
                  <textarea
                    value={optimizationPlan.successMetrics}
                    onChange={(e) => handleOptimizationChange('successMetrics', e.target.value)}
                    placeholder="How will you measure success? Conversion rate improvements, ROI increases, engagement metrics..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Optimization Action Plan')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Optimization Action Plan')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Optimization Action Plan Items */}
                {addedOptimizationItems.filter(i => i.type === 'Optimization Action Plan').map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                        {item.details && (
                          <p className="text-gray-500 text-sm mt-2">{item.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {item.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOptimizationItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasOptimizationPlan && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Optimization Action Plan Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your conversion optimization system is now complete. Check out the milestone reflection!
                  </p>
                </div>
              )}
            </div>

            {/* AI Enhancement Section */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#d7df21]" />
                <h3 className="text-xl font-semibold text-gray-900">AI Enhancement</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Get AI-powered suggestions to optimize your complete conversion optimization strategy.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Optimization Strategy
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {showConfetti && (
              <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0e9246] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 Milestone Achieved!
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  Congratulations! You've built a comprehensive conversion optimization system that will drive continuous improvement.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Developed systematic A/B testing strategy</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Implemented comprehensive conversion tracking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created actionable optimization plans</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Established continuous improvement processes</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your conversions will continuously improve over time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Decisions will be based on real performance data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll maximize ROI from existing traffic</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Customer experience will be optimized</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Optimization is not a one-time activity—it's a continuous process. Your systematic approach to testing and improving ensures that your business performance gets better over time, turning small improvements into significant competitive advantages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 8 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Conversion Optimization
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Systematically test and optimize every aspect of your customer journey to maximize conversions and improve business performance.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 8 Complete! Your conversion optimization system is ready.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive system for continuous performance improvement.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className={`rounded-lg shadow-sm border border-gray-200 mb-6 ${isHowThisWorksOpen ? 'bg-white' : 'bg-white'}`}>
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Works</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#0e9246] font-medium">Expand</span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 text-[#0e9246]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#0e9246]" />
              )}
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 bg-white border-t border-[#0e9246]">
              <p className="text-gray-600 mb-6">{howThisWorksContent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {howThisWorksContent.steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sub-step Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap">
            {subSteps.map((step, index) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < 4 ? (
                step.id === 1 ? hasAbTestingStrategy :
                step.id === 2 ? hasConversionTracking :
                step.id === 3 ? hasOptimizationPlan : false
              ) : isStepComplete;

              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  disabled={!isUnlocked}
                  className={`flex-1 min-w-0 px-4 py-4 text-center border-b-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-[#fbae42] bg-orange-50'
                      : isUnlocked
                      ? 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                      : 'border-transparent bg-gray-50'
                  } ${
                    !isUnlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#0e9246] text-white'
                        : isActive
                        ? 'bg-[#fbae42] text-white'
                        : isUnlocked
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#fbae42]'
                        : isUnlocked
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-step Content */}
        <div className="mb-8">
          {renderSubStepContent()}
        </div>

        {/* Manual Entry Modal */}
        {manualModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">Add {currentModalType}</h3>
                <button
                  onClick={() => setManualModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={manualForm.type}
                    onChange={(e) => setManualForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="A/B Testing Strategy">A/B Testing Strategy</option>
                    <option value="Conversion Tracking Setup">Conversion Tracking Setup</option>
                    <option value="Optimization Action Plan">Optimization Action Plan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Landing Page A/B Tests"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={manualForm.description}
                    onChange={(e) => setManualForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
                  <textarea
                    value={manualForm.details}
                    onChange={(e) => setManualForm(prev => ({ ...prev, details: e.target.value }))}
                    placeholder="Additional details (optional)..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setManualModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSubmit}
                  className="flex-1 px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a]"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Modal */}
        {aiSuggestionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-lg font-semibold">AI {currentModalType} Suggestions</h3>
                <button
                  onClick={() => setAiSuggestionsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Select from these AI-generated {currentModalType.toLowerCase()} suggestions:
                </p>
                
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                          <p className="text-gray-600 mt-1">{suggestion.description}</p>
                          <p className="text-gray-500 text-sm mt-2">{suggestion.details}</p>
                        </div>
                        <button
                          onClick={() => addAiSuggestion(suggestion)}
                          className="ml-4 px-4 py-2 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {aiSuggestions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      All suggestions have been added! Close this modal to continue.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI Conversion Optimization"
          content={aiResult}
          isLoading={aiLoading}
          onUseContent={handleUseAIContent}
        />

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
        />

        {/* Footer */}
        <StepFooter 
          currentStep={8}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step8;

