import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, DollarSign, Target, TrendingUp, Plus, Sparkles, X, Edit, Trash2, Package, Layers, BarChart3 } from 'lucide-react';
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

  // Modal states
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [aiSuggestionsModalOpen, setAiSuggestionsModalOpen] = useState(false);
  const [currentModalType, setCurrentModalType] = useState('');

  // Revenue structure data
  const [serviceStructure, setServiceStructure] = useState({
    coreServices: '',
    servicePackages: '',
    deliveryMethod: '',
    serviceTimeline: ''
  });

  const [contentDelivery, setContentDelivery] = useState({
    deliveryFormat: '',
    contentSchedule: '',
    clientInteraction: '',
    supportLevel: ''
  });

  const [deliveryOptimization, setDeliveryOptimization] = useState({
    processOptimization: '',
    qualityAssurance: '',
    clientFeedback: '',
    continuousImprovement: ''
  });

  // Added revenue items list
  const [addedRevenueItems, setAddedRevenueItems] = useState([]);

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
    const savedService = storageOptimizer.safeGet('step6_service_structure');
    const savedContent = storageOptimizer.safeGet('step6_content_delivery');
    const savedOptimization = storageOptimizer.safeGet('step6_delivery_optimization');
    const savedItems = storageOptimizer.safeGet('step6_added_revenue_items');
    
    if (savedService && typeof savedService === 'object') {
      setServiceStructure(savedService);
    }
    if (savedContent && typeof savedContent === 'object') {
      setContentDelivery(savedContent);
    }
    if (savedOptimization && typeof savedOptimization === 'object') {
      setDeliveryOptimization(savedOptimization);
    }
    if (savedItems && Array.isArray(savedItems)) {
      setAddedRevenueItems(savedItems);
    }
  }, []);

  // Check completion status and auto-progression
  useEffect(() => {
    const serviceComplete = Object.values(serviceStructure).every(value => value && value.trim().length > 0);
    const contentComplete = Object.values(contentDelivery).every(value => value && value.trim().length > 0);
    const optimizationComplete = Object.values(deliveryOptimization).every(value => value && value.trim().length > 0);
    
    const wasComplete = isStepComplete;
    const nowComplete = serviceComplete && contentComplete && optimizationComplete;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [serviceStructure, contentDelivery, deliveryOptimization, isStepComplete]);

  // Auto-progression logic for sub-steps
  useEffect(() => {
    const hasServiceStructure = Object.values(serviceStructure).every(value => value && value.trim().length > 0) ||
                               addedRevenueItems.some(item => item.type === 'Service Structure');
    const hasContentDelivery = Object.values(contentDelivery).every(value => value && value.trim().length > 0) ||
                              addedRevenueItems.some(item => item.type === 'Content Delivery');
    const hasDeliveryOptimization = Object.values(deliveryOptimization).every(value => value && value.trim().length > 0) ||
                                   addedRevenueItems.some(item => item.type === 'Delivery Optimization');
    
    // Auto-progress to next sub-step when current one is complete
    if (activeSubStep === 1 && hasServiceStructure) {
      setTimeout(() => setActiveSubStep(2), 500);
    } else if (activeSubStep === 2 && hasContentDelivery) {
      setTimeout(() => setActiveSubStep(3), 500);
    } else if (activeSubStep === 3 && hasDeliveryOptimization) {
      setTimeout(() => setActiveSubStep(4), 500);
    }
  }, [serviceStructure, contentDelivery, deliveryOptimization, addedRevenueItems, activeSubStep]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleServiceChange = (field, value) => {
    const updated = { ...serviceStructure, [field]: value };
    setServiceStructure(updated);
    storageOptimizer.safeSet('step6_service_structure', updated);
  };

  const handleContentChange = (field, value) => {
    const updated = { ...contentDelivery, [field]: value };
    setContentDelivery(updated);
    storageOptimizer.safeSet('step6_content_delivery', updated);
  };

  const handleOptimizationChange = (field, value) => {
    const updated = { ...deliveryOptimization, [field]: value };
    setDeliveryOptimization(updated);
    storageOptimizer.safeSet('step6_delivery_optimization', updated);
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
      
      const updated = [...addedRevenueItems, newItem];
      setAddedRevenueItems(updated);
      storageOptimizer.safeSet('step6_added_revenue_items', updated);
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
      'Service Structure': [
        { id: 1, title: 'Signature Program Framework', description: 'Comprehensive program with modules and milestones', details: '8-12 week program with weekly modules, assignments, and group calls' },
        { id: 2, title: 'VIP Day Intensive', description: 'High-value single-day transformation experience', details: 'Full-day strategic session with implementation roadmap' },
        { id: 3, title: 'Mastermind Program', description: 'Group coaching with peer learning and accountability', details: '6-month program with monthly group calls and peer partnerships' },
        { id: 4, title: 'Done-With-You Service', description: 'Collaborative implementation with hands-on support', details: 'Work alongside clients to implement strategies together' },
        { id: 5, title: 'Certification Program', description: 'Train others to deliver your methodology', details: 'Comprehensive training to certify others in your approach' }
      ],
      'Content Delivery': [
        { id: 1, title: 'Video Training Modules', description: 'Professional video content with workbooks', details: 'Weekly video lessons with downloadable resources and action steps' },
        { id: 2, title: 'Live Group Coaching', description: 'Interactive group sessions with Q&A', details: 'Bi-weekly live calls with hot seat coaching and community support' },
        { id: 3, title: 'Private Client Portal', description: 'Exclusive member area with resources', details: 'Branded portal with content, community, and progress tracking' },
        { id: 4, title: 'One-on-One Sessions', description: 'Personalized coaching and strategy sessions', details: 'Monthly private calls for individualized guidance and support' },
        { id: 5, title: 'Implementation Workshops', description: 'Hands-on workshops for skill building', details: 'Interactive sessions focused on specific skills and implementation' }
      ],
      'Delivery Optimization': [
        { id: 1, title: 'Automated Onboarding', description: 'Streamlined client welcome and setup process', details: 'Email sequences, welcome packets, and system access automation' },
        { id: 2, title: 'Progress Tracking System', description: 'Monitor client advancement and engagement', details: 'Dashboard to track completion rates, engagement, and outcomes' },
        { id: 3, title: 'Quality Assurance Process', description: 'Consistent delivery standards and feedback loops', details: 'Regular check-ins, feedback collection, and service improvements' },
        { id: 4, title: 'Client Success Metrics', description: 'Measure and optimize client outcomes', details: 'KPIs, success stories, and continuous improvement processes' },
        { id: 5, title: 'Scalable Delivery Model', description: 'Systems to serve more clients efficiently', details: 'Templates, automation, and team processes for growth' }
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
    
    const updated = [...addedRevenueItems, newItem];
    setAddedRevenueItems(updated);
    storageOptimizer.safeSet('step6_added_revenue_items', updated);
    
    // Remove suggestion from list
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  // Edit/Delete functions
  const editRevenueItem = (id) => {
    const item = addedRevenueItems.find(i => i.id === id);
    if (item) {
      setManualForm({
        type: item.type,
        title: item.title,
        description: item.description,
        details: item.details
      });
      setCurrentModalType(item.type);
      deleteRevenueItem(id); // Remove original
      setManualModalOpen(true);
    }
  };

  const deleteRevenueItem = (id) => {
    const updated = addedRevenueItems.filter(i => i.id !== id);
    setAddedRevenueItems(updated);
    storageOptimizer.safeSet('step6_added_revenue_items', updated);
  };

  // AI content generation
  const handleAIContentGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateRevenueStructure();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating revenue structure:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIContent = (content) => {
    // Apply AI suggestions to current sub-step
    if (activeSubStep === 1) {
      setServiceStructure(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_service_structure', { ...serviceStructure, ...content });
    } else if (activeSubStep === 2) {
      setContentDelivery(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_content_delivery', { ...contentDelivery, ...content });
    } else if (activeSubStep === 3) {
      setDeliveryOptimization(prev => ({ ...prev, ...content }));
      storageOptimizer.safeSet('step6_delivery_optimization', { ...deliveryOptimization, ...content });
    }
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Design and optimize your service delivery structure to maximize client value, satisfaction, and your revenue potential.",
    steps: [
      { title: 'Service Structure', description: 'Define your core services and delivery framework.', color: 'bg-[#467A8f]', textColor: '#467A8f' },
      { title: 'Content Delivery', description: 'Plan how you\'ll deliver value to your clients.', color: 'bg-[#0e9246]', textColor: '#0e9246' },
      { title: 'Delivery Optimization', description: 'Optimize processes for efficiency and quality.', color: 'bg-[#fbae42]', textColor: '#fbae42' }
    ]
  };

  // Check section completion for tab progression
  const hasServiceStructure = Object.values(serviceStructure).every(value => value && value.trim().length > 0);
  const hasContentDelivery = Object.values(contentDelivery).every(value => value && value.trim().length > 0);
  const hasDeliveryOptimization = Object.values(deliveryOptimization).every(value => value && value.trim().length > 0);

  // Tab progression logic
  const isSubStepUnlocked = (stepNumber) => {
    switch (stepNumber) {
      case 1: return true; // Always unlocked
      case 2: return hasServiceStructure; // Unlocked when service structure complete
      case 3: return hasServiceStructure && hasContentDelivery; // Unlocked when first two complete
      case 4: return hasServiceStructure && hasContentDelivery && hasDeliveryOptimization; // Milestone - all complete
      default: return false;
    }
  };

  const subSteps = [
    { id: 1, title: 'Service Structure', icon: Package },
    { id: 2, title: 'Content Delivery', icon: Layers },
    { id: 3, title: 'Delivery Optimization', icon: BarChart3 },
    { id: 4, title: 'Milestone Reflection', icon: CheckCircle2 }
  ];

  const renderSubStepContent = () => {
    switch (activeSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Structure</h3>
              <p className="text-gray-600 mb-6">
                Define your core services, packages, and delivery framework to create clear value propositions for your clients.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Core Services
                  </label>
                  <textarea
                    value={serviceStructure.coreServices}
                    onChange={(e) => handleServiceChange('coreServices', e.target.value)}
                    placeholder="Define your main service offerings: coaching programs, consulting, done-for-you services..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Packages
                  </label>
                  <textarea
                    value={serviceStructure.servicePackages}
                    onChange={(e) => handleServiceChange('servicePackages', e.target.value)}
                    placeholder="How will you package your services? Tiers, bundles, different levels of support..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <textarea
                    value={serviceStructure.deliveryMethod}
                    onChange={(e) => handleServiceChange('deliveryMethod', e.target.value)}
                    placeholder="How will you deliver your services? Online, in-person, hybrid, group, individual..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Timeline
                  </label>
                  <textarea
                    value={serviceStructure.serviceTimeline}
                    onChange={(e) => handleServiceChange('serviceTimeline', e.target.value)}
                    placeholder="What's the timeline for each service? Duration, milestones, completion criteria..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Service Structure')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Service Structure')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Service Structure Items */}
                {addedRevenueItems.filter(i => i.type === 'Service Structure').map((item) => (
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
                          onClick={() => editRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasServiceStructure && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Service Structure Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Great! You can now move to content delivery planning.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Delivery</h3>
              <p className="text-gray-600 mb-6">
                Plan how you'll deliver value to your clients through various content formats and interaction methods.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Format
                  </label>
                  <textarea
                    value={contentDelivery.deliveryFormat}
                    onChange={(e) => handleContentChange('deliveryFormat', e.target.value)}
                    placeholder="How will you deliver content? Videos, live calls, workbooks, templates, workshops..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Schedule
                  </label>
                  <textarea
                    value={contentDelivery.contentSchedule}
                    onChange={(e) => handleContentChange('contentSchedule', e.target.value)}
                    placeholder="What's your content delivery schedule? Weekly modules, daily lessons, monthly themes..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Interaction
                  </label>
                  <textarea
                    value={contentDelivery.clientInteraction}
                    onChange={(e) => handleContentChange('clientInteraction', e.target.value)}
                    placeholder="How will you interact with clients? Group calls, 1:1 sessions, community, office hours..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Level
                  </label>
                  <textarea
                    value={contentDelivery.supportLevel}
                    onChange={(e) => handleContentChange('supportLevel', e.target.value)}
                    placeholder="What level of support will you provide? Email support, community access, direct messaging..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Content Delivery')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Content Delivery')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Content Delivery Items */}
                {addedRevenueItems.filter(i => i.type === 'Content Delivery').map((item) => (
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
                          onClick={() => editRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasContentDelivery && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Content Delivery Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Excellent! You can now move to delivery optimization.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Delivery Optimization</h3>
              <p className="text-gray-600 mb-6">
                Optimize your service delivery processes for maximum efficiency, quality, and client satisfaction.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Process Optimization
                  </label>
                  <textarea
                    value={deliveryOptimization.processOptimization}
                    onChange={(e) => handleOptimizationChange('processOptimization', e.target.value)}
                    placeholder="How will you streamline your delivery processes? Automation, templates, systems..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Assurance
                  </label>
                  <textarea
                    value={deliveryOptimization.qualityAssurance}
                    onChange={(e) => handleOptimizationChange('qualityAssurance', e.target.value)}
                    placeholder="How will you ensure consistent quality? Standards, checklists, review processes..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Feedback System
                  </label>
                  <textarea
                    value={deliveryOptimization.clientFeedback}
                    onChange={(e) => handleOptimizationChange('clientFeedback', e.target.value)}
                    placeholder="How will you collect and use client feedback? Surveys, check-ins, testimonials..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Continuous Improvement
                  </label>
                  <textarea
                    value={deliveryOptimization.continuousImprovement}
                    onChange={(e) => handleOptimizationChange('continuousImprovement', e.target.value)}
                    placeholder="How will you continuously improve your services? Regular reviews, updates, innovation..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0e9246] focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Manual/AI Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => openManualModal('Delivery Optimization')}
                    className="px-6 py-3 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manual Entry
                  </button>
                  <button
                    onClick={() => openAiSuggestionsModal('Delivery Optimization')}
                    className="px-6 py-3 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] flex items-center gap-2 font-medium transition-colors duration-200"
                  >
                    <Sparkles className="w-4 h-4" />
                    🤖 Get AI Ideas
                  </button>
                </div>

                {/* Added Delivery Optimization Items */}
                {addedRevenueItems.filter(i => i.type === 'Delivery Optimization').map((item) => (
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
                          onClick={() => editRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRevenueItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasDeliveryOptimization && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Delivery Optimization Complete!</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Perfect! Your service delivery structure is now optimized. Check out the milestone reflection!
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
                Get AI-powered suggestions to optimize your complete service delivery structure.
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
                  Congratulations! You've designed an optimized service delivery structure that maximizes value for both you and your clients.
                </p>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Structured your core service offerings</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Planned comprehensive content delivery</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Optimized delivery processes for efficiency</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0e9246] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Created scalable revenue structure</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What This Means</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your services will deliver consistent value</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Client satisfaction will increase significantly</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Your delivery will be efficient and scalable</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-[#fbae42] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Revenue potential will be maximized</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#d7df21] bg-opacity-20 rounded-lg border border-[#d7df21]">
                  <h4 className="font-semibold text-gray-900 mb-2">🔑 Key Insight</h4>
                  <p className="text-gray-700">
                    Great service delivery isn't just about what you deliver—it's about how you deliver it. Your optimized structure ensures every client receives exceptional value while allowing you to scale efficiently and profitably.
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
          Service Delivery Structure
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Design and optimize your service delivery structure to maximize client value, satisfaction, and your revenue potential.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-[#0e9246] font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 6 Complete! Your service delivery is optimized.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a structured approach to deliver maximum value to clients.
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
                step.id === 1 ? hasServiceStructure :
                step.id === 2 ? hasContentDelivery :
                step.id === 3 ? hasDeliveryOptimization : false
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
                    <option value="Service Structure">Service Structure</option>
                    <option value="Content Delivery">Content Delivery</option>
                    <option value="Delivery Optimization">Delivery Optimization</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={manualForm.title}
                    onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Signature Program Framework"
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
          title="AI Revenue Structure"
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

