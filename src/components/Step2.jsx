import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, FileText, BarChart2, Lightbulb, Plus, Sparkles, Search, Target } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step2 = () => {
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

  // Content audit data
  const [contentAudit, setContentAudit] = useState({
    existingContent: '',
    contentGaps: '',
    strengths: '',
    opportunities: ''
  });

  // Content strategy data
  const [contentStrategy, setContentStrategy] = useState({
    contentPillars: '',
    distributionChannels: '',
    contentCalendar: '',
    repurposingPlan: ''
  });

  // Gap analysis data
  const [gapAnalysis, setGapAnalysis] = useState({
    missingContent: '',
    competitorAnalysis: '',
    audienceNeeds: '',
    actionPlan: ''
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
    const savedAudit = storageOptimizer.safeGet('step2_content_audit');
    const savedStrategy = storageOptimizer.safeGet('step2_content_strategy');
    const savedGapAnalysis = storageOptimizer.safeGet('step2_gap_analysis');
    
    if (savedAudit && typeof savedAudit === 'object') {
      setContentAudit(savedAudit);
    }
    if (savedStrategy && typeof savedStrategy === 'object') {
      setContentStrategy(savedStrategy);
    }
    if (savedGapAnalysis && typeof savedGapAnalysis === 'object') {
      setGapAnalysis(savedGapAnalysis);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const auditComplete = Object.values(contentAudit).every(value => value && value.trim().length > 0);
    const strategyComplete = Object.values(contentStrategy).every(value => value && value.trim().length > 0);
    const gapComplete = Object.values(gapAnalysis).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = auditComplete && strategyComplete && gapComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [contentAudit, contentStrategy, gapAnalysis, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleAuditChange = (field, value) => {
    const updated = { ...contentAudit, [field]: value };
    setContentAudit(updated);
    storageOptimizer.safeSet('step2_content_audit', updated);
  };

  const handleStrategyChange = (field, value) => {
    const updated = { ...contentStrategy, [field]: value };
    setContentStrategy(updated);
    storageOptimizer.safeSet('step2_content_strategy', updated);
  };

  const handleGapAnalysisChange = (field, value) => {
    const updated = { ...gapAnalysis, [field]: value };
    setGapAnalysis(updated);
    storageOptimizer.safeSet('step2_gap_analysis', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateContentStrategy();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating content strategy:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setContentAudit(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step2_content_audit', { ...contentAudit, ...content });
    } else if (activeSubStep === 2) {
      setContentStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step2_content_strategy', { ...contentStrategy, ...content });
    } else if (activeSubStep === 3) {
      setGapAnalysis(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step2_gap_analysis', { ...gapAnalysis, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Audit your existing content, develop a strategic distribution plan, and identify gaps to maximize your authority-building efforts.",
    steps: [
      { title: 'Content Audit', description: 'Analyze your existing content assets and identify what\'s working and what needs improvement.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Strategic Distribution', description: 'Plan how to distribute and repurpose your content across multiple channels for maximum reach.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Gap Analysis', description: 'Identify missing content opportunities and create an action plan to fill those gaps.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasContentAudit = Object.values(contentAudit).every(value => value && value.trim().length > 0);
  const hasContentStrategy = Object.values(contentStrategy).every(value => value && value.trim().length > 0);
  const hasGapAnalysis = Object.values(gapAnalysis).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasContentAudit; // Unlocked when audit complete
      case 3: return hasContentAudit && hasContentStrategy; // Unlocked when first two complete
      case 4: return hasContentAudit && hasContentStrategy && hasGapAnalysis; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Content Audit', icon: Search },
    { id: 2, title: 'Strategic Distribution', icon: BarChart2 },
    { id: 3, title: 'Gap Analysis', icon: Target },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Audit</h3>
              <p className="text-gray-600 mb-6">
                Analyze your existing content assets to understand what's working and identify areas for improvement.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Content Inventory
                  </label>
                  <textarea
                    value={contentAudit.existingContent}
                    onChange={(e) => handleAuditChange('existingContent', e.target.value)}
                    placeholder="List your current content assets: blog posts, videos, podcasts, social media content, lead magnets, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Strengths
                  </label>
                  <textarea
                    value={contentAudit.strengths}
                    onChange={(e) => handleAuditChange('strengths', e.target.value)}
                    placeholder="What content performs best? What topics resonate with your audience? What formats work well?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Gaps & Weaknesses
                  </label>
                  <textarea
                    value={contentAudit.contentGaps}
                    onChange={(e) => handleAuditChange('contentGaps', e.target.value)}
                    placeholder="What topics are missing? What formats could you explore? Where are the quality issues?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Improvement Opportunities
                  </label>
                  <textarea
                    value={contentAudit.opportunities}
                    onChange={(e) => handleAuditChange('opportunities', e.target.value)}
                    placeholder="How can you improve existing content? What repurposing opportunities exist? What new formats should you try?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasContentAudit && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Content Audit Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to strategic distribution planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Strategic Distribution</h3>
              <p className="text-gray-600 mb-6">
                Plan how to distribute and repurpose your content across multiple channels for maximum reach and impact.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Pillars & Themes
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
                    Distribution Channels
                  </label>
                  <textarea
                    value={contentStrategy.distributionChannels}
                    onChange={(e) => handleStrategyChange('distributionChannels', e.target.value)}
                    placeholder="List your primary and secondary distribution channels: LinkedIn, YouTube, podcast, email newsletter, blog, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Calendar Strategy
                  </label>
                  <textarea
                    value={contentStrategy.contentCalendar}
                    onChange={(e) => handleStrategyChange('contentCalendar', e.target.value)}
                    placeholder="Outline your content publishing schedule and frequency for each channel..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repurposing Plan
                  </label>
                  <textarea
                    value={contentStrategy.repurposingPlan}
                    onChange={(e) => handleStrategyChange('repurposingPlan', e.target.value)}
                    placeholder="How will you repurpose content across formats? (e.g., blog post → social posts → video → podcast episode)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasContentStrategy && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Strategic Distribution Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to gap analysis.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gap Analysis</h3>
              <p className="text-gray-600 mb-6">
                Identify missing content opportunities and create an action plan to fill those gaps.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Missing Content Types
                  </label>
                  <textarea
                    value={gapAnalysis.missingContent}
                    onChange={(e) => handleGapAnalysisChange('missingContent', e.target.value)}
                    placeholder="What content types are you missing? Case studies, tutorials, thought leadership pieces, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competitor Analysis
                  </label>
                  <textarea
                    value={gapAnalysis.competitorAnalysis}
                    onChange={(e) => handleGapAnalysisChange('competitorAnalysis', e.target.value)}
                    placeholder="What content are your competitors creating that you're not? What opportunities do you see?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audience Needs Assessment
                  </label>
                  <textarea
                    value={gapAnalysis.audienceNeeds}
                    onChange={(e) => handleGapAnalysisChange('audienceNeeds', e.target.value)}
                    placeholder="What questions is your audience asking that you haven't addressed? What problems need solutions?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Plan
                  </label>
                  <textarea
                    value={gapAnalysis.actionPlan}
                    onChange={(e) => handleGapAnalysisChange('actionPlan', e.target.value)}
                    placeholder="What specific content will you create to fill these gaps? Prioritize by impact and effort."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasGapAnalysis && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Gap Analysis Complete!</span>
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
                Get AI-powered suggestions to enhance your content strategy and identify new opportunities.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Content Strategy
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
                  Congratulations! You've completed your comprehensive content audit and strategy.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Audited your existing content assets and identified strengths</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Developed a strategic distribution plan across channels</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Identified content gaps and opportunities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created an action plan to fill content gaps</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your content efforts will be more strategic and focused</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll maximize reach through smart repurposing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll address all audience needs comprehensively</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your authority-building will be systematic and effective</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With a comprehensive content strategy in place, you now have a roadmap for creating and distributing content that builds authority, engages your audience, and drives business results. Your content efforts will be strategic rather than random.
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
          STEP 2 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Content Audit & Strategy
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Audit your existing content, develop a strategic distribution plan, and identify gaps to maximize your authority-building efforts.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 2 Complete! Your content strategy is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive plan for creating and distributing authority-building content.
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
                step.id === 1 ? hasContentAudit :
                step.id === 2 ? hasContentStrategy :
                step.id === 3 ? hasGapAnalysis : false
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
          title="AI Content Strategy"
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
          currentStep={2}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step2;

