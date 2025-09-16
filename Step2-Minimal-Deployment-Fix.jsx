import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, X, FileText, Lightbulb, RefreshCw } from 'lucide-react';

const Step2 = () => {
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [contentLibrary, setContentLibrary] = useState([]);
  const [funnelContent, setFunnelContent] = useState({
    discover: [], resonate: [], envision: [], trust: [], authority: []
  });
  const [marketingCopy, setMarketingCopy] = useState('');
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [showGapModal, setShowGapModal] = useState(false);
  const [gapSuggestions, setGapSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');
  const [newContentForm, setNewContentForm] = useState({
    type: '', name: '', description: '', notes: ''
  });

  // Confetti effect for milestone reflection
  useEffect(() => {
    if (activeSubStep === 2) {
      const createConfetti = () => {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.style.position = 'absolute';
          confetti.style.width = '10px';
          confetti.style.height = '10px';
          confetti.style.backgroundColor = ['#fbae42', '#0e9246', '#d7df21', '#467A8f'][Math.floor(Math.random() * 4)];
          confetti.style.left = Math.random() * 100 + '%';
          confetti.style.top = '-10px';
          confetti.style.borderRadius = '50%';
          confetti.style.animation = `confetti-fall ${2 + Math.random() * 3}s linear forwards`;
          confettiContainer.appendChild(confetti);
        }

        if (!document.getElementById('confetti-styles')) {
          const style = document.createElement('style');
          style.id = 'confetti-styles';
          style.textContent = `
            @keyframes confetti-fall {
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }

        setTimeout(() => {
          if (document.body.contains(confettiContainer)) {
            document.body.removeChild(confettiContainer);
          }
        }, 5000);
      };

      createConfetti();
    }
  }, [activeSubStep]);

  // Content types and funnel stages
  const contentTypes = [
    'Article', 'Blog Post', 'Video', 'Podcast', 'Webinar', 'E-book', 'Guide', 
    'Case Study', 'Template', 'Checklist', 'Infographic', 'Course', 'Workshop'
  ];

  const funnelStages = [
    { 
      id: 'discover', 
      title: 'Discover the Possibility', 
      color: 'bg-blue-100 border-blue-300', 
      textColor: 'text-blue-800',
      description: 'They become aware that a better way exists.'
    },
    { 
      id: 'resonate', 
      title: 'Resonate with the Mission', 
      color: 'bg-green-100 border-green-300', 
      textColor: 'text-green-800',
      description: 'They connect emotionally with your message and positioning.'
    },
    { 
      id: 'envision', 
      title: 'Envision Their Transformation', 
      color: 'bg-purple-100 border-purple-300', 
      textColor: 'text-purple-800',
      description: 'They see the tangible results of working with you.'
    },
    { 
      id: 'trust', 
      title: 'Trust the Process', 
      color: 'bg-orange-100 border-orange-300', 
      textColor: 'text-orange-800',
      description: 'They gain confidence in your ability to deliver.'
    },
    { 
      id: 'authority', 
      title: 'Step Into Authority', 
      color: 'bg-red-100 border-red-300', 
      textColor: 'text-red-800',
      description: 'They are ready to take action and invest.'
    }
  ];

  const subSteps = [
    { id: 0, title: 'Content Library', completed: false, number: '1' },
    { id: 1, title: 'Marketing Copy & TARE', completed: false, number: '2' },
    { id: 2, title: 'Milestone Reflection', completed: false, number: '3' }
  ];

  // Helper functions
  const addToFunnelStage = (content, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: [...prev[stage], content]
    }));
  };

  const removeFromFunnelStage = (contentId, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: prev[stage].filter(item => item.id !== contentId)
    }));
  };

  const getTotalContentCount = () => {
    return Object.values(funnelContent).reduce((total, stageContent) => total + stageContent.length, 0);
  };

  const handleAddContent = () => {
    if (newContentForm.type && newContentForm.name) {
      const newContent = {
        id: Date.now(),
        ...newContentForm
      };
      setContentLibrary(prev => [...prev, newContent]);
      setNewContentForm({ type: '', name: '', description: '', notes: '' });
      setShowAddContentModal(false);
    }
  };

  // AI Gap Analysis
  const generateSuggestions = async (stageId) => {
    setIsGenerating(true);
    setSelectedStage(stageId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const stage = funnelStages.find(s => s.id === stageId);
      
      const stageSpecificSuggestions = {
        discover: [
          {
            type: 'Blog Post',
            name: '5 Signs You Need a Better Business Strategy',
            description: 'Help prospects recognize they have a problem worth solving',
            stage: stageId
          },
          {
            type: 'Video',
            name: 'The Hidden Cost of Staying Where You Are',
            description: 'Create urgency around the status quo',
            stage: stageId
          },
          {
            type: 'Infographic',
            name: 'Industry Transformation Timeline',
            description: 'Show how the landscape is changing',
            stage: stageId
          }
        ],
        resonate: [
          {
            type: 'Case Study',
            name: 'How [Client] Transformed Their Business',
            description: 'Emotional connection through success stories',
            stage: stageId
          },
          {
            type: 'Video',
            name: 'Why Traditional Methods Are Failing',
            description: 'Position against outdated approaches',
            stage: stageId
          }
        ],
        envision: [
          {
            type: 'Guide',
            name: 'Your 90-Day Transformation Roadmap',
            description: 'Paint a picture of their future success',
            stage: stageId
          },
          {
            type: 'Calculator',
            name: 'ROI Impact Calculator',
            description: 'Quantify the transformation value',
            stage: stageId
          }
        ],
        trust: [
          {
            type: 'Webinar',
            name: 'Behind the Scenes: Our Proven Process',
            description: 'Build confidence in your methodology',
            stage: stageId
          },
          {
            type: 'Testimonial',
            name: 'Client Success Stories Collection',
            description: 'Social proof and credibility building',
            stage: stageId
          }
        ],
        authority: [
          {
            type: 'Consultation',
            name: 'Strategic Assessment Call',
            description: 'High-value discovery conversation',
            stage: stageId
          },
          {
            type: 'Proposal',
            name: 'Custom Solution Blueprint',
            description: 'Tailored approach presentation',
            stage: stageId
          }
        ]
      };
      
      setGapSuggestions(stageSpecificSuggestions[stageId] || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addSuggestion = (suggestion) => {
    const newContent = {
      id: Date.now(),
      ...suggestion
    };
    
    setContentLibrary(prev => [...prev, newContent]);
    addToFunnelStage(newContent, suggestion.stage);
  };

  const generateMoreIdeas = () => {
    if (selectedStage) {
      generateSuggestions(selectedStage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">STEP 2 OF 9</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Audit & Mapping</h1>
          <p className="text-gray-600">Organize your content and map it to the customer journey.</p>
        </div>

        {/* How This Step Works */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">?</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">How This Step Works</h3>
            </div>
            <div className="text-green-500">
              <span className="text-sm font-medium mr-2">Expand</span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 inline" />
              ) : (
                <ChevronDown className="w-5 h-5 inline" />
              )}
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 border-t border-gray-200 bg-white">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {[
                  {
                    title: "Content Library",
                    description: "Add content and organize your assets",
                    color: "bg-green-500"
                  },
                  {
                    title: "Gap Analysis", 
                    description: "Identify missing content opportunities",
                    color: "bg-yellow-500"
                  },
                  {
                    title: "Marketing Copy",
                    description: "Generate TARE framework messaging",
                    color: "bg-blue-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sub-step Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Steps</h2>
          <p className="text-gray-600 mb-6">Complete all Action Steps below before moving to the next Step page.</p>
          
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="grid md:grid-cols-3 gap-4">
              {subSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveSubStep(step.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeSubStep === step.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeSubStep === step.id
                        ? 'bg-green-500 text-white'
                        : step.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{step.number}</span>
                      )}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    activeSubStep === step.id ? 'text-green-700' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Sub-step 1: Content Library */}
          {activeSubStep === 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Content Management */}
              <div className="space-y-6">
                {/* Add New Content */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Content Asset</h3>
                  <button
                    onClick={() => setShowAddContentModal(true)}
                    className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content Asset</span>
                  </button>
                </div>

                {/* Gap Analysis */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Gap Analysis</h3>
                  <button
                    onClick={() => setShowGapModal(true)}
                    className="w-full px-4 py-3 bg-lime-500 text-black rounded-lg hover:bg-lime-600 flex items-center justify-center space-x-2"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>🧠 Get AI Ideas</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Funnel Content Goal */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Content Goal</h3>
                <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
                
                <div className="space-y-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className={`border-2 border-dashed rounded-lg p-4 ${stage.color}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                        <span className={`text-sm ${stage.textColor}`}>
                          {funnelContent[stage.id]?.length || 0} items
                        </span>
                      </div>
                      <p className={`text-sm ${stage.textColor} mb-3`}>{stage.description}</p>
                      
                      {funnelContent[stage.id]?.length > 0 ? (
                        <div className="space-y-2">
                          {funnelContent[stage.id].map((content) => (
                            <div key={content.id} className="bg-white rounded p-2 text-sm">
                              <span className="font-medium">{content.name}</span>
                              <span className="text-gray-500 ml-2">({content.type})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-sm ${stage.textColor} italic`}>No content assigned</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 2: Marketing Copy & TARE */}
          {activeSubStep === 1 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Marketing Copy & TARE Framework</h3>
                <p className="text-gray-600 mb-6">Generate persuasive marketing copy based on your content audit and persona data.</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Copy Framework</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option>TARE Framework (Trust, Authority, Results, Exclusivity)</option>
                    <option>Pain Agitation Solution</option>
                    <option>Before & After Bridge</option>
                  </select>
                </div>

                <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Add content first: Go back to the Content Library step and add some content assets to generate personalized marketing copy.</p>
                  <button
                    onClick={() => setActiveSubStep(0)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Add Content First
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection */}
          {activeSubStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Step 2 Milestone Celebration!</h3>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-green-900">Congratulations! 🎊</h4>
                      <p className="text-green-800">You've completed your Content Audit & Mapping foundation!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🎯</span>
                    <h4 className="text-lg font-semibold text-gray-900">What You've Accomplished:</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✅</span>
                      <span className="text-gray-700">Built comprehensive content library ({contentLibrary.length} pieces)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✅</span>
                      <span className="text-gray-700">Mapped content to strategic funnel stages ({getTotalContentCount()} total placements)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✅</span>
                      <span className="text-gray-700">Identified and filled critical content gaps</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✅</span>
                      <span className="text-gray-700">Generated TARE framework marketing copy</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🚀</span>
                    <h4 className="text-lg font-semibold text-gray-900">How This Impacts Your Success:</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1">📈</span>
                      <span className="text-gray-700"><strong>Step 3:</strong> Content strategy guides lead intelligence targeting</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-500 mr-3 mt-1">🎯</span>
                      <span className="text-gray-700"><strong>Step 4:</strong> Mapped content powers signature funnel creation</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-purple-500 mr-3 mt-1">💼</span>
                      <span className="text-gray-700"><strong>Step 5:</strong> TARE copy drives sales pipeline messaging</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">⚙️</span>
                      <span className="text-gray-700"><strong>CSP Setup:</strong> Content library enables automated nurture sequences</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🏗️</span>
                    <h4 className="text-lg font-semibold text-blue-900">Building Your Authority Foundation:</h4>
                  </div>
                  <p className="text-blue-800">
                    Your strategic content audit and mapping from this step becomes the backbone of your entire 
                    authority-building system. Combined with your ideal client personas from Step 1, this content 
                    foundation will drive targeted lead generation, personalized funnel experiences, and compelling 
                    sales conversations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <a 
              href="/step/1"
              className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-blue-600 hover:bg-blue-700"
            >
              <span className="text-sm lg:text-base">← Back to Step 1</span>
            </a>
            
            {activeSubStep === 2 ? (
              <a 
                href="/step/3"
                className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-orange-500 hover:bg-orange-600"
              >
                <span className="text-sm lg:text-base">Continue To Step 3 →</span>
              </a>
            ) : (
              <div className="px-4 lg:px-6 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-500 text-center">
                <span className="text-sm lg:text-base">Complete all sub-steps to continue</span>
              </div>
            )}
          </div>
          
          <div className="text-center py-4 lg:py-6 border-t border-gray-200 mt-6">
            <p className="text-gray-500 text-sm lg:text-base">
              © 2025 Cultivating Sales, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Add New Content Asset</h3>
                <button
                  onClick={() => setShowAddContentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={newContentForm.type}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select type...</option>
                  {contentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                <input
                  type="text"
                  value={newContentForm.name}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter content name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newContentForm.description}
                  onChange={(e) => setNewContentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Brief description of the content..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowAddContentModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gap Analysis Modal */}
      {showGapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">🧠 AI Content Gap Analysis</h3>
                <button
                  onClick={() => setShowGapModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Identify content gaps and get AI-powered suggestions for each funnel stage.</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Current Content Distribution</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {funnelStages.map((stage) => {
                    const current = funnelContent[stage.id]?.length || 0;
                    const goal = 2;
                    const gap = Math.max(0, goal - current);
                    
                    return (
                      <div key={stage.id} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 text-sm mb-2">{stage.title}</h5>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Current: {current}</span>
                          <span className="text-sm text-gray-600">Goal: {goal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full ${current >= goal ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min(100, (current / goal) * 100)}%` }}
                          ></div>
                        </div>
                        {gap > 0 && (
                          <button
                            onClick={() => generateSuggestions(stage.id)}
                            disabled={isGenerating}
                            className="w-full px-3 py-2 text-sm bg-lime-500 text-black rounded-md hover:bg-lime-600 disabled:bg-gray-300 flex items-center justify-center space-x-1"
                          >
                            <Lightbulb className="w-4 h-4" />
                            <span>Get Ideas ({gap} needed)</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {gapSuggestions.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">
                      AI Suggestions for "{funnelStages.find(s => s.id === selectedStage)?.title}"
                    </h4>
                    <button
                      onClick={generateMoreIdeas}
                      disabled={isGenerating}
                      className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:bg-gray-100 flex items-center space-x-1"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>More Ideas</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {gapSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-blue-600">{suggestion.type}</span>
                              <span className="text-xs text-gray-500">
                                Recommended for: {funnelStages.find(s => s.id === suggestion.stage)?.title}
                              </span>
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">{suggestion.name}</h5>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                          </div>
                          <button
                            onClick={() => addSuggestion(suggestion)}
                            className="ml-4 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1 text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add to {funnelStages.find(s => s.id === suggestion.stage)?.title.split(' ')[0]}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 text-gray-600">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating AI suggestions...</span>
                  </div>
                </div>
              )}

              {gapSuggestions.length === 0 && !isGenerating && (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click "Get Ideas" on any stage above to generate AI-powered content suggestions.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowGapModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2;

