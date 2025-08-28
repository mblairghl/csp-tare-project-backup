import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Users, TrendingUp, Settings, Plus, Sparkles, X, Edit, Trash2 } from 'lucide-react';
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

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

  // Lead source data
  const [currentSources, setCurrentSources] = useState([]);
  const [expansionOpportunities, setExpansionOpportunities] = useState([]);
  const [cspSetup, setCspSetup] = useState({
    leadScoring: '',
    automationRules: '',
    integrations: '',
    reportingSetup: ''
  });

  // Added lead items list
  const [addedLeadItems, setAddedLeadItems] = useState([]);

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
    const savedSources = storageOptimizer.safeGet('step3_current_sources');
    const savedOpportunities = storageOptimizer.safeGet('step3_expansion_opportunities');
    const savedSetup = storageOptimizer.safeGet('step3_csp_setup');
    const savedItems = storageOptimizer.safeGet('step3_added_lead_items');
    
    if (savedSources && Array.isArray(savedSources)) {
      setCurrentSources(savedSources);
    }
    if (savedOpportunities && Array.isArray(savedOpportunities)) {
      setExpansionOpportunities(savedOpportunities);
    }
    if (savedSetup && typeof savedSetup === 'object') {
      setCspSetup(savedSetup);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedLeadItems(savedItems);
    }
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const hasCurrentSources = currentSources.length > 0;
    const hasExpansionOpportunities = expansionOpportunities.length > 0;
    const setupComplete = Object.values(cspSetup).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = hasCurrentSources && hasExpansionOpportunities && setupComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentSources, expansionOpportunities, cspSetup, isStepComplete]);

  // Auto-progression logic for sub-steps - ONLY on user actions
  const triggerAutoProgression = () => {
    const hasCurrentSources = currentSources.length > 0 || 
                             addedLeadItems.some(item => item.type === 'Current Sources');
    const hasExpansionOpportunities = expansionOpportunities.length > 0 || 
                                     addedLeadItems.some(item => item.type === 'Expansion Opportunities');
    const hasSetupComplete = Object.values(cspSetup).every(value => value && value.trim().length > 0) ||
                            addedLeadItems.some(item => item.type === 'CSP Setup');
    
    console.log('Step 3 Auto-progression Trigger:', {
      activeSubStep,
      hasCurrentSources,
      hasExpansionOpportunities,
      hasSetupComplete
    });
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasCurrentSources) {
      console.log('Auto-progressing from Current Sources to Expansion Opportunities');
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasExpansionOpportunities) {
      console.log('Auto-progressing from Expansion Opportunities to CSP Setup');
      setTimeout(() => setActiveSubStep(3), 500);
    } else if (activeSubStep === 3 && hasSetupComplete) {
      console.log('Auto-progressing from CSP Setup to Milestone');
      setTimeout(() => setActiveSubStep(4), 500);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleSetupChange = (field, value) => {
    const updated = { ...cspSetup, [field]: value };
    setCspSetup(updated);
    storageOptimizer.safeSet('step3_csp_setup', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
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
      
      const updated = [...addedLeadItems, newItem];
      setAddedLeadItems(updated);
      storageOptimizer.safeSet('step3_added_lead_items', updated);
      
      // Also add to appropriate arrays
      if (manualForm.type === 'Current Sources') {
        const updatedSources = [...currentSources, newItem];
        setCurrentSources(updatedSources);
        storageOptimizer.safeSet('step3_current_sources', updatedSources);
      } else if (manualForm.type === 'Expansion Opportunities') {
        const updatedOpportunities = [...expansionOpportunities, newItem];
        setExpansionOpportunities(updatedOpportunities);
        storageOptimizer.safeSet('step3_expansion_opportunities', updatedOpportunities);
      }
      
      setManualModalOpen(false);
      
      // Trigger auto-progression check after adding manual entry
      setTimeout(() => triggerAutoProgression(), 100);
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
      'Current Sources': [
        { id: 1, title: 'Website Organic Traffic', description: 'Visitors finding you through search engines', details: 'SEO-driven traffic from Google, Bing, and other search engines' },
        { id: 2, title: 'Social Media Followers', description: 'Leads from social media platforms', details: 'LinkedIn, Facebook, Instagram, Twitter engagement and followers' },
        { id: 3, title: 'Email Newsletter Subscribers', description: 'People subscribed to your email list', details: 'Newsletter subscribers, email course participants, lead magnet downloads' },
        { id: 4, title: 'Referral Network', description: 'Leads from business partners and clients', details: 'Word-of-mouth referrals, partner recommendations, client introductions' },
        { id: 5, title: 'Content Marketing', description: 'Leads from blog posts and content', details: 'Blog readers, podcast listeners, video viewers, content downloads' }
      ],
      'Expansion Opportunities': [
        { id: 1, title: 'Podcast Guest Appearances', description: 'Appear on industry podcasts as an expert', details: 'Target 10-20 relevant podcasts in your industry for guest appearances' },
        { id: 2, title: 'Strategic Partnerships', description: 'Partner with complementary businesses', details: 'Joint ventures, affiliate partnerships, cross-promotional opportunities' },
        { id: 3, title: 'Speaking Engagements', description: 'Speak at industry events and conferences', details: 'Virtual and in-person speaking opportunities, webinars, workshops' },
        { id: 4, title: 'LinkedIn Content Strategy', description: 'Systematic LinkedIn content and networking', details: 'Daily posting, connection outreach, LinkedIn article publishing' },
        { id: 5, title: 'YouTube Channel', description: 'Create educational video content', details: 'Weekly video uploads, tutorials, industry insights, behind-the-scenes' }
      ],
      'CSP Setup': [
        { id: 1, title: 'Lead Scoring System', description: 'Automated lead qualification and scoring', details: 'Score leads based on engagement, demographics, and behavior' },
        { id: 2, title: 'Email Automation Sequences', description: 'Nurture sequences for different lead types', details: 'Welcome series, educational sequences, sales funnels' },
        { id: 3, title: 'CRM Integration', description: 'Connect with your existing CRM system', details: 'Sync with Salesforce, HubSpot, Pipedrive, or other CRM platforms' },
        { id: 4, title: 'Analytics Dashboard', description: 'Track and measure lead generation performance', details: 'Monitor conversion rates, source performance, ROI tracking' },
        { id: 5, title: 'Lead Magnet Automation', description: 'Automated delivery of lead magnets', details: 'Instant delivery, follow-up sequences, segmentation based on interests' }
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
    
    const updated = [...addedLeadItems, newItem];
    setAddedLeadItems(updated);
    storageOptimizer.safeSet('step3_added_lead_items', updated);
    
    // Also add to appropriate arrays
    if (currentModalType === 'Current Sources') {
      const updatedSources = [...currentSources, newItem];
      setCurrentSources(updatedSources);
      storageOptimizer.safeSet('step3_current_sources', updatedSources);
    } else if (currentModalType === 'Expansion Opportunities') {
      const updatedOpportunities = [...expansionOpportunities, newItem];
      setExpansionOpportunities(updatedOpportunities);
      storageOptimizer.safeSet('step3_expansion_opportunities', updatedOpportunities);
    }
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Trigger auto-progression check after adding AI suggestion
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // Edit/Delete functions
  const editLeadItem = (id) => {
    const item = addedLeadItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteLeadItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteLeadItem = (id) => {
    const updated = addedLeadItems.filter(i => i.id !== id);
    setAddedLeadItems(updated);
    storageOptimizer.safeSet('step3_added_lead_items', updated);
    
    // Also remove from appropriate arrays
    const updatedSources = currentSources.filter(s => s.id !== id);
    setCurrentSources(updatedSources);
    storageOptimizer.safeSet('step3_current_sources', updatedSources);
    
    const updatedOpportunities = expansionOpportunities.filter(o => o.id !== id);
    setExpansionOpportunities(updatedOpportunities);
    storageOptimizer.safeSet('step3_expansion_opportunities', updatedOpportunities);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateLeadIntelligence();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating lead intelligence:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 3) {
      setCspSetup(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step3_csp_setup', { ...cspSetup, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    title: "How This Step Works",
    description: "Follow these Action Steps to analyze your lead sources, identify expansion opportunities, and set up intelligent systems.",
    steps: [
      {
        title: "Current Sources",
        description: "Audit and analyze your existing lead generation channels to understand what's working best.",
        color: "bg-[#fbae42]"
      },
      {
        title: "Expansion Opportunities", 
        description: "Identify new channels and strategies to reach more of your ideal clients effectively.",
        color: "bg-[#0e9246]"
      },
      {
        title: "CSP Setup",
        description: "Configure intelligent lead management systems and automation to scale your acquisition.",
        color: "bg-[#467a8f]"
      }
    ]
  };

  // Check section completion for tab progression
  const hasCurrentSources = currentSources.length > 0;
  const hasExpansionOpportunities = expansionOpportunities.length > 0;
  const hasCSPSetup = Object.values(cspSetup).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasCurrentSources; // Unlocked when current sources complete
      case 3: return hasCurrentSources && hasExpansionOpportunities; // Unlocked when first two complete
      case 4: return hasCurrentSources && hasExpansionOpportunities && hasCSPSetup; // Milestone - all complete
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
                Identify and analyze your existing lead generation channels to understand what's working and what needs improvement.
              </p>

              <div className="space-y-6">
                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Current Sources')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Current Sources')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Current Sources */}
                {currentSources.map((source) => (
                  <div key={source.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{source.title}</h4>
                        <p className="text-gray-600 mt-1">{source.description}</p>
                        {source.details && (
                          <p className="text-gray-500 text-sm mt-2">{source.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {source.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editLeadItem(source.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLeadItem(source.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {currentSources.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No lead sources added yet. Use the buttons above to get started!</p>
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
                Identify new channels and strategies to expand your lead generation and reach more of your ideal clients.
              </p>

              <div className="space-y-6">
                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Expansion Opportunities')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Expansion Opportunities')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Expansion Opportunities */}
                {expansionOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                        <p className="text-gray-600 mt-1">{opportunity.description}</p>
                        {opportunity.details && (
                          <p className="text-gray-500 text-sm mt-2">{opportunity.details}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {opportunity.source === 'ai' ? '🤖 AI Generated' : '✏️ Manual Entry'}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => editLeadItem(opportunity.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLeadItem(opportunity.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {expansionOpportunities.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No expansion opportunities added yet. Use the buttons above to get started!</p>
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
                Configure your Cultivating Sales Platform for intelligent lead management, scoring, and automation.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Scoring Criteria
                  </label>
                  <textarea
                    value={cspSetup.leadScoring}
                    onChange={(e) => handleSetupChange('leadScoring', e.target.value)}
                    placeholder="Define how leads will be scored: demographics, behavior, engagement, company size..."
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
                    onChange={(e) => handleSetupChange('automationRules', e.target.value)}
                    placeholder="Define automation triggers: email sequences, notifications, follow-up actions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('CSP Setup')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('CSP Setup')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added CSP Setup Items */}
                {addedLeadItems.filter(i => i.type === 'CSP Setup').map((item) => (
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
                          onClick={() => editLeadItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLeadItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasCSPSetup && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">CSP Setup Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your lead intelligence system is now configured. Check out the milestone reflection!
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
                Get AI-powered suggestions to optimize your lead intelligence and automation setup.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Lead Intelligence
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
                  Congratulations! You've set up intelligent lead management and identified growth opportunities.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Analyzed current lead sources</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Identified expansion opportunities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Configured intelligent lead scoring</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Set up automation rules</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your lead generation will be more systematic</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll identify high-quality leads faster</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Automation will save you time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have clear growth pathways</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Intelligent lead management is the bridge between marketing and sales. With your system configured, you'll spend less time chasing unqualified leads and more time closing deals with your ideal clients.
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 3 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Lead Generation Expansion
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Analyze your current lead sources, identify expansion opportunities, and set up systems to scale your client acquisition.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 3 Complete! Your lead intelligence is optimized.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have intelligent lead management and clear growth opportunities.
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
        
        {/* Sub-step Navigation */}
        <div className="bg-[#d5e6ed] rounded-lg shadow-lg border border-[#467a8f] border-opacity-20 mb-8 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
          <div className="flex flex-wrap">
            {subSteps.map((step, index) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              
              // Define completion status for each sub-step
              const hasCurrentSources = currentSources.length > 0 || 
                                       addedLeadItems.some(item => item.type === 'Current Sources');
              const hasExpansionOpportunities = expansionOpportunities.length > 0 || 
                                               addedLeadItems.some(item => item.type === 'Expansion Opportunities');
              const hasCSPSetup = Object.values(cspSetup).every(value => value && value.trim().length > 0) ||
                                 addedLeadItems.some(item => item.type === 'CSP Setup');
              
              const isCompleted = step.id < 4 ? (
                step.id === 1 ? hasCurrentSources :
                step.id === 2 ? hasExpansionOpportunities :
                step.id === 3 ? hasCSPSetup : false
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
                    <option value="Current Sources">Current Sources</option>
                    <option value="Expansion Opportunities">Expansion Opportunities</option>
                    <option value="CSP Setup">CSP Setup</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Website Organic Traffic"
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
          title="AI Lead Intelligence"
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

