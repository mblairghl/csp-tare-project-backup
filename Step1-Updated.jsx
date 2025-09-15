import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, User, Target, Lightbulb, Plus, Sparkles, X, Edit, Trash2 } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import ManualPersonaForm from './ManualPersonaForm';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step1 = () => {
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
  
  // Auto-progression control
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');
  const [editingPersona, setEditingPersona] = useState(null);

  // Persona data
  const [idealClient, setIdealClient] = useState({
    demographics: '',
    psychographics: '',
    painPoints: '',
    goals: '',
    challenges: '',
    values: ''
  });

  // Added personas list
  const [addedPersonas, setAddedPersonas] = useState([]);

  // Manual form data
  const [manualForm, setManualForm] = useState({
    type: '',
    title: '',
    description: '',
    details: ''
  });

  // AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [allAiSuggestions, setAllAiSuggestions] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [aiResult, setAiResult] = useState(null);
  const [selectedPersonasCount, setSelectedPersonasCount] = useState(0);

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
    const savedClient = storageOptimizer.safeGet('step1_ideal_client');
    const savedPersonas = storageOptimizer.safeGet('step1_added_personas');
    
    if (savedClient && typeof savedClient === 'object') {
      setIdealClient(savedClient);
    }
    if (savedPersonas && Array.isArray(savedPersonas)) {
      setAddedPersonas(savedPersonas);
    }
    
    // Reset initial load flag after data is loaded
    setTimeout(() => setIsInitialLoad(false), 100);
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const hasPersonas = addedPersonas.length > 0;
    
    const wasComplete = isStepComplete;
    const nowComplete = hasPersonas; // Only require at least one persona as per video feedback
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [idealClient, addedPersonas, isStepComplete]);

  // Auto-progression logic for sub-steps - ONLY on user actions
  const triggerAutoProgression = () => {
    const hasDemographics = (idealClient.demographics && idealClient.demographics.trim().length > 0) || 
                           addedPersonas.some(p => p.type === 'Demographics' || p.type === 'Create Personas');
    const hasPsychographics = (idealClient.psychographics && idealClient.psychographics.trim().length > 0) || 
                             addedPersonas.some(p => p.type === 'Psychographics' || p.type === 'Create Personas');
    const hasPainPoints = (idealClient.painPoints && idealClient.painPoints.trim().length > 0) || 
                         addedPersonas.some(p => p.type === 'Pain Points' || p.type === 'Create Personas');
    
    // For Step 1, having any personas should count as completion for both demographics and psychographics
    const hasAnyPersonas = addedPersonas.length > 0;
    const finalHasDemographics = hasDemographics || hasAnyPersonas;
    const finalHasPsychographics = hasPsychographics || hasAnyPersonas;
    
    console.log('Manual Auto-progression Trigger:', {
      activeSubStep,
      hasDemographics,
      hasPsychographics,
      hasAnyPersonas,
      finalHasDemographics,
      finalHasPsychographics,
      addedPersonasCount: addedPersonas.length,
      addedPersonasTypes: addedPersonas.map(p => p.type)
    });
    
    const isStepComplete = finalHasDemographics && finalHasPsychographics;
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && finalHasDemographics) {
      console.log('Auto-progressing from Demographics to Psychographics');
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && finalHasPsychographics) {
      console.log('Auto-progressing from Psychographics to Milestone');
      setTimeout(() => setActiveSubStep(3), 500);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleClientChange = (field, value) => {
    const updated = { ...idealClient, [field]: value };
    setIdealClient(updated);
    storageOptimizer.safeSet('step1_ideal_client', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // Manual entry functions
  const openManualModal = (type) => {
    setCurrentModalType(type);
    setEditingPersona(null);
    setManualModalOpen(true);
  };

  const editPersona = (personaId) => {
    const persona = addedPersonas.find(p => p.id === personaId);
    if (persona) {
      setEditingPersona(persona);
      setManualModalOpen(true);
    }
  };

  const handleManualPersonaSave = (personaData) => {
    if (editingPersona) {
      // Update existing persona
      const updated = addedPersonas.map(p => 
        p.id === editingPersona.id ? { ...personaData, id: editingPersona.id } : p
      );
      setAddedPersonas(updated);
      storageOptimizer.safeSet('step1_added_personas', updated);
    } else {
      // Add new persona
      const updated = [...addedPersonas, personaData];
      setAddedPersonas(updated);
      storageOptimizer.safeSet('step1_added_personas', updated);
    }
    
    setEditingPersona(null);
    // Trigger auto-progression check after adding/editing persona
    setTimeout(() => triggerAutoProgression(), 100);
  };

  const deletePersona = (personaId) => {
    const updated = addedPersonas.filter(p => p.id !== personaId);
    setAddedPersonas(updated);
    storageOptimizer.safeSet('step1_added_personas', updated);
    
    // Trigger auto-progression check after deleting persona
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // AI suggestions functions
  const openAiSuggestionsModal = async (type) => {
    setCurrentModalType(type);
    
    // Generate AI suggestions based on type
    const allSuggestions = generateAiSuggestions(type);
    console.log('Generated suggestions for type:', type, allSuggestions);
    setAllAiSuggestions(allSuggestions);
    setCurrentBatch(0);
    
    // Show first 5 suggestions
    const firstBatch = allSuggestions.slice(0, 5);
    setAiSuggestions(firstBatch);
    setAiSuggestionsModalOpen(true);
  };

  const loadMoreSuggestions = () => {
    const nextBatch = currentBatch + 1;
    const startIndex = nextBatch * 5;
    const endIndex = startIndex + 5;
    const nextSuggestions = allAiSuggestions.slice(startIndex, endIndex);
    
    if (nextSuggestions.length > 0) {
      setAiSuggestions(prev => [...prev, ...nextSuggestions]);
      setCurrentBatch(nextBatch);
    }
  };

  const hasMoreSuggestions = () => {
    const nextStartIndex = (currentBatch + 1) * 5;
    return nextStartIndex < allAiSuggestions.length;
  };

  const generateAiSuggestions = (type) => {
    // Map the button types to the suggestion key
    const typeMapping = {
      'Demographics': 'Create Personas',
      'Psychographics': 'Create Personas',
      'Create Personas': 'Create Personas'
    };
    
    const mappedType = typeMapping[type] || type;
    console.log('Type mapping:', type, '->', mappedType);
    
    const suggestionsByType = {
      'Create Personas': [
        { 
          id: 1, 
          title: 'The Ambitious Service Provider', 
          description: 'Established consultants/coaches earning $250K-$500K annually seeking authority positioning',
          summary: 'Mid-tier service providers ready to break into thought leadership',
          keyBehaviors: 'LinkedIn daily (7-9am), X/Twitter 3x/week, industry Facebook groups, consumes content during commute',
          platformPreferences: 'LinkedIn (primary), X/Twitter (engagement), Industry Facebook groups (networking)',
          motivations: 'Recognition as industry expert, predictable revenue growth, work-life balance, premium positioning',
          frustrations: '"I wish someone would just help me stand out from all the other consultants in my space"',
          needs: 'Automated lead qualification, content creation systems, authority building frameworks',
          favoriteBrands: 'HubSpot, ConvertKit, Calendly, industry thought leaders',
          buyingTriggers: 'Authority building case studies, premium positioning examples, thought leadership frameworks',
          contentResonance: 'Client success stories, industry insights, behind-the-scenes content, strategic frameworks',
          unmetNeeds: 'Systematic authority building, differentiation strategies, premium client attraction systems'
        },
        { 
          id: 2, 
          title: 'The Corporate Escapist', 
          description: 'Senior executives (40-55) planning transition to entrepreneurship',
          summary: 'High-level corporate professionals seeking entrepreneurial transition',
          keyBehaviors: 'LinkedIn lurker, Reddit researcher (r/entrepreneur), research-heavy (evenings/weekends), cautious decision-maker',
          platformPreferences: 'LinkedIn (professional networking), Reddit (research), industry publications',
          motivations: 'Financial security during transition, leveraging existing network, maintaining lifestyle',
          frustrations: '"I wish someone would just show me how to leverage my corporate experience into a consulting business"',
          needs: 'Transition timeline guidance, network monetization strategies, corporate-to-consultant positioning',
          favoriteBrands: 'McKinsey, Deloitte, Harvard Business Review, industry-specific tools',
          buyingTriggers: 'Step-by-step roadmaps, risk mitigation strategies, success story validation',
          contentResonance: 'Transition case studies, risk management content, network leveraging strategies',
          unmetNeeds: 'Corporate experience packaging, transition risk mitigation, network monetization systems'
        },
        { 
          id: 3, 
          title: 'The Tech Founder Seeking Authority', 
          description: 'SaaS/tech entrepreneurs with $1M+ ARR wanting thought leadership',
          summary: 'Successful tech founders ready to build industry authority',
          keyBehaviors: 'X/Twitter daily, Product Hunt active, Hacker News reader, early adopter, shares industry insights',
          platformPreferences: 'X/Twitter (primary), Product Hunt (launches), Hacker News (discussions), tech forums',
          motivations: 'Industry recognition, speaking opportunities, premium pricing power, thought leadership',
          frustrations: '"I wish someone would just help me become the go-to voice in my industry instead of just another SaaS founder"',
          needs: 'Content amplification systems, speaking opportunity pipelines, industry positioning strategies',
          favoriteBrands: 'Y Combinator, Stripe, Notion, industry-specific SaaS tools',
          buyingTriggers: 'Data-driven results, industry case studies, tech community validation',
          contentResonance: 'Industry insights, data-driven content, tech trends, innovation stories',
          unmetNeeds: 'Industry voice development, speaking circuit access, tech authority positioning'
        }
      ]
    };
    
    return suggestionsByType[mappedType] || [];
  };

  const addAiSuggestion = (suggestion) => {
    const personaData = {
      id: `persona_ai_${Date.now()}`,
      type: 'Create Personas',
      source: 'ai',
      title: suggestion.title,
      description: suggestion.description,
      summary: suggestion.summary,
      keyBehaviors: suggestion.keyBehaviors,
      platformPreferences: suggestion.platformPreferences,
      motivations: suggestion.motivations,
      frustrations: suggestion.frustrations,
      favoriteBrands: suggestion.favoriteBrands,
      buyingTriggers: suggestion.buyingTriggers,
      contentResonance: suggestion.contentResonance,
      unmetNeeds: suggestion.unmetNeeds
    };

    const updated = [...addedPersonas, personaData];
    setAddedPersonas(updated);
    storageOptimizer.safeSet('step1_added_personas', updated);
    
    // Trigger auto-progression check after adding AI suggestion
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // Sub-step definitions
  const subSteps = [
    {
      id: 1,
      title: 'Create Personas',
      description: 'Define your ideal client personas',
      isComplete: addedPersonas.length > 0
    },
    {
      id: 2,
      title: 'Manual Refinement',
      description: 'Review and refine your personas',
      isComplete: addedPersonas.length > 0
    },
    {
      id: 3,
      title: 'Milestone Reflection',
      description: 'Reflect on your ideal client definition',
      isComplete: isStepComplete
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">STEP 1 OF 9</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ideal Client Refinement</h1>
          <p className="text-lg text-gray-600">
            Define and refine your ideal client personas to create targeted, effective authority-building content and strategies.
          </p>
        </div>

        {/* Completion Status */}
        {isStepComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <h3 className="font-semibold text-green-900">🎉 Step 1 Complete! Your ideal client is defined.</h3>
                <p className="text-green-800 text-sm">
                  You now have a clear understanding of who you serve best and can create targeted messaging.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How This Step Works */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold">?</span>
              </div>
              <span className="font-semibold text-gray-900">How This Step Works</span>
            </div>
            <div className="text-orange-600">
              <span className="text-sm mr-2">Expand</span>
              {isHowThisWorksOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {/* Action Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Steps</h2>
          <p className="text-gray-600 mb-6">Complete all Action Steps below before moving to the next Step page.</p>
          
          {/* Sub-step Navigation */}
          <div className="flex space-x-4 mb-8">
            {subSteps.map((subStep) => (
              <button
                key={subStep.id}
                onClick={() => setActiveSubStep(subStep.id)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  activeSubStep === subStep.id
                    ? 'border-green-500 bg-green-50'
                    : subStep.isComplete
                    ? 'border-green-300 bg-green-25'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    subStep.isComplete
                      ? 'bg-green-600 text-white'
                      : activeSubStep === subStep.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {subStep.isComplete ? <CheckCircle2 className="w-4 h-4" /> : subStep.id}
                  </div>
                  {subStep.isComplete && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div className={`text-left ${
                  activeSubStep === subStep.id ? 'text-green-900' : 'text-gray-900'
                }`}>
                  <div className="font-semibold">{subStep.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {activeSubStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Ideal Client Personas</h3>
            <p className="text-gray-600 mb-6">
              Build detailed personas of your ideal clients to guide your authority-building strategy. You can create personas manually or use our AI research tool.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => openManualModal('Create Personas')}
                className="flex items-center px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Manual Entry
              </button>
              <button
                onClick={() => openAiSuggestionsModal('Create Personas')}
                className="flex items-center px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                🧠 Get AI Ideas
              </button>
            </div>

            {/* Added Personas */}
            {addedPersonas.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Your Personas ({addedPersonas.length})</h4>
                <div className="space-y-4">
                  {addedPersonas.map((persona) => (
                    <div key={persona.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-900">{persona.title}</h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              persona.source === 'ai' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {persona.source === 'ai' ? 'AI Research-Based' : 'Manual Entry'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{persona.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editPersona(persona.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit persona"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePersona(persona.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete persona"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Persona Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {persona.keyBehaviors && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">🎯 Key Behaviors</h6>
                            <p className="text-gray-600">{persona.keyBehaviors}</p>
                          </div>
                        )}
                        {persona.favoriteBrands && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">🛍️ Favorite Brands</h6>
                            <p className="text-gray-600">{persona.favoriteBrands}</p>
                          </div>
                        )}
                        {persona.platformPreferences && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">📱 Platform Preferences</h6>
                            <p className="text-gray-600">{persona.platformPreferences}</p>
                          </div>
                        )}
                        {persona.buyingTriggers && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">⚡ Buying Triggers</h6>
                            <p className="text-gray-600">{persona.buyingTriggers}</p>
                          </div>
                        )}
                        {persona.motivations && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">💭 Motivations</h6>
                            <p className="text-gray-600">{persona.motivations}</p>
                          </div>
                        )}
                        {persona.contentResonance && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">📈 Content Resonance</h6>
                            <p className="text-gray-600">{persona.contentResonance}</p>
                          </div>
                        )}
                        {persona.frustrations && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">😤 Frustrations</h6>
                            <p className="text-gray-600">{persona.frustrations}</p>
                          </div>
                        )}
                        {persona.unmetNeeds && (
                          <div>
                            <h6 className="font-medium text-gray-900 mb-1">🔍 Unmet Needs</h6>
                            <p className="text-gray-600">{persona.unmetNeeds}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Refinement</h3>
            <p className="text-gray-600 mb-6">
              Review and refine your personas. You can edit any details, platform preferences, or other information to better match your ideal clients.
            </p>

            {addedPersonas.length > 0 ? (
              <div className="space-y-4">
                {addedPersonas.map((persona) => (
                  <div key={persona.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-900">{persona.title}</h5>
                        <p className="text-gray-600 text-sm mt-1">{persona.description}</p>
                      </div>
                      <button
                        onClick={() => editPersona(persona.id)}
                        className="px-4 py-2 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No personas created yet. Go back to Step 1 to create your first persona.</p>
                <button
                  onClick={() => setActiveSubStep(1)}
                  className="px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] transition-colors"
                >
                  Create Personas
                </button>
              </div>
            )}
          </div>
        )}

        {activeSubStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestone Reflection</h3>
            <p className="text-gray-600 mb-6">
              Congratulations! You've defined your ideal client personas. Take a moment to reflect on what you've learned.
            </p>

            {isStepComplete ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">✅ Step 1 Complete!</h4>
                <p className="text-green-800 text-sm mb-4">
                  You now have a clear understanding of who you serve best and can create targeted messaging that resonates with your ideal clients.
                </p>
                <div className="text-sm text-green-700">
                  <strong>What you've accomplished:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Created {addedPersonas.length} detailed client persona{addedPersonas.length !== 1 ? 's' : ''}</li>
                    <li>Identified key behaviors and platform preferences</li>
                    <li>Understood motivations and frustrations</li>
                    <li>Mapped out buying triggers and content preferences</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Almost There!</h4>
                <p className="text-yellow-800 text-sm">
                  Complete the previous steps to finish your ideal client definition.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <ManualPersonaForm
          isOpen={manualModalOpen}
          onClose={() => {
            setManualModalOpen(false);
            setEditingPersona(null);
          }}
          onSave={handleManualPersonaSave}
          editingPersona={editingPersona}
        />

        {/* AI Suggestions Modal */}
        {aiSuggestionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">AI Persona Suggestions</h2>
                <button
                  onClick={() => setAiSuggestionsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Select personas that match your ideal clients. You can add multiple personas and edit them later.
                </p>

                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                        </div>
                        <button
                          onClick={() => addAiSuggestion(suggestion)}
                          className="px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] transition-colors"
                        >
                          Add This Persona
                        </button>
                      </div>

                      {/* Preview of persona details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <h6 className="font-medium text-gray-900 mb-1">🎯 Key Behaviors</h6>
                          <p className="text-gray-600">{suggestion.keyBehaviors}</p>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-900 mb-1">💭 Motivations</h6>
                          <p className="text-gray-600">{suggestion.motivations}</p>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-900 mb-1">😤 Frustrations</h6>
                          <p className="text-gray-600">{suggestion.frustrations}</p>
                        </div>
                        <div>
                          <h6 className="font-medium text-gray-900 mb-1">⚡ Buying Triggers</h6>
                          <p className="text-gray-600">{suggestion.buyingTriggers}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreSuggestions() && (
                  <div className="text-center mt-6">
                    <button
                      onClick={loadMoreSuggestions}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Load More Suggestions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step Footer */}
        <StepFooter
          currentStep={1}
          isStepComplete={isStepComplete}
          completionMessage="Complete all sub-steps to continue"
        />
      </div>
    </div>
  );
};

export default Step1;

