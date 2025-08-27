import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, DollarSign, Target, TrendingUp, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step6 = () => {
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

  // Revenue streams data
  const [revenueStreams, setRevenueStreams] = useState({
    primaryStreams: '',
    secondaryStreams: '',
    passiveIncome: '',
    scalabilityPlan: ''
  });

  // Pricing strategy data
  const [pricingStrategy, setPricingStrategy] = useState({
    pricingModel: '',
    valueProposition: '',
    competitiveAnalysis: '',
    pricingTiers: ''
  });

  // Revenue optimization data
  const [revenueOptimization, setRevenueOptimization] = useState({
    conversionOptimization: '',
    upsellStrategies: '',
    retentionStrategies: '',
    growthMetrics: ''
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
    const savedStreams = storageOptimizer.safeGet('step6_revenue_streams');
    const savedPricing = storageOptimizer.safeGet('step6_pricing_strategy');
    const savedOptimization = storageOptimizer.safeGet('step6_revenue_optimization');
    
    if (savedStreams && typeof savedStreams === 'object') {
      setRevenueStreams(savedStreams);
    }
    if (savedPricing && typeof savedPricing === 'object') {
      setPricingStrategy(savedPricing);
    }
    if (savedOptimization && typeof savedOptimization === 'object') {
      setRevenueOptimization(savedOptimization);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const streamsComplete = Object.values(revenueStreams).every(value => value && value.trim().length > 0);
    const pricingComplete = Object.values(pricingStrategy).every(value => value && value.trim().length > 0);
    const optimizationComplete = Object.values(revenueOptimization).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = streamsComplete && pricingComplete && optimizationComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [revenueStreams, pricingStrategy, revenueOptimization, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleStreamsChange = (field, value) => {
    const updated = { ...revenueStreams, [field]: value };
    setRevenueStreams(updated);
    storageOptimizer.safeSet('step6_revenue_streams', updated);
  };

  const handlePricingChange = (field, value) => {
    const updated = { ...pricingStrategy, [field]: value };
    setPricingStrategy(updated);
    storageOptimizer.safeSet('step6_pricing_strategy', updated);
  };

  const handleOptimizationChange = (field, value) => {
    const updated = { ...revenueOptimization, [field]: value };
    setRevenueOptimization(updated);
    storageOptimizer.safeSet('step6_revenue_optimization', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateRevenueStrategy();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating revenue strategy:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setRevenueStreams(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_revenue_streams', { ...revenueStreams, ...content });
    } else if (activeSubStep === 2) {
      setPricingStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_pricing_strategy', { ...pricingStrategy, ...content });
    } else if (activeSubStep === 3) {
      setRevenueOptimization(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_revenue_optimization', { ...revenueOptimization, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Develop multiple revenue streams, optimize your pricing strategy, and create systems for sustainable revenue growth.",
    steps: [
      { title: 'Revenue Streams', description: 'Identify and develop multiple income sources to diversify and stabilize your revenue.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Pricing Strategy', description: 'Optimize your pricing model and value proposition for maximum profitability.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Revenue Optimization', description: 'Implement strategies to increase conversion rates and customer lifetime value.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasRevenueStreams = Object.values(revenueStreams).every(value => value && value.trim().length > 0);
  const hasPricingStrategy = Object.values(pricingStrategy).every(value => value && value.trim().length > 0);
  const hasRevenueOptimization = Object.values(revenueOptimization).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasRevenueStreams; // Unlocked when streams complete
      case 3: return hasRevenueStreams && hasPricingStrategy; // Unlocked when first two complete
      case 4: return hasRevenueStreams && hasPricingStrategy && hasRevenueOptimization; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Revenue Streams', icon: DollarSign },
    { id: 2, title: 'Pricing Strategy', icon: Target },
    { id: 3, title: 'Revenue Optimization', icon: TrendingUp },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Streams</h3>
              <p className="text-gray-600 mb-6">
                Identify and develop multiple income sources to diversify and stabilize your revenue base.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Revenue Streams
                  </label>
                  <textarea
                    value={revenueStreams.primaryStreams}
                    onChange={(e) => handleStreamsChange('primaryStreams', e.target.value)}
                    placeholder="Define your main revenue sources: consulting, courses, coaching, products, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Revenue Streams
                  </label>
                  <textarea
                    value={revenueStreams.secondaryStreams}
                    onChange={(e) => handleStreamsChange('secondaryStreams', e.target.value)}
                    placeholder="List additional income sources: affiliate marketing, speaking, partnerships, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passive Income Opportunities
                  </label>
                  <textarea
                    value={revenueStreams.passiveIncome}
                    onChange={(e) => handleStreamsChange('passiveIncome', e.target.value)}
                    placeholder="Identify passive income streams: digital products, memberships, licensing, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scalability Plan
                  </label>
                  <textarea
                    value={revenueStreams.scalabilityPlan}
                    onChange={(e) => handleStreamsChange('scalabilityPlan', e.target.value)}
                    placeholder="How will you scale each revenue stream? What systems and processes are needed?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasRevenueStreams && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Revenue Streams Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to pricing strategy development.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing Strategy</h3>
              <p className="text-gray-600 mb-6">
                Optimize your pricing model and value proposition for maximum profitability and market positioning.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Model
                  </label>
                  <textarea
                    value={pricingStrategy.pricingModel}
                    onChange={(e) => handlePricingChange('pricingModel', e.target.value)}
                    placeholder="Define your pricing approach: value-based, hourly, project-based, subscription, etc."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value Proposition
                  </label>
                  <textarea
                    value={pricingStrategy.valueProposition}
                    onChange={(e) => handlePricingChange('valueProposition', e.target.value)}
                    placeholder="What unique value do you provide that justifies your pricing?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competitive Analysis
                  </label>
                  <textarea
                    value={pricingStrategy.competitiveAnalysis}
                    onChange={(e) => handlePricingChange('competitiveAnalysis', e.target.value)}
                    placeholder="How does your pricing compare to competitors? What's your positioning strategy?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Tiers & Packages
                  </label>
                  <textarea
                    value={pricingStrategy.pricingTiers}
                    onChange={(e) => handlePricingChange('pricingTiers', e.target.value)}
                    placeholder="Define your pricing tiers, packages, and upsell opportunities..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasPricingStrategy && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Pricing Strategy Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to revenue optimization.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Optimization</h3>
              <p className="text-gray-600 mb-6">
                Implement strategies to increase conversion rates, customer lifetime value, and overall revenue performance.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversion Optimization
                  </label>
                  <textarea
                    value={revenueOptimization.conversionOptimization}
                    onChange={(e) => handleOptimizationChange('conversionOptimization', e.target.value)}
                    placeholder="How will you optimize your sales funnel and conversion rates?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upsell & Cross-sell Strategies
                  </label>
                  <textarea
                    value={revenueOptimization.upsellStrategies}
                    onChange={(e) => handleOptimizationChange('upsellStrategies', e.target.value)}
                    placeholder="What additional products or services can you offer to existing clients?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Retention Strategies
                  </label>
                  <textarea
                    value={revenueOptimization.retentionStrategies}
                    onChange={(e) => handleOptimizationChange('retentionStrategies', e.target.value)}
                    placeholder="How will you retain customers and increase their lifetime value?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growth Metrics & KPIs
                  </label>
                  <textarea
                    value={revenueOptimization.growthMetrics}
                    onChange={(e) => handleOptimizationChange('growthMetrics', e.target.value)}
                    placeholder="What metrics will you track to measure and optimize revenue growth?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasRevenueOptimization && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Revenue Optimization Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your revenue strategy is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to enhance your revenue strategy and optimization plans.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Revenue Strategy
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
                  Congratulations! You've developed a comprehensive revenue strategy and optimization plan.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Identified multiple revenue streams for diversification</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Developed an optimized pricing strategy</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created revenue optimization and growth plans</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Established metrics for tracking revenue performance</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your revenue will be more stable and predictable</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll maximize profitability through strategic pricing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Customer lifetime value will increase systematically</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your business will scale more effectively</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With a diversified revenue strategy and optimization plan, you now have a robust foundation for sustainable business growth. Your revenue will be less dependent on any single source and more resilient to market changes.
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
          STEP 6 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Revenue Diversification
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Develop multiple revenue streams, optimize your pricing strategy, and create systems for sustainable revenue growth.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 6 Complete! Your revenue strategy is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive plan for diversified and optimized revenue generation.
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
                step.id === 1 ? hasRevenueStreams :
                step.id === 2 ? hasPricingStrategy :
                step.id === 3 ? hasRevenueOptimization : false
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
          title="AI Revenue Strategy"
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
          currentStep={6}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step6;

