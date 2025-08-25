import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';

const Step3 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiLeadStrategy, setAiLeadStrategy] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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
      <div className="max-w-4xl mx-auto p-6">
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
                  Let's inventory the lead generation channels you're currently using. This helps us understand your starting point before planning improvements.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Add Your Current Lead Sources</h4>
                    <p className="text-green-700 text-sm mb-4">
                      List each lead generation method you're currently using. Don't worry about metrics - we're just taking inventory.
                    </p>
                    
                    <button 
                      onClick={() => {
                        alert('Add Current Lead Source modal coming soon!');
                      }}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-green-700"
                    >
                      + Add Current Lead Source
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <h4 className="text-gray-600 font-medium mb-2">No Lead Sources Added Yet</h4>
                    <p className="text-gray-500 text-sm">
                      Start by adding your current lead generation channels. Examples: LinkedIn outreach, referrals, content marketing, networking events, etc.
                    </p>
                  </div>
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
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">🤖 AI Lead Source Recommendations</h4>
                    <p className="text-blue-700 text-sm mb-4">
                      Get personalized lead source suggestions based on your business type, target market, and current channels.
                    </p>
                    
                    <button 
                      onClick={handleAILeadStrategy}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-blue-700"
                    >
                      🚀 Get AI Recommendations
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3">💡 Manual Research</h4>
                    <p className="text-yellow-700 text-sm mb-4">
                      Research and add potential lead sources you've identified through market analysis or competitor research.
                    </p>
                    
                    <button 
                      onClick={() => {
                        alert('Add Potential Lead Source modal coming soon!');
                      }}
                      className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-yellow-700"
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
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-3">🎯 Lead Scoring Criteria</h4>
                    <p className="text-purple-700 text-sm mb-4">
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
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">📊 Tracking Configuration</h4>
                    <p className="text-orange-700 text-sm mb-4">
                      Set up proper attribution and tracking tags for each lead source in HighLevel.
                    </p>
                    
                    <button 
                      onClick={() => {
                        alert('HighLevel configuration guide coming soon!');
                      }}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-orange-700"
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
      </div>
    </div>
  );
};

export default Step3;
