import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Trophy, Star, Crown, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step9 = () => {
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

  // Authority establishment data
  const [authorityEstablishment, setAuthorityEstablishment] = useState({
    thoughtLeadership: '',
    industryRecognition: '',
    speakingOpportunities: '',
    mediaPresence: ''
  });

  // Legacy building data
  const [legacyBuilding, setLegacyBuilding] = useState({
    impactMeasurement: '',
    successStories: '',
    mentorshipProgram: '',
    givingBack: ''
  });

  // Continuous growth data
  const [continuousGrowth, setContinuousGrowth] = useState({
    learningPlan: '',
    innovationStrategy: '',
    adaptabilityFramework: '',
    futureVision: ''
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
    const savedAuthority = storageOptimizer.safeGet('step9_authority_establishment');
    const savedLegacy = storageOptimizer.safeGet('step9_legacy_building');
    const savedGrowth = storageOptimizer.safeGet('step9_continuous_growth');
    
    if (savedAuthority && typeof savedAuthority === 'object') {
      setAuthorityEstablishment(savedAuthority);
    }
    if (savedLegacy && typeof savedLegacy === 'object') {
      setLegacyBuilding(savedLegacy);
    }
    if (savedGrowth && typeof savedGrowth === 'object') {
      setContinuousGrowth(savedGrowth);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const authorityComplete = Object.values(authorityEstablishment).every(value => value && value.trim().length > 0);
    const legacyComplete = Object.values(legacyBuilding).every(value => value && value.trim().length > 0);
    const growthComplete = Object.values(continuousGrowth).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = authorityComplete && legacyComplete && growthComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Longer confetti for final step
    }
  }, [authorityEstablishment, legacyBuilding, continuousGrowth, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleAuthorityChange = (field, value) => {
    const updated = { ...authorityEstablishment, [field]: value };
    setAuthorityEstablishment(updated);
    storageOptimizer.safeSet('step9_authority_establishment', updated);
  };

  const handleLegacyChange = (field, value) => {
    const updated = { ...legacyBuilding, [field]: value };
    setLegacyBuilding(updated);
    storageOptimizer.safeSet('step9_legacy_building', updated);
  };

  const handleGrowthChange = (field, value) => {
    const updated = { ...continuousGrowth, [field]: value };
    setContinuousGrowth(updated);
    storageOptimizer.safeSet('step9_continuous_growth', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateAuthorityStrategy();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating authority strategy:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setAuthorityEstablishment(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step9_authority_establishment', { ...authorityEstablishment, ...content });
    } else if (activeSubStep === 2) {
      setLegacyBuilding(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step9_legacy_building', { ...legacyBuilding, ...content });
    } else if (activeSubStep === 3) {
      setContinuousGrowth(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step9_continuous_growth', { ...continuousGrowth, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Establish yourself as the ultimate authority in your field, build a lasting legacy, and create systems for continuous growth and innovation.",
    steps: [
      { title: 'Authority Establishment', description: 'Position yourself as the go-to expert and thought leader in your industry.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Legacy Building', description: 'Create lasting impact and build a legacy that extends beyond your business.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Continuous Growth', description: 'Establish systems for ongoing learning, innovation, and adaptation.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasAuthorityEstablishment = Object.values(authorityEstablishment).every(value => value && value.trim().length > 0);
  const hasLegacyBuilding = Object.values(legacyBuilding).every(value => value && value.trim().length > 0);
  const hasContinuousGrowth = Object.values(continuousGrowth).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasAuthorityEstablishment; // Unlocked when authority complete
      case 3: return hasAuthorityEstablishment && hasLegacyBuilding; // Unlocked when first two complete
      case 4: return hasAuthorityEstablishment && hasLegacyBuilding && hasContinuousGrowth; // Final celebration - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Authority Establishment', icon: Crown },
    { id: 2, title: 'Legacy Building', icon: Star },
    { id: 3, title: 'Continuous Growth', icon: Trophy },
    { id: 4, title: 'Final Celebration', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authority Establishment</h3>
              <p className="text-gray-600 mb-6">
                Position yourself as the go-to expert and thought leader in your industry, establishing unquestionable authority and influence.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thought Leadership Strategy
                  </label>
                  <textarea
                    value={authorityEstablishment.thoughtLeadership}
                    onChange={(e) => handleAuthorityChange('thoughtLeadership', e.target.value)}
                    placeholder="Define your thought leadership approach: unique perspectives, innovative ideas, industry insights..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Recognition Plan
                  </label>
                  <textarea
                    value={authorityEstablishment.industryRecognition}
                    onChange={(e) => handleAuthorityChange('industryRecognition', e.target.value)}
                    placeholder="Plan how you'll gain recognition: awards, certifications, industry associations, peer acknowledgment..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaking & Presentation Opportunities
                  </label>
                  <textarea
                    value={authorityEstablishment.speakingOpportunities}
                    onChange={(e) => handleAuthorityChange('speakingOpportunities', e.target.value)}
                    placeholder="Identify speaking opportunities: conferences, webinars, podcasts, industry events..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Presence & Visibility
                  </label>
                  <textarea
                    value={authorityEstablishment.mediaPresence}
                    onChange={(e) => handleAuthorityChange('mediaPresence', e.target.value)}
                    placeholder="Plan your media strategy: publications, interviews, guest appearances, content distribution..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasAuthorityEstablishment && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Authority Establishment Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to legacy building.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legacy Building</h3>
              <p className="text-gray-600 mb-6">
                Create lasting impact and build a legacy that extends beyond your business, inspiring and empowering others.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact Measurement & Documentation
                  </label>
                  <textarea
                    value={legacyBuilding.impactMeasurement}
                    onChange={(e) => handleLegacyChange('impactMeasurement', e.target.value)}
                    placeholder="How will you measure and document your impact on clients, industry, and community?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Stories & Case Studies
                  </label>
                  <textarea
                    value={legacyBuilding.successStories}
                    onChange={(e) => handleLegacyChange('successStories', e.target.value)}
                    placeholder="Plan how you'll collect, document, and share transformational success stories..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship & Knowledge Transfer
                  </label>
                  <textarea
                    value={legacyBuilding.mentorshipProgram}
                    onChange={(e) => handleLegacyChange('mentorshipProgram', e.target.value)}
                    placeholder="How will you mentor others and transfer your knowledge to the next generation?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giving Back & Social Impact
                  </label>
                  <textarea
                    value={legacyBuilding.givingBack}
                    onChange={(e) => handleLegacyChange('givingBack', e.target.value)}
                    placeholder="Plan your philanthropic efforts and ways to give back to your community or industry..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasLegacyBuilding && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Legacy Building Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Outstanding! You can now move to continuous growth planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Growth</h3>
              <p className="text-gray-600 mb-6">
                Establish systems for ongoing learning, innovation, and adaptation to stay ahead and continue growing.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Continuous Learning Plan
                  </label>
                  <textarea
                    value={continuousGrowth.learningPlan}
                    onChange={(e) => handleGrowthChange('learningPlan', e.target.value)}
                    placeholder="Plan your ongoing education: courses, certifications, conferences, reading, research..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Innovation Strategy
                  </label>
                  <textarea
                    value={continuousGrowth.innovationStrategy}
                    onChange={(e) => handleGrowthChange('innovationStrategy', e.target.value)}
                    placeholder="How will you stay innovative and ahead of industry trends and changes?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adaptability Framework
                  </label>
                  <textarea
                    value={continuousGrowth.adaptabilityFramework}
                    onChange={(e) => handleGrowthChange('adaptabilityFramework', e.target.value)}
                    placeholder="Create a framework for adapting to market changes, new technologies, and opportunities..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Future Vision & Goals
                  </label>
                  <textarea
                    value={continuousGrowth.futureVision}
                    onChange={(e) => handleGrowthChange('futureVision', e.target.value)}
                    placeholder="Define your long-term vision and goals for the next 5-10 years..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>
              </div>

              {hasContinuousGrowth && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Continuous Growth Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! You've completed the entire Authority Revenue Toolkit. Time to celebrate!
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
                Get AI-powered suggestions to enhance your authority establishment and legacy building plans.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Authority Strategy
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
                numberOfPieces={300}
                gravity={0.2}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#0e9246] to-[#d7df21] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  🎉 CONGRATULATIONS! 🎉
                </h2>
                
                <h3 className="text-2xl font-semibold text-[#0e9246] mb-6">
                  You've Completed the Authority Revenue Toolkit!
                </h3>
                
                <p className="text-lg text-gray-600 mb-8">
                  You've successfully built a comprehensive authority-based business that generates revenue while making a lasting impact.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left mb-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🏆 Your Journey Completed</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Defined your unique authority positioning</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Built powerful content and marketing systems</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created signature funnels and revenue streams</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Optimized systems and built scaling strategies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Established lasting authority and legacy</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 What You've Achieved</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Unshakeable authority in your field</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Multiple diversified revenue streams</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Automated systems that scale</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">A business that creates lasting impact</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">A legacy that extends beyond profit</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#d7df21] to-[#0e9246] bg-opacity-20 rounded-lg border-2 border-[#0e9246] p-6 mb-8">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">🎯 You Are Now The Authority</h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    You've transformed from someone with expertise into THE recognized authority in your field. Your business now generates revenue not just from what you do, but from who you are and the unique value you bring to the world. You've built something that will continue to grow and impact others for years to come.
                  </p>
                </div>

                <div className="bg-[#0e9246] text-white rounded-lg p-6">
                  <h4 className="font-bold mb-3 text-lg">🔥 What's Next?</h4>
                  <p className="text-green-100 mb-4">
                    Your journey doesn't end here. Continue to implement, refine, and scale what you've built. Stay connected with your community, keep learning, and remember that your authority grows stronger with every person you help and every life you transform.
                  </p>
                  <p className="text-green-100 font-semibold">
                    Welcome to your new reality as THE Authority in your field! 👑
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
          STEP 9 OF 9 - FINAL STEP
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Authority & Legacy
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Establish yourself as the ultimate authority in your field, build a lasting legacy, and create systems for continuous growth and innovation.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg border-2 border-[#0e9246]">
            <Crown className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">🎉 TOOLKIT COMPLETE! You are now THE Authority!</p>
              <p className="text-sm text-green-700 mt-1">
                Congratulations! You've completed all 9 steps and built a comprehensive authority-based business.
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
                step.id === 1 ? hasAuthorityEstablishment :
                step.id === 2 ? hasLegacyBuilding :
                step.id === 3 ? hasContinuousGrowth : false
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
          title="AI Authority Strategy"
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
          currentStep={9}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step9;

