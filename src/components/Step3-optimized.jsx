import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

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
  const [expansionOpportunities, setExpansionOpportunities] = useState([]);
  const [showAddExpansionModal, setShowAddExpansionModal] = useState(false);
  const [highlevelSetup, setHighlevelSetup] = useState(null);

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

  // Expansion opportunity form state
  const [expansionForm, setExpansionForm] = useState({
    name: '',
    type: '',
    priority: '',
    description: ''
  });

  // Load saved data on component mount with optimization
  useEffect(() => {
    // Perform storage monitoring and cleanup if needed
    const storageStatus = storageOptimizer.monitorStorage();
    if (storageStatus.status === 'critical') {
      console.warn('Critical storage situation detected, performing emergency cleanup');
      storageOptimizer.emergencyCleanup();
    } else if (storageStatus.status === 'warning') {
      console.warn('Storage getting full, performing regular cleanup');
      storageOptimizer.performCleanup();
    }

    // Load Step 3 data using optimized storage
    const step3Data = storageOptimizer.getStep3Data();
    
    setCurrentLeadSources(Array.isArray(step3Data.currentLeadSources) ? step3Data.currentLeadSources : []);
    setExpansionOpportunities(Array.isArray(step3Data.expansionOpportunities) ? step3Data.expansionOpportunities : []);
    setHighlevelSetup(step3Data.highlevelSetup);
  }, []);

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
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmitLeadSource = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!leadSourceForm.type || !leadSourceForm.name || !leadSourceForm.channelCategory) {
      alert('Please fill in all required fields (Type, Name, and Channel Category).');
      return;
    }

    // Create new lead source object
    const newLeadSource = {
      id: Date.now(),
      ...leadSourceForm
    };

    // Add to current lead sources
    const updatedSources = [...currentLeadSources, newLeadSource];
    setCurrentLeadSources(updatedSources);
    
    // Save to optimized localStorage
    storageOptimizer.setStep3Data('current_lead_sources', updatedSources);
    
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
    
    // Save to optimized localStorage
    storageOptimizer.setStep3Data('current_lead_sources', updatedSources);
  };

  const resetLeadSourceForm = () => {
    setLeadSourceForm({
      type: '',
      name: '',
      description: '',
      channelCategory: '',
      effortLevel: '',
      timeInvestment: '',
      skillLevel: ''
    });
  };

  const handleSubmitExpansionOpportunity = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!expansionForm.name || !expansionForm.type) {
      alert('Please fill in the required fields (Name and Type).');
      return;
    }

    // Create new expansion opportunity object
    const newOpportunity = {
      id: Date.now(),
      ...expansionForm
    };

    // Add to expansion opportunities
    const updatedOpportunities = [...expansionOpportunities, newOpportunity];
    setExpansionOpportunities(updatedOpportunities);
    
    // Save to optimized localStorage
    storageOptimizer.setStep3Data('expansion_opportunities', updatedOpportunities);
    
    // Reset form and close modal
    resetExpansionForm();
    setShowAddExpansionModal(false);
  };

  const handleDeleteExpansionOpportunity = (opportunityId) => {
    const updatedOpportunities = expansionOpportunities.filter(opp => opp.id !== opportunityId);
    setExpansionOpportunities(updatedOpportunities);
    
    // Save to optimized localStorage
    storageOptimizer.setStep3Data('expansion_opportunities', updatedOpportunities);
  };

  const resetExpansionForm = () => {
    setExpansionForm({
      name: '',
      type: '',
      priority: '',
      description: ''
    });
  };

  const handleGenerateSetupChecklist = () => {
    const checklist = {
      id: Date.now(),
      categories: [
        {
          title: "Lead Source Tracking",
          tasks: [
            "Set up UTM parameters for all lead sources",
            "Configure lead source attribution in HighLevel",
            "Create custom fields for lead source data",
            "Set up lead source reporting dashboard"
          ]
        },
        {
          title: "Lead Scoring Configuration", 
          tasks: [
            "Define lead scoring criteria and point values",
            "Set up automated lead scoring rules",
            "Configure lead scoring triggers and actions",
            "Establish lead quality thresholds"
          ]
        },
        {
          title: "Tracking & Analytics",
          tasks: [
            "Set up conversion tracking for each lead source",
            "Create lead source performance dashboards",
            "Configure automated reporting schedules",
            "Set up lead source ROI tracking"
          ]
        },
        {
          title: "Integration Setup",
          tasks: [
            "Connect lead sources to HighLevel",
            "Set up webhook integrations",
            "Configure API connections for data sync",
            "Test all integrations and data flow"
          ]
        }
      ]
    };
    
    setHighlevelSetup(checklist);
    
    // Save to optimized localStorage
    storageOptimizer.setStep3Data('highlevel_setup', checklist);
  };

  const leadSourceTypes = [
    'Affiliate Marketing', 'Blog Content', 'Cold Email Outreach', 'Cold Calling',
    'Community Building', 'Content Marketing', 'Direct Mail', 'Email Marketing',
    'Facebook Ads', 'Google Ads', 'Industry Events', 'Influencer Partnerships',
    'LinkedIn Outreach', 'Local Networking', 'Organic Social Media', 'Paid Social Media',
    'Partnerships', 'Podcast Appearances', 'Podcast Hosting', 'Public Relations',
    'Referral Program', 'SEO/Organic Search', 'Speaking Engagements', 'Trade Shows',
    'Video Marketing', 'Webinars', 'Word of Mouth', 'YouTube Channel'
  ];

  const expansionTypes = [
    'Social Media Platform', 'Paid Advertising', 'Content Marketing', 'Email Marketing',
    'Referral Program', 'Partnership', 'Event Marketing', 'SEO/Organic Search',
    'Influencer Marketing', 'Direct Outreach', 'Community Building', 'Public Relations'
  ];

  const steps = [
    {
      id: 'current-sources',
      title: '🔍 Current Lead Sources',
      content: 'Identify and catalog your existing lead generation channels'
    },
    {
      id: 'expansion-opportunities', 
      title: '🚀 Expansion Opportunities',
      content: 'Discover new lead sources and growth opportunities for your market'
    },
    {
      id: 'highlevel-setup',
      title: '⚙️ HighLevel Setup',
      content: 'Prepare lead scoring and tracking configuration for your CSP platform'
    },
    {
      id: 'milestone-reflection',
      title: '🎉 Milestone Reflection',
      content: 'Celebrate your lead intelligence planning completion'
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
          gravity={0.3}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Step 3: Lead Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover, plan, and strategically organize your lead sources to build a comprehensive lead generation system that feeds your HighLevel platform.
          </p>
        </div>

        {/* How This Works Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">💡</span>
              <span className="text-lg font-semibold text-gray-900">How This Works</span>
            </div>
            {isHowThisWorksOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Planning Focus</h3>
                  <p className="text-gray-600 text-sm">
                    Step 3 focuses on strategic planning rather than measurement. We help you identify current lead sources and plan expansion opportunities before setting up proper tracking in HighLevel.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📊 Foundation Building</h3>
                  <p className="text-gray-600 text-sm">
                    This step prepares the foundation for accurate measurement in later steps. We plan the lead sources and scoring system that will be implemented in your HighLevel platform.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Recommendations</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI analyzes your business type and current lead sources to recommend high-ROI expansion opportunities and strategic lead generation approaches.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">⚙️ HighLevel Preparation</h3>
                  <p className="text-gray-600 text-sm">
                    We generate a comprehensive setup checklist to ensure your HighLevel platform is configured correctly for accurate lead tracking and scoring from day one.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub Steps Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {steps.map((step) => (
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === step.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Current Lead Sources */}
            {activeTab === 'current-sources' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Lead Sources Audit</h3>
                  <p className="text-gray-600">
                    Identify and catalog the lead generation channels you're currently using. This inventory will help us understand your existing foundation and identify gaps for expansion.
                  </p>
                </div>

                <div className="mb-6">
                  <button
                    onClick={() => setShowAddLeadSourceModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    + Add Current Lead Source
                  </button>
                </div>

                {/* Display Current Lead Sources */}
                {(currentLeadSources || []).length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(currentLeadSources || []).map((source) => (
                      <div key={source.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{source.name}</h4>
                          <button
                            onClick={() => handleDeleteLeadSource(source.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Type:</span> {source.type}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Category:</span> {source.channelCategory}
                        </p>
                        {source.description && (
                          <p className="text-sm text-gray-600">{source.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(currentLeadSources || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No lead sources added yet. Click "Add Current Lead Source" to get started.</p>
                  </div>
                )}
              </div>
            )}

            {/* Expansion Opportunities */}
            {activeTab === 'expansion-opportunities' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Lead Source Expansion Opportunities</h3>
                  <p className="text-gray-600">
                    Discover new lead generation channels and growth opportunities specifically tailored to your market and business model.
                  </p>
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={handleAILeadStrategy}
                    className="bg-yellow-green-500 hover:bg-yellow-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    style={{ backgroundColor: '#d7df21' }}
                  >
                    <span className="mr-2">🤖</span>
                    Get AI Recommendations
                  </button>
                  <button
                    onClick={() => setShowAddExpansionModal(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    + Add Potential Source
                  </button>
                </div>

                {/* AI Lead Strategy Results */}
                {aiLeadStrategy && (
                  <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">🤖 AI Lead Strategy Recommendations</h4>
                    
                    {/* Top Lead Sources */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-blue-800 mb-3">Top Recommended Lead Sources</h5>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(aiLeadStrategy.topLeadSources || []).map((source, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="font-semibold text-gray-900">{source.name}</h6>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                source.priority === 'High' ? 'bg-red-100 text-red-800' :
                                source.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {source.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                            <p className="text-sm font-medium text-blue-600">Expected ROI: {source.expectedROI}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Qualification Criteria */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-blue-800 mb-3">Lead Qualification Criteria</h5>
                      <div className="grid md:grid-cols-3 gap-4">
                        {(aiLeadStrategy.qualificationCriteria || []).map((criteria, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                            <h6 className="font-semibold text-gray-900 mb-2">{criteria.name}</h6>
                            <p className="text-sm text-gray-600">{criteria.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking Metrics */}
                    <div>
                      <h5 className="font-semibold text-blue-800 mb-3">Key Tracking Metrics</h5>
                      <div className="grid md:grid-cols-3 gap-4">
                        {(aiLeadStrategy.trackingMetrics || []).map((metric, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                            <h6 className="font-semibold text-gray-900 mb-2">{metric.name}</h6>
                            <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              metric.importance === 'Critical' ? 'bg-red-100 text-red-800' :
                              metric.importance === 'High' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {metric.importance}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Display Expansion Opportunities */}
                {(expansionOpportunities || []).length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(expansionOpportunities || []).map((opportunity) => (
                      <div key={opportunity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{opportunity.name}</h4>
                          <button
                            onClick={() => handleDeleteExpansionOpportunity(opportunity.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Type:</span> {opportunity.type}
                        </p>
                        {opportunity.priority && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Priority:</span> {opportunity.priority}
                          </p>
                        )}
                        {opportunity.description && (
                          <p className="text-sm text-gray-600">{opportunity.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(expansionOpportunities || []).length === 0 && !aiLeadStrategy && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No expansion opportunities identified yet. Use AI recommendations or add potential sources manually.</p>
                  </div>
                )}
              </div>
            )}

            {/* HighLevel Setup */}
            {activeTab === 'highlevel-setup' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">HighLevel Lead Scoring & Tracking Setup</h3>
                  <p className="text-gray-600">
                    Prepare your HighLevel platform configuration for accurate lead tracking, scoring, and attribution. This checklist ensures proper setup from day one.
                  </p>
                </div>

                <div className="mb-6">
                  <button
                    onClick={handleGenerateSetupChecklist}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <span className="mr-2">📋</span>
                    Generate Setup Checklist
                  </button>
                </div>

                {highlevelSetup && (
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">HighLevel Configuration Checklist</h4>
                        <button
                          onClick={() => {
                            setHighlevelSetup(null);
                            storageOptimizer.setStep3Data('highlevel_setup', null);
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Clear Checklist
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {highlevelSetup.categories.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-3">{category.title}</h5>
                            <div className="space-y-2">
                              {category.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="flex items-start">
                                  <input
                                    type="checkbox"
                                    className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!highlevelSetup && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Click "Generate Setup Checklist" to create your HighLevel configuration guide.</p>
                  </div>
                )}
              </div>
            )}

            {/* Milestone Reflection */}
            {activeTab === 'milestone-reflection' && (
              <div className="text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">🎉</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Congratulations! Lead Intelligence Planning Complete
                  </h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    You've successfully completed your lead intelligence planning phase. You now have a comprehensive understanding of your current lead sources, expansion opportunities, and a clear roadmap for HighLevel implementation.
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-8 border border-green-200">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">What You've Accomplished:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">✓</span>
                      <span className="text-green-800">Audited your current lead generation channels</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">✓</span>
                      <span className="text-green-800">Identified expansion opportunities for growth</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">✓</span>
                      <span className="text-green-800">Received AI-powered lead strategy recommendations</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">✓</span>
                      <span className="text-green-800">Prepared HighLevel setup checklist for implementation</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Next Steps</h4>
                  <p className="text-blue-800">
                    In Step 4, you'll begin implementing these lead sources and setting up proper tracking in your HighLevel platform. The foundation you've built here will ensure accurate measurement and optimization moving forward.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter 
          currentStep={3} 
          showNextButton={activeTab === 'milestone-reflection'}
        />
      </div>

      {/* Lead Source Modal */}
      {showAddLeadSourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Current Lead Source</h3>
                <button
                  onClick={() => {
                    setShowAddLeadSourceModal(false);
                    resetLeadSourceForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitLeadSource} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source Type *
                    </label>
                    <select
                      value={leadSourceForm.type}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a type...</option>
                      {leadSourceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Source Name *
                    </label>
                    <input
                      type="text"
                      value={leadSourceForm.name}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., LinkedIn Content Strategy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Channel Category *
                    </label>
                    <select
                      value={leadSourceForm.channelCategory}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, channelCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select category...</option>
                      <option value="Organic">Organic</option>
                      <option value="Paid">Paid</option>
                      <option value="Referral">Referral</option>
                      <option value="Direct">Direct</option>
                      <option value="Social">Social</option>
                      <option value="Email">Email</option>
                      <option value="Content">Content</option>
                      <option value="Events">Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Effort Level
                    </label>
                    <select
                      value={leadSourceForm.effortLevel}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, effortLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select effort level...</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Investment
                    </label>
                    <select
                      value={leadSourceForm.timeInvestment}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, timeInvestment: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select time investment...</option>
                      <option value="1-5 hours/week">1-5 hours/week</option>
                      <option value="6-10 hours/week">6-10 hours/week</option>
                      <option value="11-20 hours/week">11-20 hours/week</option>
                      <option value="20+ hours/week">20+ hours/week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skill Level Required
                    </label>
                    <select
                      value={leadSourceForm.skillLevel}
                      onChange={(e) => setLeadSourceForm({...leadSourceForm, skillLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select skill level...</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={leadSourceForm.description}
                    onChange={(e) => setLeadSourceForm({...leadSourceForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe how this lead source works for your business..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddLeadSourceModal(false);
                      resetLeadSourceForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Add Lead Source
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Expansion Opportunity Modal */}
      {showAddExpansionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add Expansion Opportunity</h3>
                <button
                  onClick={() => {
                    setShowAddExpansionModal(false);
                    resetExpansionForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitExpansionOpportunity} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opportunity Name *
                    </label>
                    <input
                      type="text"
                      value={expansionForm.name}
                      onChange={(e) => setExpansionForm({...expansionForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., YouTube Channel Strategy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opportunity Type *
                    </label>
                    <select
                      value={expansionForm.type}
                      onChange={(e) => setExpansionForm({...expansionForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a type...</option>
                      {expansionTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={expansionForm.priority}
                      onChange={(e) => setExpansionForm({...expansionForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select priority...</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={expansionForm.description}
                    onChange={(e) => setExpansionForm({...expansionForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Describe this expansion opportunity and why it's valuable for your business..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddExpansionModal(false);
                      resetExpansionForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Add Opportunity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AI Modal */}
      <AIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Lead Strategy Generator"
        description="Generating personalized lead strategy recommendations based on your business profile and current lead sources."
        isLoading={aiLoading}
        content={aiLeadStrategy}
      />

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default Step3;

