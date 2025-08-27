import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, BookOpen, Users, Calendar, Plus, Sparkles } from 'lucide-react';
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

  // Content strategy data
  const [contentStrategy, setContentStrategy] = useState({
    contentPillars: '',
    contentTypes: '',
    distributionPlan: '',
    contentCalendar: ''
  });

  // Thought leadership data
  const [thoughtLeadership, setThoughtLeadership] = useState({
    expertiseAreas: '',
    uniquePerspectives: '',
    thoughtLeadershipGoals: '',
    influenceStrategy: ''
  });

  // Content calendar data
  const [contentCalendar, setContentCalendar] = useState({
    weeklySchedule: '',
    monthlyThemes: '',
    quarterlyGoals: '',
    contentBatching: ''
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
    const savedStrategy = storageOptimizer.safeGet('step5_content_strategy');
    const savedThoughtLeadership = storageOptimizer.safeGet('step5_thought_leadership');
    const savedCalendar = storageOptimizer.safeGet('step5_content_calendar');
    
    if (savedStrategy && typeof savedStrategy === 'object') {
      setContentStrategy(savedStrategy);
    }
    if (savedThoughtLeadership && typeof savedThoughtLeadership === 'object') {
      setThoughtLeadership(savedThoughtLeadership);
    }
    if (savedCalendar && typeof savedCalendar === 'object') {
      setContentCalendar(savedCalendar);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const strategyComplete = Object.values(contentStrategy).every(value => value && value.trim().length > 0);
    const thoughtLeadershipComplete = Object.values(thoughtLeadership).every(value => value && value.trim().length > 0);
    const calendarComplete = Object.values(contentCalendar).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = strategyComplete && thoughtLeadershipComplete && calendarComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [contentStrategy, thoughtLeadership, contentCalendar, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleStrategyChange = (field, value) => {
    const updated = { ...contentStrategy, [field]: value };
    setContentStrategy(updated);
    storageOptimizer.safeSet('step5_content_strategy', updated);
  };

  const handleThoughtLeadershipChange = (field, value) => {
    const updated = { ...thoughtLeadership, [field]: value };
    setThoughtLeadership(updated);
    storageOptimizer.safeSet('step5_thought_leadership', updated);
  };

  const handleCalendarChange = (field, value) => {
    const updated = { ...contentCalendar, [field]: value };
    setContentCalendar(updated);
    storageOptimizer.safeSet('step5_content_calendar', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateContentPlan();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating content plan:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setContentStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_content_strategy', { ...contentStrategy, ...content });
    } else if (activeSubStep === 2) {
      setThoughtLeadership(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_thought_leadership', { ...thoughtLeadership, ...content });
    } else if (activeSubStep === 3) {
      setContentCalendar(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step5_content_calendar', { ...contentCalendar, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Develop a comprehensive content strategy that establishes your thought leadership and builds authority in your industry.",
    steps: [
      { title: 'Content Strategy', description: 'Define your content pillars, types, and distribution strategy for maximum impact.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Thought Leadership', description: 'Establish your unique perspective and expertise areas to become a recognized authority.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Content Calendar', description: 'Create a systematic approach to content creation and publishing for consistency.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasContentStrategy = Object.values(contentStrategy).every(value => value && value.trim().length > 0);
  const hasThoughtLeadership = Object.values(thoughtLeadership).every(value => value && value.trim().length > 0);
  const hasContentCalendar = Object.values(contentCalendar).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasContentStrategy; // Unlocked when strategy complete
      case 3: return hasContentStrategy && hasThoughtLeadership; // Unlocked when first two complete
      case 4: return hasContentStrategy && hasThoughtLeadership && hasContentCalendar; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Content Strategy', icon: BookOpen },
    { id: 2, title: 'Thought Leadership', icon: Users },
    { id: 3, title: 'Content Calendar', icon: Calendar },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Strategy</h3>
              <p className="text-gray-600 mb-6">
                Define your content pillars, types, and distribution strategy to build authority and engage your audience.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Pillars
                  </label>
                  <textarea
                    value={contentStrategy.contentPillars}
                    onChange={(e) => handleStrategyChange('contentPillars', e.target.value)}
                    placeholder="Define 3-5 core content themes that align with your expertise and audience needs..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Types & Formats
                  </label>
                  <textarea
                    value={contentStrategy.contentTypes}
                    onChange={(e) => handleStrategyChange('contentTypes', e.target.value)}
                    placeholder="List the content formats you'll use: blog posts, videos, podcasts, social media posts, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distribution Plan
                  </label>
                  <textarea
                    value={contentStrategy.distributionPlan}
                    onChange={(e) => handleStrategyChange('distributionPlan', e.target.value)}
                    placeholder="Outline how you'll distribute content across channels: LinkedIn, YouTube, email, website, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Calendar Framework
                  </label>
                  <textarea
                    value={contentStrategy.contentCalendar}
                    onChange={(e) => handleStrategyChange('contentCalendar', e.target.value)}
                    placeholder="Define your publishing schedule and content planning approach..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasContentStrategy && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Content Strategy Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to thought leadership development.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Thought Leadership</h3>
              <p className="text-gray-600 mb-6">
                Establish your unique perspective and expertise areas to become a recognized authority in your field.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise Areas
                  </label>
                  <textarea
                    value={thoughtLeadership.expertiseAreas}
                    onChange={(e) => handleThoughtLeadershipChange('expertiseAreas', e.target.value)}
                    placeholder="Define your core areas of expertise and what makes you uniquely qualified..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unique Perspectives
                  </label>
                  <textarea
                    value={thoughtLeadership.uniquePerspectives}
                    onChange={(e) => handleThoughtLeadershipChange('uniquePerspectives', e.target.value)}
                    placeholder="What unique viewpoints or approaches do you bring to your industry?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thought Leadership Goals
                  </label>
                  <textarea
                    value={thoughtLeadership.thoughtLeadershipGoals}
                    onChange={(e) => handleThoughtLeadershipChange('thoughtLeadershipGoals', e.target.value)}
                    placeholder="What do you want to be known for? What conversations do you want to lead?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Influence Strategy
                  </label>
                  <textarea
                    value={thoughtLeadership.influenceStrategy}
                    onChange={(e) => handleThoughtLeadershipChange('influenceStrategy', e.target.value)}
                    placeholder="How will you build influence and establish yourself as a thought leader?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasThoughtLeadership && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Thought Leadership Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to content calendar planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Calendar</h3>
              <p className="text-gray-600 mb-6">
                Create a systematic approach to content creation and publishing for consistency and maximum impact.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Schedule
                  </label>
                  <textarea
                    value={contentCalendar.weeklySchedule}
                    onChange={(e) => handleCalendarChange('weeklySchedule', e.target.value)}
                    placeholder="Define your weekly content creation and publishing schedule..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Themes
                  </label>
                  <textarea
                    value={contentCalendar.monthlyThemes}
                    onChange={(e) => handleCalendarChange('monthlyThemes', e.target.value)}
                    placeholder="Plan monthly content themes and focus areas..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quarterly Goals
                  </label>
                  <textarea
                    value={contentCalendar.quarterlyGoals}
                    onChange={(e) => handleCalendarChange('quarterlyGoals', e.target.value)}
                    placeholder="Set quarterly content goals and major initiatives..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Batching Strategy
                  </label>
                  <textarea
                    value={contentCalendar.contentBatching}
                    onChange={(e) => handleCalendarChange('contentBatching', e.target.value)}
                    placeholder="How will you batch content creation for efficiency?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasContentCalendar && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Content Calendar Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your content strategy is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to enhance your content strategy and calendar planning.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Content Plan
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
                  Congratulations! You've developed a comprehensive content strategy and thought leadership plan.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Defined your content strategy and pillars</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Established your thought leadership positioning</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created a systematic content calendar approach</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Planned your content batching and efficiency strategy</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your content will be strategic and purposeful</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll establish yourself as a thought leader</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Content creation will be consistent and efficient</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your authority will grow systematically</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With a clear content strategy and thought leadership plan, you now have a roadmap for building authority and influence in your industry. Your content will work systematically to establish you as the go-to expert in your field.
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
          STEP 5 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Content Strategy & Thought Leadership
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Develop a comprehensive content strategy that establishes your thought leadership and builds authority in your industry.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 5 Complete! Your content strategy is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive plan for building thought leadership through strategic content.
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
                step.id === 1 ? hasContentStrategy :
                step.id === 2 ? hasThoughtLeadership :
                step.id === 3 ? hasContentCalendar : false
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
          title="AI Content Plan"
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

