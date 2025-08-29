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
    const clientComplete = Object.values(idealClient).every(value => value && value.trim().length > 0);
    const hasPersonas = addedPersonas.length > 0;
    
    const wasComplete = isStepComplete;
    const nowComplete = clientComplete && hasPersonas;
    
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
    
    console.log('Manual Auto-progression Trigger:', {
      activeSubStep,
      hasDemographics,
      hasPsychographics,
      hasPainPoints,
      addedPersonasCount: addedPersonas.length
    });
    
    const isStepComplete = hasDemographics && hasPsychographics;
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasDemographics) {
      console.log('Auto-progressing from Demographics to Psychographics');
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasPsychographics) {
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
        },
        { 
          id: 4, 
          title: 'The Overwhelmed Agency Owner', 
          description: 'Digital marketing agency owners ($500K-$2M revenue) drowning in client work',
          summary: 'Successful agency owners seeking premium positioning and client attraction',
          keyBehaviors: 'Facebook groups (agency-focused), LinkedIn sporadically, time-starved, values peer recommendations',
          platformPreferences: 'Facebook groups (agency communities), LinkedIn (professional), industry forums',
          motivations: 'Predictable client pipeline, premium pricing, reduced sales effort, work-life balance',
          frustrations: '"I wish someone would just create a system that positions me as the expert so clients come to me instead of me chasing them"',
          needs: 'Inbound lead systems, premium positioning frameworks, client education processes',
          favoriteBrands: 'Agency management tools, CRM systems, marketing automation platforms',
          buyingTriggers: 'Time-saving solutions, client retention strategies, premium positioning examples',
          contentResonance: 'Agency growth strategies, client success stories, efficiency systems, premium positioning',
          unmetNeeds: 'Inbound client attraction, premium positioning systems, authority-based marketing'
        },
        { 
          id: 5, 
          title: 'The Expert Practitioner', 
          description: 'Industry specialists (lawyers, doctors, CPAs) wanting to expand beyond practice',
          summary: 'Professional service providers seeking expertise monetization',
          keyBehaviors: 'Industry forums, LinkedIn professional groups, risk-averse, values professional reputation',
          platformPreferences: 'LinkedIn (professional networking), industry-specific forums, trade publications',
          motivations: 'Diversified revenue streams, industry influence, legacy building, professional recognition',
          frustrations: '"I wish someone would just show me how to package my expertise into scalable offerings without compromising my practice"',
          needs: 'Expertise packaging systems, compliance-friendly marketing, professional authority building',
          favoriteBrands: 'Professional associations, industry-specific software, continuing education providers',
          buyingTriggers: 'Compliance considerations, professional reputation protection, peer validation',
          contentResonance: 'Professional development, industry insights, ethical considerations, expertise showcases',
          unmetNeeds: 'Expertise packaging, scalable offering development, professional authority systems'
        },
        { 
          id: 6, 
          title: 'The Course Creator Plateau', 
          description: 'Online educators earning $100K-$300K seeking next level growth',
          summary: 'Established course creators ready for authority positioning and scale',
          keyBehaviors: 'YouTube creator, Instagram educator, Facebook group host, content creator, community builder',
          platformPreferences: 'YouTube (content), Instagram (education), Facebook groups (community), email lists',
          motivations: 'Revenue breakthrough, industry recognition, sustainable growth, authority positioning',
          frustrations: '"I wish someone would just help me break through this revenue ceiling and become a recognized authority in my space"',
          needs: 'Authority positioning systems, premium offering development, industry recognition strategies',
          favoriteBrands: 'Course platforms, email marketing tools, community platforms, content creation tools',
          buyingTriggers: 'Growth case studies, authority positioning examples, scale strategies',
          contentResonance: 'Growth strategies, authority building, premium positioning, scale systems',
          unmetNeeds: 'Revenue ceiling breakthrough, authority positioning, premium offering development'
        },
        { 
          id: 7, 
          title: 'The B2B Sales Leader Turned Consultant', 
          description: 'Former VP Sales/CROs launching consulting practices',
          summary: 'Senior sales executives transitioning to high-value consulting',
          keyBehaviors: 'LinkedIn heavy user, Sales Navigator power user, network-focused, relationship-driven',
          platformPreferences: 'LinkedIn (primary), Sales Navigator (prospecting), industry events, B2B forums',
          motivations: 'Industry expertise recognition, high-value client attraction, premium consulting rates',
          frustrations: '"I wish someone would just help me position myself as THE sales transformation expert instead of just another consultant"',
          needs: 'B2B authority positioning, enterprise client attraction, sales expertise packaging',
          favoriteBrands: 'Salesforce, HubSpot, LinkedIn Sales Navigator, sales methodology providers',
          buyingTriggers: 'B2B credibility, enterprise case studies, sales transformation examples',
          contentResonance: 'Sales transformation, B2B strategies, enterprise solutions, revenue optimization',
          unmetNeeds: 'B2B authority establishment, enterprise client systems, sales expertise positioning'
        },
        { 
          id: 8, 
          title: 'The Niche Market Dominator', 
          description: 'Specialists serving specific industries (healthcare, legal, finance)',
          summary: 'Industry specialists seeking niche market leadership',
          keyBehaviors: 'Industry-specific forums, trade publication comments, deep industry focus, values specialization',
          platformPreferences: 'Industry forums, trade publications, professional associations, niche communities',
          motivations: 'Niche market leadership, premium pricing power, industry influence, specialization recognition',
          frustrations: '"I wish someone would just help me become THE recognized expert in my niche instead of competing with generalists"',
          needs: 'Niche authority building, industry positioning strategies, specialized content frameworks',
          favoriteBrands: 'Industry-specific software, trade publications, professional associations, niche tools',
          buyingTriggers: 'Niche-specific case studies, industry credibility, specialization examples',
          contentResonance: 'Industry insights, specialized solutions, niche expertise, regulatory updates',
          unmetNeeds: 'Niche authority systems, industry positioning, specialized expertise packaging'
        },
        { 
          id: 9, 
          title: 'The International Expansion Seeker', 
          description: 'Successful domestic consultants wanting global reach',
          summary: 'Established consultants ready for international market expansion',
          keyBehaviors: 'International LinkedIn groups, global industry forums, globally minded, values cultural adaptation',
          platformPreferences: 'LinkedIn (international), global forums, international events, cross-cultural platforms',
          motivations: 'Global market penetration, international recognition, diversified revenue streams',
          frustrations: '"I wish someone would just show me how to establish authority in international markets without starting from scratch"',
          needs: 'International authority building, global market entry strategies, cross-cultural positioning',
          favoriteBrands: 'Global consulting firms, international business tools, cross-cultural training providers',
          buyingTriggers: 'Global case studies, international credibility building, market entry examples',
          contentResonance: 'Global strategies, cultural insights, international business, market expansion',
          unmetNeeds: 'International authority systems, global market entry, cross-cultural positioning'
        },
        { 
          id: 10, 
          title: 'The Acquisition Target Builder', 
          description: 'Entrepreneurs building businesses for eventual sale/acquisition',
          summary: 'Strategic business builders focused on acquisition readiness',
          keyBehaviors: 'M&A forums, business broker networks, industry publications, strategic thinker, long-term focused',
          platformPreferences: 'M&A forums, business networks, industry publications, investor communities',
          motivations: 'Business valuation increase, acquisition attractiveness, strategic positioning, exit planning',
          frustrations: '"I wish someone would just help me build the kind of authority that makes my business an attractive acquisition target"',
          needs: 'Authority-driven valuation strategies, acquisition positioning, strategic market building',
          favoriteBrands: 'Business valuation firms, M&A advisors, strategic consulting firms, exit planning services',
          buyingTriggers: 'Valuation impact, acquisition case studies, exit strategy examples',
          contentResonance: 'Business valuation, acquisition strategies, market positioning, exit planning',
          unmetNeeds: 'Authority-driven valuation, acquisition positioning, strategic market development'
        },
        { 
          id: 11, 
          title: 'The Speaking Circuit Aspirant', 
          description: 'Experts wanting to monetize speaking and build authority through events',
          summary: 'Subject matter experts seeking speaking authority and event monetization',
          keyBehaviors: 'Event industry groups, speaker bureaus, conference organizer networks, event-focused, values stage presence',
          platformPreferences: 'Speaker bureaus, event platforms, conference networks, professional speaking associations',
          motivations: 'Speaking fee optimization, event authority, industry recognition, thought leadership',
          frustrations: '"I wish someone would just create a system that gets me booked at premium speaking events consistently"',
          needs: 'Speaking opportunity pipelines, keynote positioning, event authority building',
          favoriteBrands: 'Speaker bureaus, event management platforms, presentation tools, speaking coaches',
          buyingTriggers: 'Speaking fee increases, event booking success, keynote examples',
          contentResonance: 'Speaking strategies, event insights, presentation skills, thought leadership',
          unmetNeeds: 'Speaking pipeline systems, keynote positioning, event authority development'
        },
        { 
          id: 12, 
          title: 'The Media Authority Builder', 
          description: 'Professionals seeking media coverage and industry recognition',
          summary: 'Experts focused on media authority and journalist relationships',
          keyBehaviors: 'Media monitoring tools, journalist networks, PR industry groups, media-conscious, seeks publicity opportunities',
          platformPreferences: 'Media platforms, journalist networks, PR tools, industry publications',
          motivations: 'Media coverage, expert recognition, industry influence, thought leadership positioning',
          frustrations: '"I wish someone would just help me become the go-to expert that journalists call for quotes and interviews"',
          needs: 'Media relationship building, expert positioning systems, journalist outreach strategies',
          favoriteBrands: 'PR agencies, media monitoring tools, journalist databases, expert positioning services',
          buyingTriggers: 'Media coverage examples, PR success stories, expert positioning case studies',
          contentResonance: 'Media strategies, expert positioning, journalist relationships, thought leadership',
          unmetNeeds: 'Media authority systems, journalist relationship building, expert positioning frameworks'
        }
      ]
    };
    
    return suggestionsByType[mappedType] || [];
  };

  const addAiSuggestion = (suggestion) => {
    const newPersona = {
      id: Date.now(),
      type: currentModalType,
      title: suggestion.title,
      description: suggestion.description,
      summary: suggestion.summary,
      keyBehaviors: suggestion.keyBehaviors,
      platformPreferences: suggestion.platformPreferences,
      motivations: suggestion.motivations,
      frustrations: suggestion.frustrations,
      needs: suggestion.needs,
      favoriteBrands: suggestion.favoriteBrands,
      buyingTriggers: suggestion.buyingTriggers,
      contentResonance: suggestion.contentResonance,
      unmetNeeds: suggestion.unmetNeeds,
      source: 'ai'
    };
    
    const updated = [...addedPersonas, newPersona];
    setAddedPersonas(updated);
    storageOptimizer.safeSet('step1_added_personas', updated);
    
    // Update selected count
    setSelectedPersonasCount(prev => prev + 1);
    
    // Remove suggestion from current display and all suggestions
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    setAllAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Trigger auto-progression check after adding AI suggestion
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateIdealClient();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating ideal client:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    setIdealClient(prev => ({ ...prev, ...content }));
    storageOptimizer.safeSet('step1_ideal_client', { ...idealClient, ...content });
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    title: "How This Step Works",
    description: "Follow these Action Steps to define your ideal client and create targeted messaging that resonates with your perfect customers.",
    steps: [
      {
        title: "Create Personas",
        description: "Define your ideal client's demographics, characteristics, and basic profile using manual entry or AI suggestions.",
        color: "bg-[#fbae42]"
      },
      {
        title: "Manual Refinement", 
        description: "Dive deeper into their psychographics, mindset, values, and behavioral patterns that drive decisions.",
        color: "bg-[#0e9246]"
      },
      {
        title: "Milestone Reflection",
        description: "Review your completed client profile and celebrate your progress before moving to Step 2.",
        color: "bg-[#467a8f]"
      }
    ]
  };

  // Completion logic
  const hasDemographics = (idealClient.demographics && idealClient.demographics.trim().length > 0) || 
                         addedPersonas.some(p => p.type === 'Demographics');
  const hasPsychographics = (idealClient.psychographics && idealClient.psychographics.trim().length > 0) || 
                           addedPersonas.some(p => p.type === 'Psychographics');
  const hasPainPoints = (idealClient.painPoints && idealClient.painPoints.trim().length > 0) || 
                       addedPersonas.some(p => p.type === 'Pain Points');

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasDemographics; // Unlocked when personas created
      case 3: return hasDemographics && hasPsychographics; // Unlocked when refinement complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Create Personas', icon: User },
    { id: 2, title: 'Manual Refinement', icon: Target },
    { id: 3, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Personas</h3>
              <p className="text-gray-600 mb-6">
                Define your ideal client personas using manual entry or AI-powered research to create detailed client profiles.
              </p>

              <div className="space-y-6">
                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Demographics')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Demographics')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Research
                  </button>
                </div>

                {/* Added Demographics */}
                {addedPersonas.filter(p => p.type === 'Demographics').map((persona) => (
                  <div key={persona.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{persona.title}</h4>
                        <p className="text-gray-600 mt-1 font-medium">{persona.description}</p>
                        {persona.summary && (
                          <p className="text-sm text-gray-500 mt-2 italic">{persona.summary}</p>
                        )}
                        <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {persona.source === 'ai' ? '🤖 AI Research-Based' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editPersona(persona.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePersona(persona.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Full AI Details */}
                    {persona.source === 'ai' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-3">
                          {persona.keyBehaviors && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">🎯 Key Behaviors</h5>
                              <p className="text-gray-600 text-sm">{persona.keyBehaviors}</p>
                            </div>
                          )}
                          
                          {persona.platformPreferences && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">📱 Platform Preferences</h5>
                              <p className="text-gray-600 text-sm">{persona.platformPreferences}</p>
                            </div>
                          )}
                          
                          {persona.motivations && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">💭 Motivations</h5>
                              <p className="text-gray-600 text-sm">{persona.motivations}</p>
                            </div>
                          )}
                          
                          {persona.frustrations && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">😤 Frustrations</h5>
                              <p className="text-gray-600 text-sm italic">{persona.frustrations}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {persona.favoriteBrands && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">🛍️ Favorite Brands</h5>
                              <p className="text-gray-600 text-sm">{persona.favoriteBrands}</p>
                            </div>
                          )}
                          
                          {persona.buyingTriggers && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">⚡ Buying Triggers</h5>
                              <p className="text-gray-600 text-sm">{persona.buyingTriggers}</p>
                            </div>
                          )}
                          
                          {persona.contentResonance && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">📈 Content Resonance</h5>
                              <p className="text-gray-600 text-sm">{persona.contentResonance}</p>
                            </div>
                          )}
                          
                          {persona.unmetNeeds && (
                            <div>
                              <h5 className="font-semibold text-gray-800 text-sm mb-1">🔍 Unmet Needs</h5>
                              <p className="text-gray-600 text-sm font-medium text-red-600">{persona.unmetNeeds}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Manual Entry Details */}
                    {persona.source === 'manual' && persona.details && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">{persona.details}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasDemographics && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Demographics Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to psychographics.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Refine Personas</h3>
              <p className="text-gray-600 mb-6">
                Review and refine the personas you created in Step 1. Add additional details, edit existing information, or remove personas that don't fit your ideal client profile.
              </p>

              <div className="space-y-6">
                {/* Show all personas from Step 1 for refinement */}
                {addedPersonas.length > 0 ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-2">📝 Persona Refinement</h4>
                      <p className="text-blue-800 text-sm">
                        Below are the personas you created in Step 1. You can edit, delete, or add more details to each persona to better define your ideal client profile.
                      </p>
                    </div>

                    {addedPersonas.map((persona) => (
                      <div key={persona.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900">{persona.title}</h4>
                            <p className="text-gray-600 mt-1 font-medium">{persona.description}</p>
                            {persona.summary && (
                              <p className="text-sm text-gray-500 mt-2 italic">{persona.summary}</p>
                            )}
                            <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              {persona.source === 'ai' ? '🤖 AI Research-Based' : '✏️ Manual Entry'}
                            </span>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => editPersona(persona.id)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit Persona"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deletePersona(persona.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete Persona"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Full AI Details */}
                        {persona.source === 'ai' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-3">
                              {persona.keyBehaviors && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">🎯 Key Behaviors</h5>
                                  <p className="text-gray-600 text-sm">{persona.keyBehaviors}</p>
                                </div>
                              )}
                              
                              {persona.platformPreferences && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">📱 Platform Preferences</h5>
                                  <p className="text-gray-600 text-sm">{persona.platformPreferences}</p>
                                </div>
                              )}
                              
                              {persona.motivations && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">💭 Motivations</h5>
                                  <p className="text-gray-600 text-sm">{persona.motivations}</p>
                                </div>
                              )}
                              
                              {persona.frustrations && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">😤 Frustrations</h5>
                                  <p className="text-gray-600 text-sm italic">{persona.frustrations}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {persona.favoriteBrands && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">🛍️ Favorite Brands</h5>
                                  <p className="text-gray-600 text-sm">{persona.favoriteBrands}</p>
                                </div>
                              )}
                              
                              {persona.buyingTriggers && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">⚡ Buying Triggers</h5>
                                  <p className="text-gray-600 text-sm">{persona.buyingTriggers}</p>
                                </div>
                              )}
                              
                              {persona.contentResonance && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">📈 Content Resonance</h5>
                                  <p className="text-gray-600 text-sm">{persona.contentResonance}</p>
                                </div>
                              )}
                              
                              {persona.unmetNeeds && (
                                <div>
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">🔍 Unmet Needs</h5>
                                  <p className="text-gray-600 text-sm font-medium text-red-600">{persona.unmetNeeds}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Manual Entry Details */}
                        {persona.source === 'manual' && (
                          <div className="mt-4 space-y-4">
                            {/* Show all manual persona fields similar to AI personas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="space-y-3">
                                {persona.keyBehaviors && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">🎯 Key Behaviors</h5>
                                    <p className="text-gray-600 text-sm">{persona.keyBehaviors}</p>
                                  </div>
                                )}
                                
                                {persona.platformPreferences && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">📱 Platform Preferences</h5>
                                    <p className="text-gray-600 text-sm">{persona.platformPreferences}</p>
                                  </div>
                                )}
                                
                                {persona.motivations && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">💭 Motivations</h5>
                                    <p className="text-gray-600 text-sm">{persona.motivations}</p>
                                  </div>
                                )}
                                
                                {persona.frustrations && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">😤 Frustrations</h5>
                                    <p className="text-gray-600 text-sm italic">{persona.frustrations}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                {persona.favoriteBrands && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">🛍️ Favorite Brands</h5>
                                    <p className="text-gray-600 text-sm">{persona.favoriteBrands}</p>
                                  </div>
                                )}
                                
                                {persona.buyingTriggers && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">⚡ Buying Triggers</h5>
                                    <p className="text-gray-600 text-sm">{persona.buyingTriggers}</p>
                                  </div>
                                )}
                                
                                {persona.contentResonance && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">📈 Content Resonance</h5>
                                    <p className="text-gray-600 text-sm">{persona.contentResonance}</p>
                                  </div>
                                )}
                                
                                {persona.unmetNeeds && (
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm mb-1">🔍 Unmet Needs</h5>
                                    <p className="text-gray-600 text-sm font-medium text-red-600">{persona.unmetNeeds}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Additional Details */}
                            {persona.details && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h5 className="font-semibold text-blue-800 text-sm mb-2">📄 Document Content & Additional Details</h5>
                                <div className="text-blue-700 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                                  {persona.details}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No Personas Created Yet</h4>
                    <p className="text-gray-600 mb-6">Go back to Step 1 to create your first persona, then return here to refine it.</p>
                    <button
                      onClick={() => setActiveSubStep(1)}
                      className="px-6 py-3 bg-[#0e9246] text-white rounded-md hover:bg-[#0c7a3a] font-medium transition-colors duration-200"
                    >
                      Go to Step 1
                    </button>
                  </div>
                )}
              </div>

              {addedPersonas.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Personas Ready for Refinement!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    You have {addedPersonas.length} persona{addedPersonas.length !== 1 ? 's' : ''} ready to refine. Edit any details above to perfect your ideal client profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        // Trigger confetti when Sub Step 3 opens
        React.useEffect(() => {
          if (activeSubStep === 3) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        }, [activeSubStep]);

        return (
          <div className="space-y-6">
            {showConfetti && activeSubStep === 3 && (
              <Confetti
                width={windowDimensions.width}
                height={windowDimensions.height}
                recycle={false}
                numberOfPieces={200}
                gravity={0.3}
              />
            )}
            
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Step 1 Milestone Celebration!</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0e9246] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Congratulations! 🎊</h4>
                    <p className="text-gray-600">You've completed your Ideal Client Persona foundation!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🎯 What You've Accomplished:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Created detailed client personas</li>
                      <li>✅ Identified behavioral patterns and motivations</li>
                      <li>✅ Refined target audience understanding</li>
                      <li>✅ Built comprehensive client profiles</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🚀 How This Impacts Your Success:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>📈 <strong>Step 2:</strong> Personas guide content strategy creation</li>
                      <li>🎯 <strong>Step 3:</strong> Target audience informs lead generation</li>
                      <li>📧 <strong>Step 4:</strong> Client insights shape sales funnels</li>
                      <li>🏗️ <strong>CSP Setup:</strong> Persona data drives automation targeting</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">🔗 Building Your Authority Foundation:</h5>
                  <p className="text-blue-800 text-sm">
                    Your ideal client personas from this step become the cornerstone of everything ahead. Combined with your Project Setup data, these personas will guide content creation, lead generation strategies, and personalized automation sequences. Every message, offer, and touchpoint will now speak directly to your ideal clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Please complete the previous steps to unlock this section.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 1 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Ideal Client Refinement
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Define and refine your ideal client personas to create targeted, effective authority-building content and strategies.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 1 Complete! Your ideal client is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a clear understanding of who you serve best and can create targeted messaging.
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
        
        <div className="bg-[#467a8f] bg-opacity-10 rounded-lg shadow-lg border border-[#467a8f] border-opacity-20 mb-8 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
          <div className="flex flex-wrap">
            {subSteps.map((step, index) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = step.id < 3 ? (
                step.id === 1 ? hasDemographics :
                step.id === 2 ? hasPsychographics : false
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
                      ? 'border-transparent hover:border-gray-300 hover:bg-white hover:bg-opacity-50'
                      : 'border-transparent bg-transparent'
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

        {/* Manual Persona Form Modal */}
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
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h3 className="text-lg font-semibold">🤖 AI Research-Based Personas</h3>
                  <p className="text-sm text-gray-600 mt-1">Based on digital anthropology research across social platforms, forums, and review sites</p>
                </div>
                <button
                  onClick={() => setAiSuggestionsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900">{suggestion.title}</h4>
                          <p className="text-gray-600 mt-1 font-medium">{suggestion.description}</p>
                          <p className="text-sm text-gray-500 mt-2 italic">{suggestion.summary}</p>
                        </div>
                        <button
                          onClick={() => addAiSuggestion(suggestion)}
                          className="ml-4 px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          Add Persona
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">🎯 Key Behaviors</h5>
                            <p className="text-gray-600 text-sm">{suggestion.keyBehaviors}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">📱 Platform Preferences</h5>
                            <p className="text-gray-600 text-sm">{suggestion.platformPreferences}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">💭 Motivations</h5>
                            <p className="text-gray-600 text-sm">{suggestion.motivations}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">😤 Frustrations</h5>
                            <p className="text-gray-600 text-sm italic">{suggestion.frustrations}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">🛍️ Favorite Brands</h5>
                            <p className="text-gray-600 text-sm">{suggestion.favoriteBrands}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">⚡ Buying Triggers</h5>
                            <p className="text-gray-600 text-sm">{suggestion.buyingTriggers}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">📈 Content Resonance</h5>
                            <p className="text-gray-600 text-sm">{suggestion.contentResonance}</p>
                          </div>
                          
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm mb-1">🔍 Unmet Needs</h5>
                            <p className="text-gray-600 text-sm font-medium text-red-600">{suggestion.unmetNeeds}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {aiSuggestions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="font-semibold text-green-900 mb-2">🎉 All Personas Added!</h4>
                        <p className="text-green-800">You've selected all available AI-generated personas. Close this modal to continue with your ideal client refinement.</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Requirement Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📋 Selection Requirement</h4>
                  <p className="text-blue-800 text-sm">
                    <strong>Minimum 1 persona required.</strong> You've selected {selectedPersonasCount} persona{selectedPersonasCount !== 1 ? 's' : ''}. You can choose more personas for a more comprehensive client profile.
                  </p>
                </div>
                
                {/* Modal Buttons */}
                <div className="mt-6 flex gap-3 justify-between">
                  <div>
                    {hasMoreSuggestions() && (
                      <button
                        onClick={loadMoreSuggestions}
                        className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        More Ideas
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setAiSuggestionsModalOpen(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI Ideal Client Profile"
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
          currentStep={1}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step1;

