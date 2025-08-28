import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, BookOpen, Users, Calendar, Plus, Sparkles, X, Edit, Trash2, Search, Zap } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step5 = () => {
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

  // Sales pipeline data
  const [discoveryProcess, setDiscoveryProcess] = useState({
    qualificationCriteria: '',
    discoveryQuestions: '',
    needsAssessment: '',
    painPointIdentification: ''
  });

  const [automationSetup, setAutomationSetup] = useState({
    leadScoring: '',
    emailSequences: '',
    followUpTasks: '',
    crmIntegration: ''
  });

  const [integrationPlan, setIntegrationPlan] = useState({
    toolsIntegration: '',
    dataFlow: '',
    reportingSetup: '',
    teamAccess: ''
  });

  // Added pipeline items list
  const [addedPipelineItems, setAddedPipelineItems] = useState([]);

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
    const savedDiscovery = storageOptimizer.safeGet('step5_discovery_process');
    const savedAutomation = storageOptimizer.safeGet('step5_automation_setup');
    const savedIntegration = storageOptimizer.safeGet('step5_integration_plan');
    const savedItems = storageOptimizer.safeGet('step5_added_pipeline_items');
    
    if (savedDiscovery && typeof savedDiscovery === 'object') {
      setDiscoveryProcess(savedDiscovery);
    }
    if (savedAutomation && typeof savedAutomation === 'object') {
      setAutomationSetup(savedAutomation);
    }
    if (savedIntegration && typeof savedIntegration === 'object') {
      setIntegrationPlan(savedIntegration);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedPipelineItems(savedItems);
    }
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const discoveryComplete = Object.values(discoveryProcess).every(value => value && value.trim().length > 0);
    const automationComplete = Object.values(automationSetup).every(value => value && value.trim().length > 0);
    const integrationComplete = Object.values(integrationPlan).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = discoveryComplete && automationComplete && integrationComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [discoveryProcess, automationSetup, integrationPlan, isStepComplete]);

  // Auto-progression logic for sub-steps - ONLY on user actions
  const triggerAutoProgression = () => {
    const hasDiscoveryProcess = Object.values(discoveryProcess).every(value => value && value.trim().length > 0) ||
                               addedPipelineItems.some(item => item.type === 'Discovery Process');
    const hasAutomationSetup = Object.values(automationSetup).every(value => value && value.trim().length > 0) ||
                              addedPipelineItems.some(item => item.type === 'Automation Setup');
    const hasIntegrationPlan = Object.values(integrationPlan).every(value => value && value.trim().length > 0) ||
                              addedPipelineItems.some(item => item.type === 'Integration Plan');
    
    console.log('Step 5 Auto-progression Trigger:', {
      activeSubStep,
      hasDiscoveryProcess,
      hasAutomationSetup,
      hasIntegrationPlan
    });
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasDiscoveryProcess) {
      console.log('Auto-progressing from Discovery Process to Automation Setup');
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasAutomationSetup) {
      console.log('Auto-progressing from Automation Setup to Integration Plan');
      setTimeout(() => setActiveSubStep(3), 500);
    } else if (activeSubStep === 3 && hasIntegrationPlan) {
      console.log('Auto-progressing from Integration Plan to Milestone');
      setTimeout(() => setActiveSubStep(4), 500);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleDiscoveryChange = (field, value) => {
    const updated = { ...discoveryProcess, [field]: value };
    setDiscoveryProcess(updated);
    storageOptimizer.safeSet('step5_discovery_process', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
  };

  const handleAutomationChange = (field, value) => {
    const updated = { ...automationSetup, [field]: value };
    setAutomationSetup(updated);
    storageOptimizer.safeSet('step5_automation_setup', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
  };

  const handleIntegrationChange = (field, value) => {
    const updated = { ...integrationPlan, [field]: value };
    setIntegrationPlan(updated);
    storageOptimizer.safeSet('step5_integration_plan', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
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
      
      const updated = [...addedPipelineItems, newItem];
      setAddedPipelineItems(updated);
      storageOptimizer.safeSet('step5_added_pipeline_items', updated);
      setManualModalOpen(false);
      
      // Trigger auto-progression check after adding manual entry
      setTimeout(() => triggerAutoProgression(), 100);
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
      'Discovery Process': [
        { id: 1, title: 'BANT Qualification Framework', description: 'Budget, Authority, Need, Timeline qualification', details: 'Systematic approach to qualify prospects using BANT criteria' },
        { id: 2, title: 'Pain Point Discovery Questions', description: 'Strategic questions to uncover client challenges', details: 'Open-ended questions that reveal deep pain points and motivations' },
        { id: 3, title: 'Solution Fit Assessment', description: 'Evaluate if your solution matches their needs', details: 'Framework to determine if there\'s a good fit before proposing' },
        { id: 4, title: 'Decision-Making Process Mapping', description: 'Understand how they make purchasing decisions', details: 'Identify stakeholders, timeline, and decision criteria' },
        { id: 5, title: 'Current State Analysis', description: 'Assess their current situation and challenges', details: 'Comprehensive review of their existing processes and pain points' }
      ],
      'Automation Setup': [
        { id: 1, title: 'Lead Scoring Algorithm', description: 'Automated lead qualification and prioritization', details: 'Score leads based on engagement, demographics, and behavior patterns' },
        { id: 2, title: 'Email Drip Campaigns', description: 'Automated nurture sequences for different stages', details: 'Targeted email sequences for prospects, qualified leads, and customers' },
        { id: 3, title: 'Task Automation Rules', description: 'Automatic task creation and assignment', details: 'Create follow-up tasks based on prospect actions and timeline' },
        { id: 4, title: 'Pipeline Stage Automation', description: 'Automatic movement through sales stages', details: 'Rules for advancing prospects based on completed actions' },
        { id: 5, title: 'Notification Systems', description: 'Alerts for important prospect activities', details: 'Real-time notifications for hot leads and urgent follow-ups' }
      ],
      'Integration Plan': [
        { id: 1, title: 'CRM Integration', description: 'Connect with your existing CRM system', details: 'Seamless data flow between marketing and sales platforms' },
        { id: 2, title: 'Email Marketing Integration', description: 'Sync with email marketing platforms', details: 'Connect with Mailchimp, ConvertKit, or other email tools' },
        { id: 3, title: 'Calendar Integration', description: 'Automated scheduling and booking', details: 'Connect with Calendly, Acuity, or other scheduling tools' },
        { id: 4, title: 'Analytics Integration', description: 'Comprehensive tracking and reporting', details: 'Connect with Google Analytics, Facebook Pixel, and other tracking' },
        { id: 5, title: 'Payment Processing Integration', description: 'Seamless payment collection', details: 'Integrate with Stripe, PayPal, or other payment processors' }
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
    
    const updated = [...addedPipelineItems, newItem];
    setAddedPipelineItems(updated);
    storageOptimizer.safeSet('step5_added_pipeline_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Trigger auto-progression check after adding AI suggestion
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // Edit/Delete functions
  const editPipelineItem = (id) => {
    const item = addedPipelineItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deletePipelineItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deletePipelineItem = (id) => {
    const updated = addedPipelineItems.filter(i => i.id !== id);
    setAddedPipelineItems(updated);
    storageOptimizer.safeSet('step5_added_pipeline_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateSalesPipeline();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating sales pipeline:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setDiscoveryProcess(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_discovery_process', { ...discoveryProcess, ...content });
    } else if (activeSubStep === 2) {
      setAutomationSetup(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_automation_setup', { ...automationSetup, ...content });
    } else if (activeSubStep === 3) {
      setIntegrationPlan(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_integration_plan', { ...integrationPlan, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    title: "How This Step Works",
    description: "Follow these Action Steps to build an automated sales pipeline that qualifies prospects and converts leads efficiently.",
    steps: [
      {
        title: "Discovery Process",
        description: "Create a systematic approach to qualify prospects and understand their needs and decision-making process.",
        color: "bg-[#fbae42]"
      },
      {
        title: "Automation Setup", 
        description: "Implement automated systems for lead scoring, nurturing sequences, and follow-up communications.",
        color: "bg-[#0e9246]"
      },
      {
        title: "Integration Plan",
        description: "Connect all tools and systems to create a seamless, efficient sales pipeline operation.",
        color: "bg-[#467a8f]"
      }
    ]
  };

  // Check section completion for tab progression
  const hasDiscoveryProcess = Object.values(discoveryProcess).every(value => value && value.trim().length > 0);
  const hasAutomationSetup = Object.values(automationSetup).every(value => value && value.trim().length > 0);
  const hasIntegrationPlan = Object.values(integrationPlan).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasDiscoveryProcess; // Unlocked when discovery complete
      case 3: return hasDiscoveryProcess && hasAutomationSetup; // Unlocked when first two complete
      case 4: return hasDiscoveryProcess && hasAutomationSetup && hasIntegrationPlan; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Discovery Process', icon: Search },
    { id: 2, title: 'Automation Setup', icon: Zap },
    { id: 3, title: 'Integration Plan', icon: Users },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Discovery Process</h3>
              <p className="text-gray-600 mb-6">
                Create a systematic approach to qualify prospects, understand their needs, and determine if there's a good fit.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification Criteria
                  </label>
                  <textarea
                    value={discoveryProcess.qualificationCriteria}
                    onChange={(e) => handleDiscoveryChange('qualificationCriteria', e.target.value)}
                    placeholder="Define your ideal client criteria: budget range, company size, decision-making authority..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discovery Questions
                  </label>
                  <textarea
                    value={discoveryProcess.discoveryQuestions}
                    onChange={(e) => handleDiscoveryChange('discoveryQuestions', e.target.value)}
                    placeholder="List key questions to understand their situation, challenges, and goals..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Needs Assessment Process
                  </label>
                  <textarea
                    value={discoveryProcess.needsAssessment}
                    onChange={(e) => handleDiscoveryChange('needsAssessment', e.target.value)}
                    placeholder="How will you assess if your solution fits their needs?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pain Point Identification
                  </label>
                  <textarea
                    value={discoveryProcess.painPointIdentification}
                    onChange={(e) => handleDiscoveryChange('painPointIdentification', e.target.value)}
                    placeholder="How will you uncover and validate their key pain points?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Discovery Process')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Discovery Process')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Discovery Process Items */}
                {addedPipelineItems.filter(i => i.type === 'Discovery Process').map((item) => (
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
                          onClick={() => editPipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasDiscoveryProcess && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Discovery Process Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to automation setup.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automation Setup</h3>
              <p className="text-gray-600 mb-6">
                Implement automated systems for lead scoring, nurturing, and follow-up to maximize efficiency and conversion.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Scoring System
                  </label>
                  <textarea
                    value={automationSetup.leadScoring}
                    onChange={(e) => handleAutomationChange('leadScoring', e.target.value)}
                    placeholder="Define how leads will be scored: engagement level, demographics, behavior, company fit..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Sequences
                  </label>
                  <textarea
                    value={automationSetup.emailSequences}
                    onChange={(e) => handleAutomationChange('emailSequences', e.target.value)}
                    placeholder="Describe your automated email sequences for different prospect stages..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Follow-up Tasks
                  </label>
                  <textarea
                    value={automationSetup.followUpTasks}
                    onChange={(e) => handleAutomationChange('followUpTasks', e.target.value)}
                    placeholder="What automated tasks will be created for follow-up and nurturing?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CRM Integration
                  </label>
                  <textarea
                    value={automationSetup.crmIntegration}
                    onChange={(e) => handleAutomationChange('crmIntegration', e.target.value)}
                    placeholder="How will automation integrate with your CRM system?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Automation Setup')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Automation Setup')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Automation Setup Items */}
                {addedPipelineItems.filter(i => i.type === 'Automation Setup').map((item) => (
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
                          onClick={() => editPipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasAutomationSetup && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Automation Setup Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to integration planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integration Plan</h3>
              <p className="text-gray-600 mb-6">
                Connect all your tools and systems for seamless data flow and unified sales pipeline management.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tools Integration
                  </label>
                  <textarea
                    value={integrationPlan.toolsIntegration}
                    onChange={(e) => handleIntegrationChange('toolsIntegration', e.target.value)}
                    placeholder="List the tools you'll integrate: CRM, email marketing, calendar, payment processing..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Flow Design
                  </label>
                  <textarea
                    value={integrationPlan.dataFlow}
                    onChange={(e) => handleIntegrationChange('dataFlow', e.target.value)}
                    placeholder="How will data flow between systems? Lead capture → CRM → Email → Analytics..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Setup
                  </label>
                  <textarea
                    value={integrationPlan.reportingSetup}
                    onChange={(e) => handleIntegrationChange('reportingSetup', e.target.value)}
                    placeholder="What reports and dashboards will you create to track pipeline performance?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Access & Permissions
                  </label>
                  <textarea
                    value={integrationPlan.teamAccess}
                    onChange={(e) => handleIntegrationChange('teamAccess', e.target.value)}
                    placeholder="Who will have access to what systems? Define roles and permissions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Integration Plan')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Integration Plan')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Integration Plan Items */}
                {addedPipelineItems.filter(i => i.type === 'Integration Plan').map((item) => (
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
                          onClick={() => editPipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePipelineItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasIntegrationPlan && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Integration Plan Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your sales pipeline automation is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to optimize your complete sales pipeline automation.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Pipeline Strategy
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
                  Congratulations! You've built an automated sales pipeline that will efficiently convert prospects into clients.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created systematic discovery process</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Set up automated lead scoring and nurturing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Planned comprehensive tool integration</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Built scalable sales pipeline system</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your sales process will be more efficient</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll qualify prospects more effectively</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Follow-up will happen automatically</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Conversion rates will improve significantly</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Automation doesn't replace relationships—it enhances them. Your pipeline now ensures no prospect falls through the cracks while maintaining the personal touch that builds trust and drives conversions.
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 5 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sales Pipeline Automation
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Build an automated sales pipeline that qualifies prospects, nurtures relationships, and converts leads into clients efficiently.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 5 Complete! Your sales pipeline is automated.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have an efficient system to convert prospects into clients.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className={`rounded-lg shadow-lg border border-gray-200 mb-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2 ${isHowThisWorksOpen ? 'bg-white' : 'bg-white'}`}>
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Step Works</span>
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

        {/* Action Steps Navigation */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Action Steps</h2>
          <p className="text-sm text-gray-600">Complete all Action Steps below before moving to the next Step page.</p>
        </div>
        
        {/* Sub-step Navigation */}
        <div className="bg-[#467a8f] bg-opacity-10 rounded-lg shadow-lg border border-[#467a8f] border-opacity-20 mb-8 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
          <div className="flex flex-wrap">
            {subSteps.map((step, index) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < 4 ? (
                step.id === 1 ? hasDiscoveryProcess :
                step.id === 2 ? hasAutomationSetup :
                step.id === 3 ? hasIntegrationPlan : false
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
                      ) : !isUnlocked ? (
                        <span className="text-sm">🔒</span>
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
                    <option value="Discovery Process">Discovery Process</option>
                    <option value="Automation Setup">Automation Setup</option>
                    <option value="Integration Plan">Integration Plan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., BANT Qualification Framework"
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
          title="AI Sales Pipeline"
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
          currentStep={5}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step5;

