import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Target, Users, TrendingUp } from 'lucide-react';

const Step3 = () => {
  // Sub-step management (3 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [leadSources, setLeadSources] = useState([]);
  const [leadScoringSetup, setLeadScoringSetup] = useState({
    threshold: 75,
    criteria: []
  });
  
  // Modal states
  const [addLeadSourceModalOpen, setAddLeadSourceModalOpen] = useState(false);
  const [aiLeadSuggestionsModalOpen, setAiLeadSuggestionsModalOpen] = useState(false);
  const [leadScoringModalOpen, setLeadScoringModalOpen] = useState(false);
  
  // Form states
  const [newLeadSourceForm, setNewLeadSourceForm] = useState({
    type: '',
    name: '',
    description: '',
    notes: ''
  });
  
  // AI results
  const [aiLeadSuggestions, setAiLeadSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (3 steps total)
  const subSteps = [
    { id: 0, title: 'Lead Sources', completed: false },
    { id: 1, title: 'Lead Scoring', completed: false },
    { id: 2, title: 'Milestone Reflection', completed: false }
  ];

  // Lead source types (expanded list)
  const leadSourceTypes = [
    'Blog Content', 'Case Studies', 'Cold Email', 'Cold Outreach', 'Community Forums',
    'Content Marketing', 'Direct Mail', 'Email Marketing', 'Events & Conferences',
    'Facebook Ads', 'Google Ads', 'Industry Publications', 'Instagram Marketing',
    'Joint Ventures', 'Lead Magnets', 'LinkedIn Outreach', 'Networking Events',
    'Organic Search (SEO)', 'Partnerships', 'Podcast Appearances', 'Referrals',
    'Social Media Organic', 'Speaking Engagements', 'Trade Shows', 'Video Marketing',
    'Webinars', 'Word of Mouth', 'YouTube Marketing'
  ];

  // Preset scoring templates
  const scoringTemplates = [
    {
      name: 'Standard B2B Template',
      criteria: [
        { action: 'Email Open', points: 5 },
        { action: 'Website Visit', points: 10 },
        { action: 'Contact Form Submit', points: 25 },
        { action: 'Download Lead Magnet', points: 15 },
        { action: 'Video Watch (>50%)', points: 20 },
        { action: 'Pricing Page Visit', points: 30 },
        { action: 'Demo Request', points: 50 }
      ]
    },
    {
      name: 'Service Provider Template',
      criteria: [
        { action: 'Email Open', points: 3 },
        { action: 'Website Visit', points: 8 },
        { action: 'Case Study View', points: 12 },
        { action: 'Testimonial Page Visit', points: 15 },
        { action: 'Contact Form Submit', points: 35 },
        { action: 'Consultation Request', points: 60 }
      ]
    },
    {
      name: 'E-commerce Template',
      criteria: [
        { action: 'Product Page Visit', points: 5 },
        { action: 'Add to Cart', points: 20 },
        { action: 'Checkout Started', points: 40 },
        { action: 'Email Signup', points: 10 },
        { action: 'Review Read', points: 8 },
        { action: 'Wishlist Add', points: 15 }
      ]
    }
  ];

  // Check completion status
  const hasLeadSources = leadSources.length > 0;
  const hasLeadScoring = leadScoringSetup.criteria.length > 0;
  const isStepComplete = hasLeadSources && hasLeadScoring;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // Lead Sources always unlocked
      case 1: return hasLeadSources; // Lead Scoring unlocked when sources exist
      case 2: return hasLeadScoring; // Milestone unlocked when scoring is set
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasLeadSources; // Lead Sources completed when sources exist
      case 1: return hasLeadScoring; // Lead Scoring completed when criteria set
      case 2: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Add lead source to list
  const handleAddLeadSource = () => {
    if (!newLeadSourceForm.type || !newLeadSourceForm.name) {
      alert('Please fill in lead source type and name');
      return;
    }

    const newLeadSource = {
      id: Date.now(),
      type: newLeadSourceForm.type,
      name: newLeadSourceForm.name,
      description: newLeadSourceForm.description,
      notes: newLeadSourceForm.notes
    };

    setLeadSources([...leadSources, newLeadSource]);
    setNewLeadSourceForm({ type: '', name: '', description: '', notes: '' });
    setAddLeadSourceModalOpen(false);
  };

  // AI Lead Source Suggestions
  const handleAILeadSuggestions = () => {
    setIsAiLoading(true);
    setAiLeadSuggestionsModalOpen(true);

    // Simulate AI analysis for additional lead sources
    setTimeout(() => {
      const suggestions = [
        {
          type: 'Content Marketing',
          name: 'Industry-Specific Blog Content',
          description: 'Create targeted blog posts addressing specific pain points in your industry',
          reasoning: 'Blog content establishes authority and attracts organic traffic from prospects searching for solutions.'
        },
        {
          type: 'LinkedIn Outreach',
          name: 'Personalized LinkedIn Connection Strategy',
          description: 'Systematic approach to connecting with ideal prospects on LinkedIn',
          reasoning: 'LinkedIn is the top platform for B2B lead generation with high-quality professional connections.'
        },
        {
          type: 'Webinars',
          name: 'Educational Webinar Series',
          description: 'Monthly webinars teaching valuable skills related to your expertise',
          reasoning: 'Webinars allow you to demonstrate expertise while capturing qualified leads who invest time to attend.'
        },
        {
          type: 'Partnerships',
          name: 'Strategic Referral Partnerships',
          description: 'Partner with complementary service providers for mutual referrals',
          reasoning: 'Referral partnerships provide warm leads with higher conversion rates and lower acquisition costs.'
        },
        {
          type: 'Lead Magnets',
          name: 'High-Value Resource Downloads',
          description: 'Create downloadable guides, templates, or tools in exchange for contact information',
          reasoning: 'Lead magnets attract prospects actively seeking solutions and provide immediate value exchange.'
        }
      ];

      setAiLeadSuggestions(suggestions);
      setIsAiLoading(false);
    }, 2000);
  };

  // Add AI suggestion to lead sources
  const addAISuggestion = (suggestion) => {
    const newLeadSource = {
      id: Date.now(),
      type: suggestion.type,
      name: suggestion.name,
      description: suggestion.description,
      notes: 'AI-generated suggestion'
    };

    setLeadSources([...leadSources, newLeadSource]);
    
    // Remove this suggestion from the list
    setAiLeadSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
  };

  // Apply scoring template
  const applyTemplate = (template) => {
    setLeadScoringSetup(prev => ({
      ...prev,
      criteria: template.criteria
    }));
  };

  // Add custom scoring criteria
  const addCustomCriteria = (action, points) => {
    if (!action || !points) return;
    
    const newCriteria = { action, points: parseInt(points) };
    setLeadScoringSetup(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriteria]
    }));
  };

  // Remove scoring criteria
  const removeCriteria = (index) => {
    setLeadScoringSetup(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Identify your lead sources and set up intelligent lead scoring to prioritize your best prospects.",
    steps: [
      {
        title: "Lead Sources",
        description: "Add current sources and get AI suggestions",
        color: "bg-[#0e9246]"
      },
      {
        title: "Lead Scoring", 
        description: "Set point thresholds and scoring criteria",
        color: "bg-[#d7df21]"
      },
      {
        title: "Milestone",
        description: "Complete your lead intelligence setup",
        color: "bg-[#fbae42]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 3 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Lead Intelligence
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Identify your lead sources and set up intelligent scoring to prioritize prospects.
          </p>
        </div>

        {/* How This Works Section */}
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
              <span className="text-sm text-[#0e9246] font-medium">
                {isHowThisWorksOpen ? 'Collapse' : 'Expand'}
              </span>
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
            {subSteps.map((step) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = isSubStepCompleted(step.id);

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
                        <span className="text-xs">🔒</span>
                      ) : (
                        <span className="text-sm font-bold">{step.id + 1}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Current Sub-step */}
          <div className="space-y-6">
            {activeSubStep === 0 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Sources</h3>
                <p className="text-gray-600 mb-6">Add your current lead sources and discover new opportunities.</p>
                
                {/* Section 1: Add Lead Sources */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Add Lead Sources</h4>
                  </div>
                  <button
                    onClick={() => setAddLeadSourceModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Lead Source</span>
                  </button>
                </div>

                {/* Section 2: AI Lead Source Ideas */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#d7df21] rounded-full flex items-center justify-center mr-3">
                      <span className="text-black text-sm font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">AI Lead Source Ideas</h4>
                  </div>
                  <button
                    onClick={handleAILeadSuggestions}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Get AI Lead Source Ideas</span>
                  </button>
                </div>

                {/* Lead Sources Display */}
                {leadSources.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No lead sources added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Your Lead Sources ({leadSources.length} sources)</h4>
                    {leadSources.map((source) => (
                      <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{source.name}</h4>
                            <p className="text-sm text-gray-600">{source.type}</p>
                            {source.description && (
                              <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Scoring Setup</h3>
                <p className="text-gray-600 mb-6">Set point thresholds and scoring criteria for lead qualification.</p>
                
                {/* Point Threshold */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Point Threshold for Sales Assignment
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      value={leadScoringSetup.threshold}
                      onChange={(e) => setLeadScoringSetup(prev => ({...prev, threshold: parseInt(e.target.value)}))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    />
                    <span className="text-gray-600">points</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    When a lead reaches this score, assign to sales rep
                  </p>
                </div>

                {/* Scoring Criteria */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Scoring Criteria</h4>
                  
                  {/* Preset Templates */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Use Preset Template</label>
                    <div className="space-y-2">
                      {scoringTemplates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => applyTemplate(template)}
                          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{template.name}</span>
                          <p className="text-sm text-gray-600">
                            {template.criteria.length} criteria, max {Math.max(...template.criteria.map(c => c.points))} points
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Criteria */}
                  {leadScoringSetup.criteria.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Current Criteria:</h5>
                      {leadScoringSetup.criteria.map((criteria, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                          <span className="text-sm text-gray-700">{criteria.action}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{criteria.points} points</span>
                            <button
                              onClick={() => removeCriteria(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="text-sm text-gray-600 mt-2">
                        Total possible points: {leadScoringSetup.criteria.reduce((sum, c) => sum + c.points, 0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've set up your lead intelligence system.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Identified {leadSources.length} lead sources</li>
                      <li>✅ Set up lead scoring with {leadScoringSetup.criteria.length} criteria</li>
                      <li>✅ Configured {leadScoringSetup.threshold}-point threshold for sales assignment</li>
                      <li>✅ Built intelligent lead qualification system</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 4: Signature Funnel Build to create your conversion system.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Lead Intelligence Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Lead Intelligence Overview</h3>
            
            {/* Lead Sources Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Lead Sources ({leadSources.length})</h4>
              {leadSources.length === 0 ? (
                <p className="text-gray-500 text-sm">No lead sources added yet</p>
              ) : (
                <div className="space-y-2">
                  {leadSources.map((source) => (
                    <div key={source.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-blue-900 text-sm">{source.name}</p>
                          <p className="text-xs text-blue-700">{source.type}</p>
                        </div>
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Scoring Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Lead Scoring Setup</h4>
              {leadScoringSetup.criteria.length === 0 ? (
                <p className="text-gray-500 text-sm">No scoring criteria set</p>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-yellow-900">Sales Threshold</span>
                    <span className="text-yellow-800 font-bold">{leadScoringSetup.threshold} points</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-yellow-800 font-medium">Scoring Criteria:</p>
                    {leadScoringSetup.criteria.slice(0, 3).map((criteria, index) => (
                      <div key={index} className="flex justify-between text-xs text-yellow-700">
                        <span>{criteria.action}</span>
                        <span>{criteria.points} pts</span>
                      </div>
                    ))}
                    {leadScoringSetup.criteria.length > 3 && (
                      <p className="text-xs text-yellow-600">
                        +{leadScoringSetup.criteria.length - 3} more criteria
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Setup Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lead Sources</span>
                  <span className={`text-sm font-medium ${hasLeadSources ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasLeadSources ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lead Scoring</span>
                  <span className={`text-sm font-medium ${hasLeadScoring ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasLeadScoring ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Lead Source Modal */}
        {addLeadSourceModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Lead Source</h3>
                  <button
                    onClick={() => setAddLeadSourceModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source Type *</label>
                  <select
                    value={newLeadSourceForm.type}
                    onChange={(e) => setNewLeadSourceForm({...newLeadSourceForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select type</option>
                    {leadSourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Name *</label>
                  <input
                    type="text"
                    value={newLeadSourceForm.name}
                    onChange={(e) => setNewLeadSourceForm({...newLeadSourceForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Enter source name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newLeadSourceForm.description}
                    onChange={(e) => setNewLeadSourceForm({...newLeadSourceForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Describe this lead source"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newLeadSourceForm.notes}
                    onChange={(e) => setNewLeadSourceForm({...newLeadSourceForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddLeadSourceModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLeadSource}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Source
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Lead Suggestions Modal */}
        {aiLeadSuggestionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Lead Source Suggestions</h3>
                  <button
                    onClick={() => setAiLeadSuggestionsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-recommended lead sources based on your business type</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Analyzing potential lead sources...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Recommended Lead Sources ({aiLeadSuggestions.length} suggestions)</h4>
                    {aiLeadSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{suggestion.name}</h5>
                            <p className="text-sm text-gray-600">{suggestion.type}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>
                        
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Why this works:</span> {suggestion.reasoning}
                          </p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => addAISuggestion(suggestion)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add to Lead Sources
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;

