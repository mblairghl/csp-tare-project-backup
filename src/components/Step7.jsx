import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Cog, Zap, BarChart3, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step7 = () => {
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

  // Systems automation data
  const [systemsAutomation, setSystemsAutomation] = useState({
    crmSetup: '',
    emailAutomation: '',
    socialMediaAutomation: '',
    contentAutomation: ''
  });

  // Workflow optimization data
  const [workflowOptimization, setWorkflowOptimization] = useState({
    clientOnboarding: '',
    projectManagement: '',
    deliveryProcess: '',
    qualityAssurance: ''
  });

  // Performance tracking data
  const [performanceTracking, setPerformanceTracking] = useState({
    kpiDashboard: '',
    reportingSystem: '',
    analyticsSetup: '',
    optimizationPlan: ''
  });

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
    const savedSystems = storageOptimizer.safeGet('step7_systems_automation');
    const savedWorkflow = storageOptimizer.safeGet('step7_workflow_optimization');
    const savedTracking = storageOptimizer.safeGet('step7_performance_tracking');
    
    if (savedSystems && typeof savedSystems === 'object') {
      setSystemsAutomation(savedSystems);
    }
    if (savedWorkflow && typeof savedWorkflow === 'object') {
      setWorkflowOptimization(savedWorkflow);
    }
    if (savedTracking && typeof savedTracking === 'object') {
      setPerformanceTracking(savedTracking);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const systemsComplete = Object.values(systemsAutomation).every(value => value && value.trim().length > 0);
    const workflowComplete = Object.values(workflowOptimization).every(value => value && value.trim().length > 0);
    const trackingComplete = Object.values(performanceTracking).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = systemsComplete && workflowComplete && trackingComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [systemsAutomation, workflowOptimization, performanceTracking, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleSystemsChange = (field, value) => {
    const updated = { ...systemsAutomation, [field]: value };
    setSystemsAutomation(updated);
    storageOptimizer.safeSet('step7_systems_automation', updated);
  };

  const handleWorkflowChange = (field, value) => {
    const updated = { ...workflowOptimization, [field]: value };
    setWorkflowOptimization(updated);
    storageOptimizer.safeSet('step7_workflow_optimization', updated);
  };

  const handleTrackingChange = (field, value) => {
    const updated = { ...performanceTracking, [field]: value };
    setPerformanceTracking(updated);
    storageOptimizer.safeSet('step7_performance_tracking', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateSystemsOptimization();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating systems optimization:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setSystemsAutomation(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_systems_automation', { ...systemsAutomation, ...content });
    } else if (activeSubStep === 2) {
      setWorkflowOptimization(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_workflow_optimization', { ...workflowOptimization, ...content });
    } else if (activeSubStep === 3) {
      setPerformanceTracking(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step7_performance_tracking', { ...performanceTracking, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Automate your business systems, optimize workflows, and implement performance tracking for maximum efficiency and growth.",
    steps: [
      { title: 'Systems Automation', description: 'Automate repetitive tasks and processes to save time and reduce errors.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Workflow Optimization', description: 'Streamline your business processes for maximum efficiency and client satisfaction.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Performance Tracking', description: 'Implement systems to monitor, measure, and optimize your business performance.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasSystemsAutomation = Object.values(systemsAutomation).every(value => value && value.trim().length > 0);
  const hasWorkflowOptimization = Object.values(workflowOptimization).every(value => value && value.trim().length > 0);
  const hasPerformanceTracking = Object.values(performanceTracking).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasSystemsAutomation; // Unlocked when systems complete
      case 3: return hasSystemsAutomation && hasWorkflowOptimization; // Unlocked when first two complete
      case 4: return hasSystemsAutomation && hasWorkflowOptimization && hasPerformanceTracking; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Systems Automation', icon: Cog },
    { id: 2, title: 'Workflow Optimization', icon: Zap },
    { id: 3, title: 'Performance Tracking', icon: BarChart3 },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Systems Automation</h3>
              <p className="text-gray-600 mb-6">
                Automate repetitive tasks and processes to save time, reduce errors, and focus on high-value activities.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CRM Setup & Automation
                  </label>
                  <textarea
                    value={systemsAutomation.crmSetup}
                    onChange={(e) => handleSystemsChange('crmSetup', e.target.value)}
                    placeholder="Configure your CRM system with automated lead tracking, follow-ups, and pipeline management..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Marketing Automation
                  </label>
                  <textarea
                    value={systemsAutomation.emailAutomation}
                    onChange={(e) => handleSystemsChange('emailAutomation', e.target.value)}
                    placeholder="Set up automated email sequences for nurturing, onboarding, and client communication..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Automation
                  </label>
                  <textarea
                    value={systemsAutomation.socialMediaAutomation}
                    onChange={(e) => handleSystemsChange('socialMediaAutomation', e.target.value)}
                    placeholder="Automate social media posting, engagement, and content distribution across platforms..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Creation Automation
                  </label>
                  <textarea
                    value={systemsAutomation.contentAutomation}
                    onChange={(e) => handleSystemsChange('contentAutomation', e.target.value)}
                    placeholder="Automate content repurposing, scheduling, and distribution workflows..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasSystemsAutomation && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Systems Automation Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to workflow optimization.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Workflow Optimization</h3>
              <p className="text-gray-600 mb-6">
                Streamline your business processes for maximum efficiency, consistency, and client satisfaction.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Onboarding Process
                  </label>
                  <textarea
                    value={workflowOptimization.clientOnboarding}
                    onChange={(e) => handleWorkflowChange('clientOnboarding', e.target.value)}
                    placeholder="Design a smooth onboarding process from initial contact to project kickoff..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Management Workflow
                  </label>
                  <textarea
                    value={workflowOptimization.projectManagement}
                    onChange={(e) => handleWorkflowChange('projectManagement', e.target.value)}
                    placeholder="Optimize your project management process for efficiency and client communication..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Delivery Process
                  </label>
                  <textarea
                    value={workflowOptimization.deliveryProcess}
                    onChange={(e) => handleWorkflowChange('deliveryProcess', e.target.value)}
                    placeholder="Streamline how you deliver your services or products to ensure consistent quality..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Assurance & Feedback
                  </label>
                  <textarea
                    value={workflowOptimization.qualityAssurance}
                    onChange={(e) => handleWorkflowChange('qualityAssurance', e.target.value)}
                    placeholder="Implement quality checks and feedback loops to continuously improve your processes..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasWorkflowOptimization && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Workflow Optimization Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to performance tracking.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Tracking</h3>
              <p className="text-gray-600 mb-6">
                Implement systems to monitor, measure, and optimize your business performance for continuous growth.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KPI Dashboard Setup
                  </label>
                  <textarea
                    value={performanceTracking.kpiDashboard}
                    onChange={(e) => handleTrackingChange('kpiDashboard', e.target.value)}
                    placeholder="Set up a dashboard to track key performance indicators and business metrics..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting System
                  </label>
                  <textarea
                    value={performanceTracking.reportingSystem}
                    onChange={(e) => handleTrackingChange('reportingSystem', e.target.value)}
                    placeholder="Create automated reporting systems for regular performance reviews..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analytics & Data Collection
                  </label>
                  <textarea
                    value={performanceTracking.analyticsSetup}
                    onChange={(e) => handleTrackingChange('analyticsSetup', e.target.value)}
                    placeholder="Implement analytics tools to collect and analyze business data..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Continuous Optimization Plan
                  </label>
                  <textarea
                    value={performanceTracking.optimizationPlan}
                    onChange={(e) => handleTrackingChange('optimizationPlan', e.target.value)}
                    placeholder="Plan how you'll use data insights to continuously optimize your business..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasPerformanceTracking && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Performance Tracking Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your systems optimization is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to enhance your systems automation and optimization plans.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Systems Optimization
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
                  Congratulations! You've optimized your business systems and implemented performance tracking.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Automated key business systems and processes</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Optimized workflows for maximum efficiency</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Implemented performance tracking and analytics</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created systems for continuous optimization</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Cog className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your business will run more efficiently with less manual work</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Cog className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Client experience will be more consistent and professional</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Cog className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have clear visibility into business performance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Cog className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your business will scale more effectively</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With optimized systems and performance tracking in place, your business now operates like a well-oiled machine. You'll spend less time on repetitive tasks and more time on strategic growth activities.
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
          STEP 7 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Systems & Automation
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Automate your business systems, optimize workflows, and implement performance tracking for maximum efficiency and growth.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 7 Complete! Your systems are optimized.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have automated systems and performance tracking for efficient business operations.
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
                step.id === 1 ? hasSystemsAutomation :
                step.id === 2 ? hasWorkflowOptimization :
                step.id === 3 ? hasPerformanceTracking : false
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

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI Systems Optimization"
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
          currentStep={7}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step7;

