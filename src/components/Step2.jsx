import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, FileText, BarChart2, Lightbulb, Plus, Sparkles, Search, Target, X, Edit, Trash2 } from 'lucide-react';
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

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

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

  // Added content items list
  const [addedContentItems, setAddedContentItems] = useState([]);

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
    const savedAudit = storageOptimizer.safeGet('step2_content_audit');
    const savedStrategy = storageOptimizer.safeGet('step2_content_strategy');
    const savedGaps = storageOptimizer.safeGet('step2_gap_analysis');
    const savedItems = storageOptimizer.safeGet('step2_added_content_items');
    
    if (savedAudit && typeof savedAudit === 'object') {
      setContentAudit(savedAudit);
    }
    if (savedStrategy && typeof savedStrategy === 'object') {
      setContentStrategy(savedStrategy);
    }
    if (savedGaps && typeof savedGaps === 'object') {
      setGapAnalysis(savedGaps);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedContentItems(savedItems);
    }
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const auditComplete = Object.values(contentAudit).every(value => value && value.trim().length > 0);
    const strategyComplete = Object.values(contentStrategy).every(value => value && value.trim().length > 0);
    const gapsComplete = Object.values(gapAnalysis).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = auditComplete && strategyComplete && gapsComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [contentAudit, contentStrategy, gapAnalysis, isStepComplete]);

  // Auto-progression logic for sub-steps - ONLY on user actions
  const triggerAutoProgression = () => {
    const hasContentAudit = Object.values(contentAudit).every(value => value && value.trim().length > 0) ||
                           addedContentItems.some(item => item.type === 'Content Audit');
    const hasGapAnalysis = Object.values(gapAnalysis).every(value => value && value.trim().length > 0) ||
                          addedContentItems.some(item => item.type === 'Gap Analysis');
    const hasContentStrategy = Object.values(contentStrategy).every(value => value && value.trim().length > 0) ||
                              addedContentItems.some(item => item.type === 'Content Strategy');
    
    console.log('Step 2 Auto-progression Trigger:', {
      activeSubStep,
      hasContentAudit,
      hasGapAnalysis,
      hasContentStrategy
    });
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasContentAudit) {
      console.log('Auto-progressing from Content Audit to Gap Analysis');
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasGapAnalysis) {
      console.log('Auto-progressing from Gap Analysis to Content Strategy');
      setTimeout(() => setActiveSubStep(3), 500);
    } else if (activeSubStep === 3 && hasContentStrategy) {
      console.log('Auto-progressing from Content Strategy to Milestone');
      setTimeout(() => setActiveSubStep(4), 500);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleAuditChange = (field, value) => {
    const updated = { ...contentAudit, [field]: value };
    setContentAudit(updated);
    storageOptimizer.safeSet('step2_content_audit', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
  };

  const handleStrategyChange = (field, value) => {
    const updated = { ...contentStrategy, [field]: value };
    setContentStrategy(updated);
    storageOptimizer.safeSet('step2_content_strategy', updated);
    
    // Trigger auto-progression check after user input
    setTimeout(() => triggerAutoProgression(), 100);
  };

  const handleGapChange = (field, value) => {
    const updated = { ...gapAnalysis, [field]: value };
    setGapAnalysis(updated);
    storageOptimizer.safeSet('step2_gap_analysis', updated);
    
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
      
      const updated = [...addedContentItems, newItem];
      setAddedContentItems(updated);
      storageOptimizer.safeSet('step2_added_content_items', updated);
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
      'Content Audit': [
        { id: 1, title: 'Blog Post Analysis', description: 'Audit existing blog content for gaps and opportunities', details: 'Review 50+ blog posts for topic coverage, engagement, and SEO performance' },
        { id: 2, title: 'Social Media Content Review', description: 'Analyze social media content across all platforms', details: 'Evaluate posting frequency, engagement rates, and content themes' },
        { id: 3, title: 'Video Content Assessment', description: 'Review video content library and performance', details: 'Analyze YouTube, webinars, and course content for effectiveness' },
        { id: 4, title: 'Email Marketing Audit', description: 'Evaluate email sequences and newsletter content', details: 'Review open rates, click-through rates, and content relevance' },
        { id: 5, title: 'Lead Magnet Evaluation', description: 'Assess current lead magnets and their performance', details: 'Analyze download rates, conversion rates, and content quality' }
      ],
      'Gap Analysis': [
        { id: 1, title: 'Competitor Content Gaps', description: 'Identify content your competitors are missing', details: 'Find untapped topics and angles in your industry' },
        { id: 2, title: 'Audience Question Analysis', description: 'Discover unanswered questions from your audience', details: 'Analyze FAQ, comments, and support tickets for content ideas' },
        { id: 3, title: 'Funnel Stage Gaps', description: 'Identify missing content for each funnel stage', details: 'Ensure content exists for awareness, consideration, and decision stages' },
        { id: 4, title: 'Format Diversification', description: 'Find missing content formats in your strategy', details: 'Identify opportunities for podcasts, infographics, case studies' },
        { id: 5, title: 'Seasonal Content Opportunities', description: 'Discover time-sensitive content opportunities', details: 'Plan content around industry events, holidays, and trends' }
      ],
      'Content Strategy': [
        { id: 1, title: 'Authority Content Pillars', description: 'Core topics that establish your expertise', details: 'Define 3-5 main themes that showcase your unique knowledge' },
        { id: 2, title: 'Educational Content Series', description: 'Structured learning content for your audience', details: 'Create step-by-step guides and tutorial series' },
        { id: 3, title: 'Thought Leadership Content', description: 'Industry insights and forward-thinking content', details: 'Share predictions, trends, and innovative perspectives' },
        { id: 4, title: 'Case Study Documentation', description: 'Success stories and client transformations', details: 'Document and share client results and methodologies' },
        { id: 5, title: 'Behind-the-Scenes Content', description: 'Personal brand and company culture content', details: 'Share your journey, processes, and team insights' }
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
    
    const updated = [...addedContentItems, newItem];
    setAddedContentItems(updated);
    storageOptimizer.safeSet('step2_added_content_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    // Trigger auto-progression check after adding AI suggestion
    setTimeout(() => triggerAutoProgression(), 100);
  };

  // Edit/Delete functions
  const editContentItem = (id) => {
    const item = addedContentItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteContentItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteContentItem = (id) => {
    const updated = addedContentItems.filter(i => i.id !== id);
    setAddedContentItems(updated);
    storageOptimizer.safeSet('step2_added_content_items', updated);
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
      setGapAnalysis(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step2_gap_analysis', { ...gapAnalysis, ...content });
    } else if (activeSubStep === 3) {
      setContentStrategy(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step2_content_strategy', { ...contentStrategy, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    title: "How This Step Works",
    description: "Follow these Action Steps to audit your content, identify gaps, and create a strategic plan that establishes your authority.",
    steps: [
      {
        title: "Content Audit",
        description: "Analyze your existing content across all platforms to understand what's working and what's missing.",
        color: "bg-[#fbae42]"
      },
      {
        title: "Gap Analysis", 
        description: "Identify content gaps and opportunities to better serve your ideal client's journey.",
        color: "bg-[#0e9246]"
      },
      {
        title: "Strategy Development",
        description: "Create a comprehensive content strategy with pillars, channels, and distribution plans.",
        color: "bg-[#467a8f]"
      }
    ]
  };

  // Check section completion for tab progression
  const hasContentAudit = Object.values(contentAudit).every(value => value && value.trim().length > 0);
  const hasGapAnalysis = Object.values(gapAnalysis).every(value => value && value.trim().length > 0);
  const hasContentStrategy = Object.values(contentStrategy).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasContentAudit; // Unlocked when audit complete
      case 3: return hasContentAudit && hasGapAnalysis; // Unlocked when first two complete
      case 4: return hasContentAudit && hasGapAnalysis && hasContentStrategy; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Content Audit', icon: FileText },
    { id: 2, title: 'Gap Analysis', icon: Search },
    { id: 3, title: 'Content Strategy', icon: Target },
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
                Analyze your existing content to understand what you have, how it performs, and where opportunities exist.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Content Inventory
                  </label>
                  <textarea
                    value={contentAudit.existingContent}
                    onChange={(e) => handleAuditChange('existingContent', e.target.value)}
                    placeholder="List your current content: blog posts, videos, podcasts, social media, email sequences..."
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
                    placeholder="What content performs well? High engagement, shares, conversions..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Content Audit')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Content Audit')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Content Audit Items */}
                {addedContentItems.filter(i => i.type === 'Content Audit').map((item) => (
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
                          onClick={() => editContentItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteContentItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasContentAudit && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Content Audit Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to gap analysis.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Gap Analysis</h3>
              <p className="text-gray-600 mb-6">
                Identify missing content opportunities, competitor gaps, and areas where you can establish stronger authority.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Missing Content Areas
                  </label>
                  <textarea
                    value={gapAnalysis.missingContent}
                    onChange={(e) => handleGapChange('missingContent', e.target.value)}
                    placeholder="What topics, formats, or content types are you missing? What questions aren't you answering?"
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
                    onChange={(e) => handleGapChange('competitorAnalysis', e.target.value)}
                    placeholder="What content are competitors creating? Where are they weak? What opportunities do you see?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Gap Analysis')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Gap Analysis')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Gap Analysis Items */}
                {addedContentItems.filter(i => i.type === 'Gap Analysis').map((item) => (
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
                          onClick={() => editContentItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteContentItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasGapAnalysis && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Gap Analysis Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to content strategy.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Step 2 Milestone Celebration!</h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#0e9246] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Congratulations! 🎊</h4>
                    <p className="text-gray-600">You've completed your Content Strategy & Authority Building foundation!</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🎯 What You've Accomplished:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>✅ Audited your existing content assets</li>
                      <li>✅ Identified content gaps and opportunities</li>
                      <li>✅ Created a strategic content plan</li>
                      <li>✅ Established authority-building framework</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">🚀 How This Impacts Your Success:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>📈 <strong>Step 3:</strong> Your content strategy guides lead magnet creation</li>
                      <li>🎯 <strong>Step 4:</strong> Content pillars inform your sales funnel messaging</li>
                      <li>📧 <strong>Step 5:</strong> Authority content enhances email sequences</li>
                      <li>🏗️ <strong>CSP Setup:</strong> Content strategy drives automation workflows</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">🔗 Building Your Authority Empire:</h5>
                  <p className="text-blue-800 text-sm">
                    Your content strategy from this step becomes the foundation for everything ahead. Your Project Setup data combines with this content plan to create targeted lead magnets, personalized sales funnels, and authority-building email campaigns. Each piece works together to establish you as the go-to expert in your field.
                  </p>
                </div>
              </div>            </div>
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
                  Congratulations! You've completed a comprehensive content audit and created a strategic content plan.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Audited your existing content assets</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Identified content gaps and opportunities</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Analyzed competitor content strategies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created strategic content pillars</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your content will be more strategic and focused</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll fill important gaps in your content</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your authority will be established through content</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll have a clear content roadmap</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Strategic content is the foundation of authority. With your audit complete and strategy in place, every piece of content you create will now serve a purpose in building your reputation as the go-to expert in your field.
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
          STEP 2 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Content Strategy Audit
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Audit your existing content, identify gaps, and create a strategic content plan that positions you as the authority in your field.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 2 Complete! Your content strategy is ready.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a comprehensive content plan that will establish your authority.
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
              const isCompleted = step.id < 4 ? (
                step.id === 1 ? hasContentAudit :
                step.id === 2 ? hasGapAnalysis :
                step.id === 3 ? hasContentStrategy : false
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
                    <option value="Content Audit">Content Audit</option>
                    <option value="Gap Analysis">Gap Analysis</option>
                    <option value="Content Strategy">Content Strategy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Blog Post Analysis"
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

