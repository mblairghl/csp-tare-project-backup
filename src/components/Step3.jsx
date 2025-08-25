import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';

const Step3 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current-sources'); // Default to first sub step
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiLeadStrategy, setAiLeadStrategy] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [currentLeadSources, setCurrentLeadSources] = useState([]);
  const [showAddLeadSourceModal, setShowAddLeadSourceModal] = useState(false);
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

  const handleAILeadStrategy = async () => {
    if (!aiService.hasApiKey()) {
      setApiKeyModalOpen(true);
      return;
    }

    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const businessInfo = {
        business: 'Business coaching and consulting services',
        personas: 'Business owners and entrepreneurs seeking systematic growth',
        leadSources: 'Social media, referrals, content marketing, networking'
      };
      
      const leadStrategy = await aiService.generateLeadStrategy(businessInfo);
      setAiLeadStrategy(leadStrategy);
    } catch (error) {
      console.error('Error generating lead strategy:', error);
      alert('Error generating lead strategy. Please check your API key and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Lead source options (alphabetized)
  const leadSourceOptions = [
    'Affiliate Marketing',
    'Blog Content',
    'Cold Email Outreach',
    'Cold Calling',
    'Community Building',
    'Content Marketing',
    'Direct Mail',
    'Email Marketing',
    'Facebook Ads',
    'Google Ads',
    'Industry Events',
    'Influencer Partnerships',
    'LinkedIn Outreach',
    'Local Networking',
    'Organic Social Media',
    'Paid Social Media',
    'Partnerships',
    'Podcast Appearances',
    'Podcast Hosting',
    'Public Relations',
    'Referral Program',
    'SEO/Organic Search',
    'Speaking Engagements',
    'Trade Shows',
    'Video Marketing',
    'Webinars',
    'Word of Mouth',
    'YouTube Channel'
  ];

  // Lead source form state
  const [leadSourceForm, setLeadSourceForm] = useState({
    type: '',
    name: '',
    description: '',
    channelCategory: '',
    effortLevel: '',
    timeInvestment: '',
    skillLevel: ''
  });

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setLeadSourceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmitLeadSource = () => {
    // Validate required fields
    if (!leadSourceForm.type || !leadSourceForm.name || !leadSourceForm.channelCategory) {
      alert('Please fill in all required fields (Type, Lead Source Name, and Channel Category)');
      return;
    }

    // Create new lead source object
    const newLeadSource = {
      id: Date.now(),
      type: leadSourceForm.type,
      name: leadSourceForm.name,
      description: leadSourceForm.description,
      channelCategory: leadSourceForm.channelCategory,
      effortLevel: leadSourceForm.effortLevel,
      timeInvestment: leadSourceForm.timeInvestment,
      skillLevel: leadSourceForm.skillLevel,
      dateAdded: new Date().toISOString()
    };

    // Add to current lead sources
    const updatedSources = [...currentLeadSources, newLeadSource];
    setCurrentLeadSources(updatedSources);

    // Save to localStorage
    safeLocalStorageSet('step3_current_lead_sources', JSON.stringify(updatedSources));

    // Reset form and close modal
    setLeadSourceForm({
      type: '',
      name: '',
      description: '',
      channelCategory: '',
      effortLevel: '',
      timeInvestment: '',
      skillLevel: ''
    });
    setShowAddLeadSourceModal(false);
  };

  const handleDeleteLeadSource = (sourceId) => {
    const updatedSources = currentLeadSources.filter(source => source.id !== sourceId);
    setCurrentLeadSources(updatedSources);
    
    // Save to localStorage
    try {
      localStorage.setItem('step3_current_lead_sources', JSON.stringify(updatedSources));
    } catch (error) {
      console.error('Error saving lead sources:', error);
    }
  };

  // Load saved lead sources on component mount
  useEffect(() => {
    try {
      const savedSources = localStorage.getItem('step3_current_lead_sources');
      if (savedSources) {
        setCurrentLeadSources(JSON.parse(savedSources));
      }
    } catch (error) {
      console.error('Error loading lead sources:', error);
    }
  }, []);

  const howThisWorksContent = {
    description: "Transform your scattered lead generation into a strategic plan that sets the foundation for accurate tracking and measurement in HighLevel.",
    steps: [
      {
        'title': 'Current Lead Sources', 
        'description': 'Audit and inventory your existing lead generation channels and activities.', 
        'color': 'bg-green-600', 
        'textColor': '#16a34a'
      }, 
      {
        'title': 'Expansion Opportunities', 
        'description': 'Discover new lead sources that align with your market and business model.', 
        'color': 'bg-blue-600', 
        'textColor': '#2563eb'
      }, 
      {
        'title': 'HighLevel Setup Planning', 
        'description': 'Prepare lead scoring and tracking configuration for proper implementation.', 
        'color': 'bg-yellow-600', 
        'textColor': '#ca8a04'
      }
    ]
  };

  const subSteps = [
    {
      'id': 'current-sources', 
      'title': 'Current Lead Sources', 
      'description': 'Audit existing channels'
    }, 
    {
      'id': 'expansion-opportunities', 
      'title': 'Expansion Opportunities', 
      'description': 'Discover new channels'
    }, 
    {
      'id': 'highlevel-setup', 
      'title': 'HighLevel Setup', 
      'description': 'Plan tracking configuration'
    },
    {
      'id': 'milestone-reflection', 
      'title': 'Milestone Reflection', 
      'description': 'Celebrate progress'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 3 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Lead Intelligence
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Plan your lead source strategy and prepare for proper tracking setup in HighLevel.
        </p>

        {/* Component 4: How This Works Section */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <h3 className="text-green-800 font-semibold text-lg">How This Works</h3>
            </div>
            <button
              onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
              className="text-green-600 hover:text-green-800 transition-colors text-sm px-3 py-1 bg-green-100 rounded"
            >
              {isHowThisWorksOpen ? (
                <>Collapse <ChevronUp className="w-4 h-4 inline ml-1" /></>
              ) : (
                <>Expand <ChevronDown className="w-4 h-4 inline ml-1" /></>
              )}
            </button>
          </div>
          
          {isHowThisWorksOpen && (
            <div className="mt-4 bg-white p-4 rounded border border-green-200">
              <p className="text-gray-600 text-sm mb-4">
                {howThisWorksContent.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4">
                {howThisWorksContent.steps.map((step, index) => (
                  <div key={index} className="text-center p-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mx-auto mb-2 ${step.color}`}>
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-sm mb-2" style={{ color: step.textColor }}>
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Component 5: Tabbed Sub Step Section */}
        <div className="bg-white rounded-lg border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-8">
          <div className="flex border-b">
            {subSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveTab(step.id);
                  // Trigger confetti when milestone tab is clicked
                  if (step.id === 'milestone-reflection') {
                    setShowConfetti(true);
                    // Stop confetti after 3 seconds
                    setTimeout(() => setShowConfetti(false), 3000);
                  }
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === step.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed ? 'bg-green-600 text-white' : 
                    activeTab === step.id ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'current-sources' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Lead Sources Audit</h3>
                <p className="text-gray-600 mb-6">
                  Let's inventory the lead generation channels you're currently using. This helps us understand your starting point and build from there.
                </p>
                
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Lead Sources</h3>
                    <button
                      onClick={() => setShowAddLeadSourceModal(true)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      + Add Current Lead Source
                    </button>
                  </div>
                  
                  {currentLeadSources.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">📊</div>
                      <p>No lead sources added yet</p>
                      <p className="text-sm">Add your current lead generation channels to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentLeadSources.map((source) => (
                        <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{source.name}</h4>
                            <button
                              onClick={() => handleDeleteLeadSource(source.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Type:</span> {source.type}</p>
                            {source.channelCategory && (
                              <p><span className="font-medium">Category:</span> {source.channelCategory}</p>
                            )}
                            {source.effortLevel && (
                              <p><span className="font-medium">Effort:</span> {source.effortLevel}</p>
                            )}
                            {source.description && (
                              <p className="text-gray-500 mt-2">{source.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'expansion-opportunities' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Source Expansion Opportunities</h3>
                <p className="text-gray-600 mb-6">
                  Discover new lead generation channels that could work well for your business and market. Focus on strategic expansion, not just more channels.
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleAILeadStrategy}
                      className="text-black px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#d7df21' }}
                    >
                      🤖 Get AI Recommendations
                    </button>
                    
                    <button 
                      onClick={() => {
                        alert('Add Potential Lead Source modal coming soon!');
                      }}
                      className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#fbae42' }}
                    >
                      + Add Potential Source
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <div className="text-gray-400 text-4xl mb-2">🎯</div>
                    <h4 className="text-gray-600 font-medium mb-2">No Expansion Opportunities Added Yet</h4>
                    <p className="text-gray-500 text-sm">
                      Use AI recommendations or manual research to identify new lead generation opportunities for your business.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'highlevel-setup' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">HighLevel Lead Scoring Setup</h3>
                <p className="text-gray-600 mb-6">
                  Prepare your lead scoring and tracking configuration for HighLevel implementation. This ensures accurate measurement from day one.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">🎯 Lead Scoring Criteria</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      Define how leads will be scored in your HighLevel system based on source quality, engagement, and fit.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800 mb-2">Source Quality Scoring</h5>
                        <p className="text-gray-600 text-sm">High-quality sources (referrals, warm introductions) = +20 points</p>
                        <p className="text-gray-600 text-sm">Medium-quality sources (content marketing, SEO) = +10 points</p>
                        <p className="text-gray-600 text-sm">Low-quality sources (cold outreach, ads) = +5 points</p>
                      </div>
                      
                      <div className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800 mb-2">Engagement Scoring</h5>
                        <p className="text-gray-600 text-sm">Email opens = +2 points</p>
                        <p className="text-gray-600 text-sm">Link clicks = +5 points</p>
                        <p className="text-gray-600 text-sm">Form submissions = +10 points</p>
                        <p className="text-gray-600 text-sm">Phone/video calls = +15 points</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        alert('HighLevel configuration guide coming soon!');
                      }}
                      className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#fbae42' }}
                    >
                      📋 Generate Setup Checklist
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <div className="text-gray-400 text-4xl mb-2">⚙️</div>
                    <h4 className="text-gray-600 font-medium mb-2">Ready for HighLevel Implementation</h4>
                    <p className="text-gray-500 text-sm">
                      Your lead scoring criteria and tracking plan will be used to configure HighLevel properly for accurate measurement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestone-reflection' && (
              <div>
                {showConfetti && (
                  <Confetti
                    width={windowDimensions.width}
                    height={windowDimensions.height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                  />
                )}
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">
                  Celebrate your progress! You've completed your lead source planning and are ready for proper HighLevel implementation.
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3">🎯 What You've Accomplished:</h4>
                  <ul className="text-green-700 space-y-2">
                    <li>✅ Audited your current lead generation channels</li>
                    <li>✅ Identified expansion opportunities for new lead sources</li>
                    <li>✅ Planned your HighLevel lead scoring and tracking setup</li>
                    <li>✅ Created a strategic foundation for accurate measurement</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🚀 What's Next:</h4>
                  <p className="text-blue-700">
                    Step 4 will help you build your signature funnel and implement the tracking systems you've planned here. 
                    Your lead intelligence strategy will guide the technical setup for accurate measurement.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter currentStep={3} />

        {/* AI Lead Strategy Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI-Generated Lead Strategy"
          loading={aiLoading}
        >
          {aiLeadStrategy && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-6">
                Here's your AI-generated lead intelligence strategy:
              </p>
              
              {aiLeadStrategy.topLeadSources && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Top Lead Sources</h4>
                  <div className="space-y-2">
                    {aiLeadStrategy.topLeadSources.map((source, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800">{source.source}</h5>
                        <p className="text-sm text-gray-600">{source.description}</p>
                        <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                          source.priority === 'High' ? 'bg-red-100 text-red-600' :
                          source.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {source.priority} Priority
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiLeadStrategy.qualificationCriteria && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Qualification Criteria</h4>
                  <div className="space-y-2">
                    {aiLeadStrategy.qualificationCriteria.map((criteria, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800">{criteria.criteria}</h5>
                        <p className="text-sm text-gray-600">{criteria.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiLeadStrategy.trackingMetrics && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Tracking Metrics</h4>
                  <div className="space-y-2">
                    {aiLeadStrategy.trackingMetrics.map((metric, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <h5 className="font-medium text-gray-800">{metric.metric}</h5>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </AIModal>

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
          currentApiKey={aiService.getApiKey()}
        />

        {/* Add Lead Source Modal */}
        {showAddLeadSourceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Add Your Lead Source</h3>
                  <button
                    onClick={() => setShowAddLeadSourceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <form className="space-y-4">
                  {/* Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={leadSourceForm.type}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a type...</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Content Marketing">Content Marketing</option>
                      <option value="Email Marketing">Email Marketing</option>
                      <option value="Paid Advertising">Paid Advertising</option>
                      <option value="SEO/Organic Search">SEO/Organic Search</option>
                      <option value="Referrals">Referrals</option>
                      <option value="Networking">Networking</option>
                      <option value="Speaking">Speaking</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Direct Mail">Direct Mail</option>
                      <option value="Cold Outreach">Cold Outreach</option>
                      <option value="Webinars">Webinars</option>
                      <option value="Podcasts">Podcasts</option>
                      <option value="Trade Shows">Trade Shows</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Lead Source Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Source Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={leadSourceForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="e.g., LinkedIn Content Strategy"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={leadSourceForm.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      placeholder="Brief description of this lead source..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>

                  {/* Lead Source Intelligence Section */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      📊 Lead Source Intelligence
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Channel Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Channel Category <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 block">(Required for dashboard insights)</span>
                        </label>
                        <select 
                          value={leadSourceForm.channelCategory}
                          onChange={(e) => handleFormChange('channelCategory', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select channel...</option>
                          <option value="Organic">Organic (SEO, Content, Social)</option>
                          <option value="Paid">Paid (Ads, Sponsored Content)</option>
                          <option value="Referral">Referral (Partners, Word-of-mouth)</option>
                          <option value="Direct">Direct (Website, Email List)</option>
                        </select>
                      </div>

                      {/* Effort Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Effort Level
                        </label>
                        <select 
                          value={leadSourceForm.effortLevel}
                          onChange={(e) => handleFormChange('effortLevel', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select effort level...</option>
                          <option value="High-touch">High-touch (Personal outreach)</option>
                          <option value="Low-touch">Low-touch (Some interaction)</option>
                          <option value="Automated">Automated (Set and forget)</option>
                        </select>
                      </div>

                      {/* Time Investment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Investment
                        </label>
                        <select 
                          value={leadSourceForm.timeInvestment}
                          onChange={(e) => handleFormChange('timeInvestment', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select time investment...</option>
                          <option value="Daily">Daily (Requires daily attention)</option>
                          <option value="Weekly">Weekly (Weekly maintenance)</option>
                          <option value="One-time">One-time setup (Minimal ongoing)</option>
                        </select>
                      </div>

                      {/* Skill Level Required */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Skill Level Required
                        </label>
                        <select 
                          value={leadSourceForm.skillLevel}
                          onChange={(e) => handleFormChange('skillLevel', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select skill level...</option>
                          <option value="Beginner">Beginner (Easy to start)</option>
                          <option value="Intermediate">Intermediate (Some experience needed)</option>
                          <option value="Expert">Expert (Advanced skills required)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddLeadSourceModal(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitLeadSource}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Lead Source
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
