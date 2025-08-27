import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Users, TrendingUp, Rocket, Plus, Sparkles } from 'lucide-react';
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

  // Team building data
  const [teamBuilding, setTeamBuilding] = useState({
    teamStructure: '',
    hiringPlan: '',
    roleDefinitions: '',
    teamCulture: ''
  });

  // Scaling strategy data
  const [scalingStrategy, setScalingStrategy] = useState({
    growthPlan: '',
    marketExpansion: '',
    productScaling: '',
    operationalScaling: ''
  });

  // Leadership development data
  const [leadershipDevelopment, setLeadershipDevelopment] = useState({
    leadershipSkills: '',
    delegationStrategy: '',
    visionCommunication: '',
    successorPlanning: ''
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
    const savedTeam = storageOptimizer.safeGet('step8_team_building');
    const savedScaling = storageOptimizer.safeGet('step8_scaling_strategy');
    const savedLeadership = storageOptimizer.safeGet('step8_leadership_development');
    
    if (savedTeam && typeof savedTeam === 'object') {
      setTeamBuilding(savedTeam);
    }
    if (savedScaling && typeof savedScaling === 'object') {
      setScalingStrategy(savedScaling);
    }
    if (savedLeadership && typeof savedLeadership === 'object') {
      setLeadershipDevelopment(savedLeadership);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const teamComplete = Object.values(teamBuilding).every(value => value && value.trim().length > 0);
    const scalingComplete = Object.values(scalingStrategy).every(value => value && value.trim().length > 0);
    const leadershipComplete = Object.values(leadershipDevelopment).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = teamComplete && scalingComplete && leadershipComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [teamBuilding, scalingStrategy, leadershipDevelopment, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleTeamChange = (field, value) => {
    const updated = { ...teamBuilding, [field]: value };
    setTeamBuilding(updated);
    storageOptimizer.safeSet('step8_team_building', updated);
  };

  const handleScalingChange = (field, value) => {
    const updated = { ...scalingStrategy, [field]: value };
    setScalingStrategy(updated);
    storageOptimizer.safeSet('step8_scaling_strategy', updated);
  };

  const handleLeadershipChange = (field, value) => {
    const updated = { ...leadershipDevelopment, [field]: value };
    setLeadershipDevelopment(updated);
    storageOptimizer.safeSet('step8_leadership_development', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateScalingStrategy();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating scaling strategy:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setTeamBuilding(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_team_building', { ...teamBuilding, ...content });
    } else if (activeSubStep === 2) {
      setScalingStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_scaling_strategy', { ...scalingStrategy, ...content });
    } else if (activeSubStep === 3) {
      setLeadershipDevelopment(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step8_leadership_development', { ...leadershipDevelopment, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Build a strong team, develop scaling strategies, and enhance your leadership skills to grow your business beyond your personal capacity.",
    steps: [
      { title: 'Team Building', description: 'Build and structure a high-performing team to support your business growth.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Scaling Strategy', description: 'Develop comprehensive strategies to scale your business operations and market reach.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Leadership Development', description: 'Enhance your leadership skills to effectively guide your growing organization.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasTeamBuilding = Object.values(teamBuilding).every(value => value && value.trim().length > 0);
  const hasScalingStrategy = Object.values(scalingStrategy).every(value => value && value.trim().length > 0);
  const hasLeadershipDevelopment = Object.values(leadershipDevelopment).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasTeamBuilding; // Unlocked when team complete
      case 3: return hasTeamBuilding && hasScalingStrategy; // Unlocked when first two complete
      case 4: return hasTeamBuilding && hasScalingStrategy && hasLeadershipDevelopment; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Team Building', icon: Users },
    { id: 2, title: 'Scaling Strategy', icon: TrendingUp },
    { id: 3, title: 'Leadership Development', icon: Rocket },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Building</h3>
              <p className="text-gray-600 mb-6">
                Build and structure a high-performing team that can support your business growth and help you scale beyond your personal capacity.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Structure & Organization
                  </label>
                  <textarea
                    value={teamBuilding.teamStructure}
                    onChange={(e) => handleTeamChange('teamStructure', e.target.value)}
                    placeholder="Define your ideal team structure, departments, and organizational hierarchy..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hiring Plan & Timeline
                  </label>
                  <textarea
                    value={teamBuilding.hiringPlan}
                    onChange={(e) => handleTeamChange('hiringPlan', e.target.value)}
                    placeholder="Plan your hiring strategy, timeline, and budget for building your team..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role Definitions & Responsibilities
                  </label>
                  <textarea
                    value={teamBuilding.roleDefinitions}
                    onChange={(e) => handleTeamChange('roleDefinitions', e.target.value)}
                    placeholder="Define clear roles, responsibilities, and expectations for each team position..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Culture & Values
                  </label>
                  <textarea
                    value={teamBuilding.teamCulture}
                    onChange={(e) => handleTeamChange('teamCulture', e.target.value)}
                    placeholder="Establish your team culture, core values, and working principles..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasTeamBuilding && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Team Building Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to scaling strategy development.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Scaling Strategy</h3>
              <p className="text-gray-600 mb-6">
                Develop comprehensive strategies to scale your business operations, expand your market reach, and grow sustainably.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Growth Plan & Milestones
                  </label>
                  <textarea
                    value={scalingStrategy.growthPlan}
                    onChange={(e) => handleScalingChange('growthPlan', e.target.value)}
                    placeholder="Define your growth targets, milestones, and timeline for scaling your business..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Market Expansion Strategy
                  </label>
                  <textarea
                    value={scalingStrategy.marketExpansion}
                    onChange={(e) => handleScalingChange('marketExpansion', e.target.value)}
                    placeholder="Plan how you'll expand into new markets, segments, or geographic regions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Service Scaling
                  </label>
                  <textarea
                    value={scalingStrategy.productScaling}
                    onChange={(e) => handleScalingChange('productScaling', e.target.value)}
                    placeholder="How will you scale your products or services to meet increased demand?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operational Scaling Plan
                  </label>
                  <textarea
                    value={scalingStrategy.operationalScaling}
                    onChange={(e) => handleScalingChange('operationalScaling', e.target.value)}
                    placeholder="Plan how you'll scale your operations, infrastructure, and processes..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasScalingStrategy && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Scaling Strategy Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to leadership development.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Leadership Development</h3>
              <p className="text-gray-600 mb-6">
                Enhance your leadership skills and capabilities to effectively guide your growing organization and inspire your team.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leadership Skills Development
                  </label>
                  <textarea
                    value={leadershipDevelopment.leadershipSkills}
                    onChange={(e) => handleLeadershipChange('leadershipSkills', e.target.value)}
                    placeholder="Identify key leadership skills to develop and your learning plan..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delegation Strategy
                  </label>
                  <textarea
                    value={leadershipDevelopment.delegationStrategy}
                    onChange={(e) => handleLeadershipChange('delegationStrategy', e.target.value)}
                    placeholder="Plan how you'll effectively delegate tasks and empower your team..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Communication
                  </label>
                  <textarea
                    value={leadershipDevelopment.visionCommunication}
                    onChange={(e) => handleLeadershipChange('visionCommunication', e.target.value)}
                    placeholder="How will you communicate your vision and inspire your team toward common goals?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Successor Planning
                  </label>
                  <textarea
                    value={leadershipDevelopment.successorPlanning}
                    onChange={(e) => handleLeadershipChange('successorPlanning', e.target.value)}
                    placeholder="Plan for developing future leaders and ensuring business continuity..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasLeadershipDevelopment && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Leadership Development Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your scaling and leadership plan is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to enhance your scaling strategy and leadership development plans.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Scaling Strategy
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
                  Congratulations! You've developed a comprehensive scaling strategy and leadership development plan.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Designed a strategic team building and hiring plan</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created comprehensive scaling strategies for growth</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Developed leadership skills and delegation strategies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Planned for succession and business continuity</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your business can grow beyond your personal capacity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have a clear roadmap for sustainable scaling</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your leadership will inspire and guide your team effectively</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Rocket className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your business will be positioned for long-term success</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    With a strong team, scaling strategy, and enhanced leadership skills, you're now ready to grow your business to new heights. Your authority and influence will expand as your business scales successfully.
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
          Scaling & Leadership
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Build a strong team, develop scaling strategies, and enhance your leadership skills to grow your business beyond your personal capacity.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 8 Complete! Your scaling strategy is ready.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive plan for team building, scaling, and leadership development.
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
                step.id === 1 ? hasTeamBuilding :
                step.id === 2 ? hasScalingStrategy :
                step.id === 3 ? hasLeadershipDevelopment : false
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
          title="AI Scaling Strategy"
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

