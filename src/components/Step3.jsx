import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Users, TrendingUp, Settings, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step3 = () => {
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

  // Lead source data
  const [currentSources, setCurrentSources] = useState([]);
  const [expansionOpportunities, setExpansionOpportunities] = useState([]);
  const [cspSetup, setCspSetup] = useState({
    leadScoring: '',
    automationRules: '',
    integrations: '',
    reportingSetup: ''
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
    const savedSources = storageOptimizer.safeGet('step3_current_sources');
    const savedExpansion = storageOptimizer.safeGet('step3_expansion_opportunities');
    const savedCspSetup = storageOptimizer.safeGet('step3_csp_setup');
    
    if (savedSources && Array.isArray(savedSources)) {
      setCurrentSources(savedSources);
    }
    if (savedExpansion && Array.isArray(savedExpansion)) {
      setExpansionOpportunities(savedExpansion);
    }
    if (savedCspSetup && typeof savedCspSetup === 'object') {
      setCspSetup(savedCspSetup);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const hasCurrentSources = currentSources.length >= 2;
    const hasExpansionOpportunities = expansionOpportunities.length >= 2;
    const hasCspSetup = Object.values(cspSetup).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = hasCurrentSources && hasExpansionOpportunities && hasCspSetup;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentSources, expansionOpportunities, cspSetup, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle adding current sources
  const handleAddCurrentSource = (source) => {
    const newSource = {
      id: Date.now(),
      name: source.name || 'New Lead Source',
      type: source.type || 'Other',
      performance: source.performance || 'Good',
      description: source.description || ''
    };
    const updated = [...currentSources, newSource];
    setCurrentSources(updated);
    storageOptimizer.safeSet('step3_current_sources', updated);
  };

  // Handle adding expansion opportunities
  const handleAddExpansionOpportunity = (opportunity) => {
    const newOpportunity = {
      id: Date.now(),
      name: opportunity.name || 'New Opportunity',
      type: opportunity.type || 'Digital',
      priority: opportunity.priority || 'Medium',
      description: opportunity.description || ''
    };
    const updated = [...expansionOpportunities, newOpportunity];
    setExpansionOpportunities(updated);
    storageOptimizer.safeSet('step3_expansion_opportunities', updated);
  };

  // Handle CSP setup changes
  const handleCspSetupChange = (field, value) => {
    const updated = { ...cspSetup, [field]: value };
    setCspSetup(updated);
    storageOptimizer.safeSet('step3_csp_setup', updated);
  };

  // AI lead source generation
  const handleAILeadGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateLeadSources();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating lead sources:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    if (activeSubStep === 2) {
      // Add to expansion opportunities
      handleAddExpansionOpportunity(content);
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Analyze your current lead sources, identify expansion opportunities, and set up your CSP system for optimal lead management.",
    steps: [
      { title: 'Current Sources', description: 'Audit and document your existing lead generation sources and their performance.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Expansion Opportunities', description: 'Identify new lead sources and channels to diversify your lead generation.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'CSP Setup', description: 'Configure your Customer Success Platform for lead scoring and automation.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasCurrentSources = currentSources.length >= 2;
  const hasExpansionOpportunities = expansionOpportunities.length >= 2;
  const hasCspSetup = Object.values(cspSetup).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasCurrentSources; // Unlocked when current sources complete
      case 3: return hasCurrentSources && hasExpansionOpportunities; // Unlocked when first two complete
      case 4: return hasCurrentSources && hasExpansionOpportunities && hasCspSetup; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Current Sources', icon: Users },
    { id: 2, title: 'Expansion Opportunities', icon: TrendingUp },
    { id: 3, title: 'CSP Setup', icon: Settings },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Lead Sources</h3>
              <p className="text-gray-600 mb-6">
                Document and analyze your existing lead generation sources to understand what's working and what needs improvement.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleAddCurrentSource({ name: 'LinkedIn Outreach', type: 'Social Media', performance: 'Good' })}
                  className="px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Lead Source
                </button>

                {currentSources.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Your Current Lead Sources ({currentSources.length})</h4>
                    {currentSources.map((source) => (
                      <div key={source.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{source.name}</h5>
                            <p className="text-sm text-gray-600">Type: {source.type} | Performance: {source.performance}</p>
                            {source.description && (
                              <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {currentSources.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No lead sources added yet. Start by adding your current sources.</p>
                  </div>
                )}
              </div>

              {hasCurrentSources && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Current Sources Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to expansion opportunities.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expansion Opportunities</h3>
              <p className="text-gray-600 mb-6">
                Identify new lead sources and channels to diversify and expand your lead generation efforts.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddExpansionOpportunity({ name: 'Content Marketing', type: 'Digital', priority: 'High' })}
                    className="px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Opportunity
                  </button>
                  
                  <button
                    onClick={handleAILeadGeneration}
                    className="px-4 py-2 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Recommendations
                  </button>
                </div>

                {expansionOpportunities.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Your Expansion Opportunities ({expansionOpportunities.length})</h4>
                    {expansionOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{opportunity.name}</h5>
                            <p className="text-sm text-gray-600">Type: {opportunity.type} | Priority: {opportunity.priority}</p>
                            {opportunity.description && (
                              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expansionOpportunities.length === 0 && (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No expansion opportunities added yet. Start by adding new lead source ideas.</p>
                  </div>
                )}
              </div>

              {hasExpansionOpportunities && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Expansion Opportunities Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to CSP setup.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">CSP Setup</h3>
              <p className="text-gray-600 mb-6">
                Configure your Customer Success Platform (CSP) for optimal lead scoring, automation, and management.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSP Lead Scoring Setup
                  </label>
                  <textarea
                    value={cspSetup.leadScoring}
                    onChange={(e) => handleCspSetupChange('leadScoring', e.target.value)}
                    placeholder="Define your lead scoring criteria and point values in CSP..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Automation Rules
                  </label>
                  <textarea
                    value={cspSetup.automationRules}
                    onChange={(e) => handleCspSetupChange('automationRules', e.target.value)}
                    placeholder="Set up automation rules for lead nurturing and follow-up in CSP..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSP Integrations
                  </label>
                  <textarea
                    value={cspSetup.integrations}
                    onChange={(e) => handleCspSetupChange('integrations', e.target.value)}
                    placeholder="Configure integrations with your other tools and platforms in CSP..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting & Analytics Setup
                  </label>
                  <textarea
                    value={cspSetup.reportingSetup}
                    onChange={(e) => handleCspSetupChange('reportingSetup', e.target.value)}
                    placeholder="Set up reporting dashboards and analytics tracking in CSP..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasCspSetup && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">CSP Setup Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your lead source planning is now complete. Check out the milestone reflection!
                  </p>
                </div>
              )}
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
                  Congratulations! You've completed your comprehensive lead source planning and CSP setup.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Audited and documented your current lead sources</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Identified expansion opportunities for lead generation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Configured your CSP system for optimal lead management</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Set up automation and reporting systems</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your lead generation will be more diversified and resilient</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have automated systems for lead nurturing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Lead quality and conversion rates will improve</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have clear visibility into lead source performance</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With a diversified lead generation strategy and properly configured CSP system, you now have a robust foundation for consistent, high-quality lead flow. Your business will be less dependent on any single source and more resilient to market changes.
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
          STEP 3 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Lead Source Planning
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Analyze your current lead sources, identify expansion opportunities, and set up your CSP system for optimal lead management.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 3 Complete! Your lead source strategy is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive plan for diversified lead generation and CSP management.
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
                step.id === 1 ? hasCurrentSources :
                step.id === 2 ? hasExpansionOpportunities :
                step.id === 3 ? hasCspSetup : false
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
          title="AI Lead Source Recommendations"
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
          currentStep={3}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step3;

