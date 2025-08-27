import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Trophy, Star, Crown, Plus, Sparkles, X, Edit, Trash2, Award, Target, Zap } from 'lucide-react';
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
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
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

  // Authority and legacy data
  const [authorityEstablishment, setAuthorityEstablishment] = useState({
    thoughtLeadership: '',
    industryRecognition: '',
    speakingOpportunities: '',
    mediaPresence: ''
  });

  const [legacyBuilding, setLegacyBuilding] = useState({
    impactMeasurement: '',
    successStories: '',
    mentorshipProgram: '',
    givingBack: ''
  });

  const [continuousGrowth, setContinuousGrowth] = useState({
    learningPlan: '',
    innovationStrategy: '',
    adaptabilityFramework: '',
    futureVision: ''
  });

  // Added authority items list
  const [addedAuthorityItems, setAddedAuthorityItems] = useState([]);

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
    const savedAuthority = storageOptimizer.safeGet('step9_authority_establishment');
    const savedLegacy = storageOptimizer.safeGet('step9_legacy_building');
    const savedGrowth = storageOptimizer.safeGet('step9_continuous_growth');
    const savedItems = storageOptimizer.safeGet('step9_added_authority_items');
    
    if (savedAuthority && typeof savedAuthority === 'object') {
      setAuthorityEstablishment(savedAuthority);
    }
    if (savedLegacy && typeof savedLegacy === 'object') {
      setLegacyBuilding(savedLegacy);
    }
    if (savedGrowth && typeof savedGrowth === 'object') {
      setContinuousGrowth(savedGrowth);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedAuthorityItems(savedItems);
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
      setShowFinalCelebration(true);
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
      
      const updated = [...addedAuthorityItems, newItem];
      setAddedAuthorityItems(updated);
      storageOptimizer.safeSet('step9_added_authority_items', updated);
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
      'Authority Establishment': [
        { id: 1, title: 'Industry Thought Leadership', description: 'Establish yourself as a recognized industry expert', details: 'Publish articles, create original research, share insights on industry trends' },
        { id: 2, title: 'Speaking Engagements', description: 'Build authority through public speaking', details: 'Conference keynotes, podcast interviews, webinar hosting, panel discussions' },
        { id: 3, title: 'Media Presence Strategy', description: 'Develop a strong media and content presence', details: 'Regular content creation, media interviews, social media thought leadership' },
        { id: 4, title: 'Industry Recognition Program', description: 'Pursue awards and industry recognition', details: 'Apply for industry awards, seek certifications, join professional boards' },
        { id: 5, title: 'Expert Network Building', description: 'Build relationships with other industry leaders', details: 'Mastermind groups, advisory positions, strategic partnerships with experts' }
      ],
      'Legacy Building': [
        { id: 1, title: 'Impact Measurement System', description: 'Track and document your business impact', details: 'Client success metrics, industry influence tracking, social impact measurement' },
        { id: 2, title: 'Success Story Documentation', description: 'Capture and share transformation stories', details: 'Case studies, testimonials, before/after documentation, video stories' },
        { id: 3, title: 'Mentorship Program', description: 'Give back by mentoring the next generation', details: 'Formal mentoring programs, coaching initiatives, knowledge transfer systems' },
        { id: 4, title: 'Charitable Giving Strategy', description: 'Create meaningful social impact', details: 'Foundation establishment, charitable partnerships, community involvement programs' },
        { id: 5, title: 'Knowledge Legacy Creation', description: 'Document and share your expertise', details: 'Write books, create courses, develop frameworks, build knowledge repositories' }
      ],
      'Continuous Growth': [
        { id: 1, title: 'Lifelong Learning Plan', description: 'Commit to continuous personal and professional development', details: 'Executive education, skill development, industry certifications, learning goals' },
        { id: 2, title: 'Innovation Strategy', description: 'Stay ahead through continuous innovation', details: 'R&D investment, trend monitoring, experimental projects, innovation partnerships' },
        { id: 3, title: 'Adaptability Framework', description: 'Build systems for rapid adaptation to change', details: 'Scenario planning, agile methodologies, change management processes' },
        { id: 4, title: 'Future Vision Development', description: 'Create and communicate your long-term vision', details: '10-year vision planning, strategic roadmaps, vision communication strategies' },
        { id: 5, title: 'Network Expansion Strategy', description: 'Continuously expand your professional network', details: 'Strategic relationship building, industry connections, global network development' }
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
    
    const updated = [...addedAuthorityItems, newItem];
    setAddedAuthorityItems(updated);
    storageOptimizer.safeSet('step9_added_authority_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // Edit/Delete functions
  const editAuthorityItem = (id) => {
    const item = addedAuthorityItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteAuthorityItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteAuthorityItem = (id) => {
    const updated = addedAuthorityItems.filter(i => i.id !== id);
    setAddedAuthorityItems(updated);
    storageOptimizer.safeSet('step9_added_authority_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateAuthorityBuilding();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating authority building:', error);
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
    description: "Build lasting authority in your industry while creating a meaningful legacy and positioning yourself for continuous growth and impact.",
    steps: [
      { title: 'Authority Establishment', description: 'Build recognition as an industry thought leader.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Legacy Building', description: 'Create lasting impact and give back to your community.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Continuous Growth', description: 'Plan for ongoing development and future success.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
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
      case 2: return hasAuthorityEstablishment; // Unlocked when authority establishment complete
      case 3: return hasAuthorityEstablishment && hasLegacyBuilding; // Unlocked when first two complete
      case 4: return hasAuthorityEstablishment && hasLegacyBuilding && hasContinuousGrowth; // Final celebration - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Authority Establishment', icon: Award },
    { id: 2, title: 'Legacy Building', icon: Target },
    { id: 3, title: 'Continuous Growth', icon: Zap },
    { id: 4, title: 'Final Celebration', icon: Trophy }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authority Establishment</h3>
              <p className="text-gray-600 mb-6">
                Build recognition as an industry thought leader and establish your authority in your field.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thought Leadership
                  </label>
                  <textarea
                    value={authorityEstablishment.thoughtLeadership}
                    onChange={(e) => handleAuthorityChange('thoughtLeadership', e.target.value)}
                    placeholder="How will you establish thought leadership? Content creation, original research, industry insights..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry Recognition
                  </label>
                  <textarea
                    value={authorityEstablishment.industryRecognition}
                    onChange={(e) => handleAuthorityChange('industryRecognition', e.target.value)}
                    placeholder="What recognition will you pursue? Awards, certifications, board positions, industry rankings..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaking Opportunities
                  </label>
                  <textarea
                    value={authorityEstablishment.speakingOpportunities}
                    onChange={(e) => handleAuthorityChange('speakingOpportunities', e.target.value)}
                    placeholder="What speaking opportunities will you pursue? Conferences, podcasts, webinars, panels..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media Presence
                  </label>
                  <textarea
                    value={authorityEstablishment.mediaPresence}
                    onChange={(e) => handleAuthorityChange('mediaPresence', e.target.value)}
                    placeholder="How will you build media presence? Social media strategy, media interviews, content distribution..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Authority Establishment')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Authority Establishment')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Authority Establishment Items */}
                {addedAuthorityItems.filter(i => i.type === 'Authority Establishment').map((item) => (
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
                          onClick={() => editAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasAuthorityEstablishment && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Authority Establishment Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to legacy building.
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
                Create lasting impact and give back to your community while building a meaningful legacy.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Impact Measurement
                  </label>
                  <textarea
                    value={legacyBuilding.impactMeasurement}
                    onChange={(e) => handleLegacyChange('impactMeasurement', e.target.value)}
                    placeholder="How will you measure your impact? Client transformations, industry influence, social impact metrics..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Success Stories
                  </label>
                  <textarea
                    value={legacyBuilding.successStories}
                    onChange={(e) => handleLegacyChange('successStories', e.target.value)}
                    placeholder="How will you document success stories? Case studies, testimonials, transformation documentation..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mentorship Program
                  </label>
                  <textarea
                    value={legacyBuilding.mentorshipProgram}
                    onChange={(e) => handleLegacyChange('mentorshipProgram', e.target.value)}
                    placeholder="How will you mentor others? Formal programs, coaching initiatives, knowledge transfer systems..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giving Back
                  </label>
                  <textarea
                    value={legacyBuilding.givingBack}
                    onChange={(e) => handleLegacyChange('givingBack', e.target.value)}
                    placeholder="How will you give back? Charitable giving, community involvement, social impact initiatives..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Legacy Building')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Legacy Building')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Legacy Building Items */}
                {addedAuthorityItems.filter(i => i.type === 'Legacy Building').map((item) => (
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
                          onClick={() => editAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasLegacyBuilding && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Legacy Building Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to continuous growth planning.
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
                Plan for ongoing development and future success to ensure continuous growth and adaptation.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Plan
                  </label>
                  <textarea
                    value={continuousGrowth.learningPlan}
                    onChange={(e) => handleGrowthChange('learningPlan', e.target.value)}
                    placeholder="What is your continuous learning plan? Executive education, skill development, certifications..."
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
                    placeholder="How will you stay innovative? R&D investment, trend monitoring, experimental projects..."
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
                    placeholder="How will you adapt to change? Scenario planning, agile methodologies, change management..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Future Vision
                  </label>
                  <textarea
                    value={continuousGrowth.futureVision}
                    onChange={(e) => handleGrowthChange('futureVision', e.target.value)}
                    placeholder="What is your long-term vision? 10-year goals, strategic roadmaps, vision communication..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Continuous Growth')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Continuous Growth')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Continuous Growth Items */}
                {addedAuthorityItems.filter(i => i.type === 'Continuous Growth').map((item) => (
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
                          onClick={() => editAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAuthorityItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasContinuousGrowth && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Continuous Growth Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your authority building journey is now complete. Check out the final celebration!
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
                Get AI-powered suggestions to optimize your complete authority building strategy.
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
            {(showConfetti || showFinalCelebration) && (
              <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                numberOfPieces={500}
                gravity={0.2}
                colors={['#0e9246', '#fbae42', '#d7df21', '#467A8f', '#5c98af']}
              />
            )}
            
            <div className="bg-gradient-to-br from-[#0e9246] to-[#467A8f] rounded-lg shadow-2xl border border-gray-200 p-8 text-white">
              <div className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-[#0e9246]" />
                </div>
                
                <h2 className="text-4xl font-bold mb-4">
                  🎉 CONGRATULATIONS! 🎉
                </h2>
                
                <h3 className="text-2xl font-semibold mb-6">
                  You've Completed the Authority Revenue Toolkit!
                </h3>
                
                <p className="text-lg mb-8 opacity-90">
                  You've successfully built a comprehensive business transformation system that will drive sustainable growth, establish your authority, and create lasting impact.
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
                  <div className="bg-white bg-opacity-20 rounded-lg p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <Star className="w-6 h-6 text-[#0e9246]" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Authority Established</h4>
                    <p className="text-sm opacity-90">
                      You're now positioned as a recognized thought leader in your industry with a clear path to continued recognition.
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-20 rounded-lg p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <Crown className="w-6 h-6 text-[#fbae42]" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Legacy Created</h4>
                    <p className="text-sm opacity-90">
                      Your business now creates meaningful impact while building a lasting legacy that extends beyond revenue.
                    </p>
                  </div>

                  <div className="bg-white bg-opacity-20 rounded-lg p-6">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-[#d7df21]" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">Growth Secured</h4>
                    <p className="text-sm opacity-90">
                      You have systems in place for continuous growth, innovation, and adaptation to future challenges.
                    </p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-8">
                  <h4 className="text-xl font-semibold mb-4">🚀 Your Complete Transformation Journey</h4>
                  <div className="grid grid-cols-3 md:grid-cols-9 gap-2 text-xs">
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 1</div>
                      <div>Ideal Client</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 2</div>
                      <div>Content Audit</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 3</div>
                      <div>Channel Audit</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 4</div>
                      <div>Funnel Build</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 5</div>
                      <div>Sales Pipeline</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 6</div>
                      <div>Service Delivery</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 7</div>
                      <div>Performance</div>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded p-2 text-center">
                      <div className="font-semibold">Step 8</div>
                      <div>Team & Scaling</div>
                    </div>
                    <div className="bg-white bg-opacity-40 rounded p-2 text-center border-2 border-white">
                      <div className="font-semibold">Step 9</div>
                      <div>Authority</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#d7df21] bg-opacity-30 rounded-lg p-6 border border-[#d7df21]">
                  <h4 className="font-semibold text-xl mb-3">🔑 Your Success Formula</h4>
                  <p className="text-lg">
                    You now have a complete system that transforms prospects into clients, builds lasting authority, and creates sustainable growth. Your business is no longer dependent on you—it's a legacy that will continue to impact lives and drive success for years to come.
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-2xl font-bold mb-2">Welcome to Your New Reality!</p>
                  <p className="text-lg opacity-90">
                    You're now equipped to build the authority-driven business of your dreams.
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
          STEP 9 OF 9 - FINAL STEP!
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Authority Building & Legacy
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Build lasting authority in your industry while creating a meaningful legacy and positioning yourself for continuous growth and impact.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <Trophy className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 FINAL STEP COMPLETE! You've finished the entire Authority Revenue Toolkit!</p>
              <p className="text-sm text-green-700 mt-1">
                Congratulations! You now have a complete system for building authority and sustainable revenue.
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
                      ? step.id === 4 ? 'border-[#0e9246] bg-green-50' : 'border-[#fbae42] bg-orange-50'
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
                        ? step.id === 4 ? 'bg-[#0e9246] text-white' : 'bg-[#fbae42] text-white'
                        : isUnlocked
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted || (isActive && step.id === 4) ? (
                        step.id === 4 ? <Trophy className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{step.id}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive
                        ? step.id === 4 ? 'text-[#0e9246]' : 'text-[#fbae42]'
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
                    <option value="Authority Establishment">Authority Establishment</option>
                    <option value="Legacy Building">Legacy Building</option>
                    <option value="Continuous Growth">Continuous Growth</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Industry Thought Leadership"
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
          title="AI Authority Building"
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

