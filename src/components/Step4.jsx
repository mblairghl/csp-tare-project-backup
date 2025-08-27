import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Magnet, Mail, Globe, Plus, Sparkles, X, Edit, Trash2 } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step4 = () => {
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

  // Funnel data
  const [leadMagnet, setLeadMagnet] = useState({
    title: '',
    format: '',
    problem: '',
    valueProposition: ''
  });

  const [nurtureSequence, setNurtureSequence] = useState({
    emailCount: '',
    frequency: '',
    content: '',
    callToAction: ''
  });

  const [funnelPages, setFunnelPages] = useState({
    landingPage: '',
    thankYouPage: '',
    salesPage: '',
    checkoutPage: ''
  });

  // Added funnel items list
  const [addedFunnelItems, setAddedFunnelItems] = useState([]);

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
    const savedLeadMagnet = storageOptimizer.safeGet('step4_lead_magnet');
    const savedNurture = storageOptimizer.safeGet('step4_nurture_sequence');
    const savedPages = storageOptimizer.safeGet('step4_funnel_pages');
    const savedItems = storageOptimizer.safeGet('step4_added_funnel_items');
    
    if (savedLeadMagnet && typeof savedLeadMagnet === 'object') {
      setLeadMagnet(savedLeadMagnet);
    }
    if (savedNurture && typeof savedNurture === 'object') {
      setNurtureSequence(savedNurture);
    }
    if (savedPages && typeof savedPages === 'object') {
      setFunnelPages(savedPages);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedFunnelItems(savedItems);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const magnetComplete = Object.values(leadMagnet).every(value => value && value.trim().length > 0);
    const nurtureComplete = Object.values(nurtureSequence).every(value => value && value.trim().length > 0);
    const pagesComplete = Object.values(funnelPages).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = magnetComplete && nurtureComplete && pagesComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [leadMagnet, nurtureSequence, funnelPages, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleLeadMagnetChange = (field, value) => {
    const updated = { ...leadMagnet, [field]: value };
    setLeadMagnet(updated);
    storageOptimizer.safeSet('step4_lead_magnet', updated);
  };

  const handleNurtureChange = (field, value) => {
    const updated = { ...nurtureSequence, [field]: value };
    setNurtureSequence(updated);
    storageOptimizer.safeSet('step4_nurture_sequence', updated);
  };

  const handlePagesChange = (field, value) => {
    const updated = { ...funnelPages, [field]: value };
    setFunnelPages(updated);
    storageOptimizer.safeSet('step4_funnel_pages', updated);
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
      
      const updated = [...addedFunnelItems, newItem];
      setAddedFunnelItems(updated);
      storageOptimizer.safeSet('step4_added_funnel_items', updated);
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
      'Lead Magnet Strategy': [
        { id: 1, title: 'Ultimate Guide PDF', description: 'Comprehensive guide to solving a specific problem', details: '20-30 page PDF with actionable strategies and templates' },
        { id: 2, title: 'Video Training Series', description: '3-5 part video series teaching key concepts', details: 'Weekly video releases with worksheets and action items' },
        { id: 3, title: 'Interactive Quiz + Report', description: 'Assessment that provides personalized results', details: 'Custom report based on quiz answers with recommendations' },
        { id: 4, title: 'Template Pack', description: 'Ready-to-use templates and tools', details: 'Collection of templates, checklists, and frameworks' },
        { id: 5, title: 'Email Course', description: '7-day email course with daily lessons', details: 'Automated email sequence with progressive learning' }
      ],
      'Nurture Sequence': [
        { id: 1, title: 'Welcome & Delivery Series', description: '3-email welcome sequence', details: 'Email 1: Welcome + delivery, Email 2: How to use, Email 3: Next steps' },
        { id: 2, title: 'Educational Nurture Series', description: '5-email educational sequence', details: 'Weekly emails with tips, case studies, and insights' },
        { id: 3, title: 'Problem-Solution Series', description: '4-email problem-focused sequence', details: 'Identify problem, agitate pain, present solution, social proof' },
        { id: 4, title: 'Authority Building Series', description: '6-email credibility sequence', details: 'Share expertise, case studies, testimonials, and thought leadership' },
        { id: 5, title: 'Sales Conversion Series', description: '7-email sales sequence', details: 'Soft pitch, benefits, objections, urgency, final call' }
      ],
      'Funnel Pages': [
        { id: 1, title: 'High-Converting Landing Page', description: 'Lead magnet opt-in page', details: 'Headline, benefits, form, social proof, mobile optimized' },
        { id: 2, title: 'Thank You Page', description: 'Post-opt-in confirmation page', details: 'Delivery confirmation, next steps, social sharing, upsell' },
        { id: 3, title: 'Sales Page', description: 'Product or service sales page', details: 'Problem, solution, benefits, testimonials, guarantee, CTA' },
        { id: 4, title: 'Checkout Page', description: 'Payment processing page', details: 'Secure payment, order summary, trust badges, support info' },
        { id: 5, title: 'Upsell Page', description: 'Additional offer page', details: 'Complementary product, limited time, one-click purchase' }
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
    
    const updated = [...addedFunnelItems, newItem];
    setAddedFunnelItems(updated);
    storageOptimizer.safeSet('step4_added_funnel_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // Edit/Delete functions
  const editFunnelItem = (id) => {
    const item = addedFunnelItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteFunnelItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteFunnelItem = (id) => {
    const updated = addedFunnelItems.filter(i => i.id !== id);
    setAddedFunnelItems(updated);
    storageOptimizer.safeSet('step4_added_funnel_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateFunnelBuild();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating funnel build:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setLeadMagnet(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step4_lead_magnet', { ...leadMagnet, ...content });
    } else if (activeSubStep === 2) {
      setNurtureSequence(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step4_nurture_sequence', { ...nurtureSequence, ...content });
    } else if (activeSubStep === 3) {
      setFunnelPages(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step4_funnel_pages', { ...funnelPages, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Build a complete signature funnel that attracts, nurtures, and converts your ideal clients into paying customers.",
    steps: [
      { title: 'Lead Magnet', description: 'Create an irresistible lead magnet that attracts your ideal clients.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Nurture Sequence', description: 'Design email sequences that build trust and authority.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Funnel Pages', description: 'Create high-converting landing pages and sales funnels.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasLeadMagnet = Object.values(leadMagnet).every(value => value && value.trim().length > 0);
  const hasNurtureSequence = Object.values(nurtureSequence).every(value => value && value.trim().length > 0);
  const hasFunnelPages = Object.values(funnelPages).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasLeadMagnet; // Unlocked when lead magnet complete
      case 3: return hasLeadMagnet && hasNurtureSequence; // Unlocked when first two complete
      case 4: return hasLeadMagnet && hasNurtureSequence && hasFunnelPages; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Lead Magnet Strategy', icon: Magnet },
    { id: 2, title: 'Nurture Sequence', icon: Mail },
    { id: 3, title: 'Funnel Pages', icon: Globe },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Magnet Strategy</h3>
              <p className="text-gray-600 mb-6">
                Create an irresistible lead magnet that attracts your ideal clients and showcases your expertise.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Magnet Title
                  </label>
                  <input
                    type="text"
                    value={leadMagnet.title}
                    onChange={(e) => handleLeadMagnetChange('title', e.target.value)}
                    placeholder="e.g., The Authority Success Blueprint"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={leadMagnet.format}
                    onChange={(e) => handleLeadMagnetChange('format', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  >
                    <option value="">Select format...</option>
                    <option value="PDF Guide + Checklist">PDF Guide + Checklist</option>
                    <option value="Video Training Series">Video Training Series</option>
                    <option value="Interactive Quiz + Report">Interactive Quiz + Report</option>
                    <option value="Email Course">Email Course</option>
                    <option value="Template Pack">Template Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem It Solves
                  </label>
                  <textarea
                    value={leadMagnet.problem}
                    onChange={(e) => handleLeadMagnetChange('problem', e.target.value)}
                    placeholder="What specific problem does your lead magnet solve for your ideal client?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value Proposition
                  </label>
                  <textarea
                    value={leadMagnet.valueProposition}
                    onChange={(e) => handleLeadMagnetChange('valueProposition', e.target.value)}
                    placeholder="What unique value and outcome will they get from your lead magnet?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Lead Magnet Strategy')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Lead Magnet Strategy')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Lead Magnet Items */}
                {addedFunnelItems.filter(i => i.type === 'Lead Magnet Strategy').map((item) => (
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
                          onClick={() => editFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasLeadMagnet && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Lead Magnet Strategy Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to nurture sequence planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Nurture Sequence</h3>
              <p className="text-gray-600 mb-6">
                Design email sequences that build trust, provide value, and guide prospects toward your offers.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Emails
                  </label>
                  <select
                    value={nurtureSequence.emailCount}
                    onChange={(e) => handleNurtureChange('emailCount', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  >
                    <option value="">Select email count...</option>
                    <option value="3 emails">3 emails (Welcome series)</option>
                    <option value="5 emails">5 emails (Educational series)</option>
                    <option value="7 emails">7 emails (Full nurture sequence)</option>
                    <option value="10 emails">10 emails (Comprehensive sequence)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Frequency
                  </label>
                  <select
                    value={nurtureSequence.frequency}
                    onChange={(e) => handleNurtureChange('frequency', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                  >
                    <option value="">Select frequency...</option>
                    <option value="Daily">Daily</option>
                    <option value="Every 2 days">Every 2 days</option>
                    <option value="Every 3 days">Every 3 days</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Strategy
                  </label>
                  <textarea
                    value={nurtureSequence.content}
                    onChange={(e) => handleNurtureChange('content', e.target.value)}
                    placeholder="Describe the content strategy for your email sequence: topics, value provided, progression..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action
                  </label>
                  <textarea
                    value={nurtureSequence.callToAction}
                    onChange={(e) => handleNurtureChange('callToAction', e.target.value)}
                    placeholder="What action do you want subscribers to take after the sequence?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Nurture Sequence')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Nurture Sequence')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Nurture Sequence Items */}
                {addedFunnelItems.filter(i => i.type === 'Nurture Sequence').map((item) => (
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
                          onClick={() => editFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasNurtureSequence && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Nurture Sequence Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to funnel pages creation.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Funnel Pages</h3>
              <p className="text-gray-600 mb-6">
                Create high-converting landing pages and sales funnels that guide prospects through your customer journey.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landing Page Strategy
                  </label>
                  <textarea
                    value={funnelPages.landingPage}
                    onChange={(e) => handlePagesChange('landingPage', e.target.value)}
                    placeholder="Describe your landing page strategy: headline, benefits, form placement, social proof..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thank You Page
                  </label>
                  <textarea
                    value={funnelPages.thankYouPage}
                    onChange={(e) => handlePagesChange('thankYouPage', e.target.value)}
                    placeholder="What happens after they opt-in? Delivery instructions, next steps, social sharing..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sales Page (Optional)
                  </label>
                  <textarea
                    value={funnelPages.salesPage}
                    onChange={(e) => handlePagesChange('salesPage', e.target.value)}
                    placeholder="If you have a paid offer, describe your sales page strategy..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Checkout/Contact Page
                  </label>
                  <textarea
                    value={funnelPages.checkoutPage}
                    onChange={(e) => handlePagesChange('checkoutPage', e.target.value)}
                    placeholder="How will prospects contact you or purchase? Contact form, calendar booking, payment process..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Funnel Pages')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Funnel Pages')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Funnel Pages Items */}
                {addedFunnelItems.filter(i => i.type === 'Funnel Pages').map((item) => (
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
                          onClick={() => editFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFunnelItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasFunnelPages && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Funnel Pages Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your signature funnel is now complete. Check out the milestone reflection!
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
                Get AI-powered suggestions to optimize your complete funnel strategy.
              </p>

              <button
                onClick={handleAIContentGeneration}
                className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
              >
                <Sparkles className="w-4 h-4" />
                🤖 Generate AI Funnel Strategy
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
                  Congratulations! You've built a complete signature funnel that will attract and convert your ideal clients.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created an irresistible lead magnet</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Designed nurture email sequences</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Planned high-converting funnel pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Built a complete customer journey</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Magnet className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">You'll attract qualified prospects automatically</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Magnet className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your expertise will be showcased effectively</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Magnet className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Trust will be built systematically</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Magnet className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Conversions will happen predictably</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Your signature funnel is now your 24/7 sales machine. It works while you sleep, attracting ideal clients, building trust through valuable content, and converting prospects into customers. This is the foundation of scalable authority-based revenue.
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
          STEP 4 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Signature Funnel Build
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Build a complete signature funnel that attracts, nurtures, and converts your ideal clients into paying customers.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 4 Complete! Your signature funnel is ready.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a complete system to attract and convert ideal clients.
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
                step.id === 1 ? hasLeadMagnet :
                step.id === 2 ? hasNurtureSequence :
                step.id === 3 ? hasFunnelPages : false
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
                    <option value="Lead Magnet Strategy">Lead Magnet Strategy</option>
                    <option value="Nurture Sequence">Nurture Sequence</option>
                    <option value="Funnel Pages">Funnel Pages</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Ultimate Guide PDF"
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
          title="AI Funnel Build"
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
          currentStep={4}
          isStepComplete={isStepComplete}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>
    </div>
  );
};

export default Step4;

