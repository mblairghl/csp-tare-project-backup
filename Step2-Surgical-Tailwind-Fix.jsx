import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, X, FileText, Lightbulb } from 'lucide-react';

const Step2 = () => {
  // State management
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [contentLibrary, setContentLibrary] = useState([]);
  const [funnelContent, setFunnelContent] = useState({
    discover: [],
    resonate: [],
    envision: [],
    trust: [],
    authority: []
  });
  const [marketingCopy, setMarketingCopy] = useState('');
  
  // Modal states
  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [newContentForm, setNewContentForm] = useState({
    type: '',
    name: '',
    description: '',
    notes: ''
  });
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration - ADDED NUMBERS
  const subSteps = [
    { id: 0, title: 'Content Library', completed: false, number: '1' },
    { id: 1, title: 'Marketing Copy & TARE', completed: false, number: '2' },
    { id: 2, title: 'Milestone Reflection', completed: false, number: '3' }
  ];

  // Funnel stages
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
      color: 'bg-yellow-100 border-yellow-300', 
      textColor: 'text-yellow-800',
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
      color: 'bg-purple-100 border-purple-300', 
      textColor: 'text-purple-800',
      description: 'They are ready to take action and invest.'
    }
  ];

  // Content types
  const contentTypes = [
    'Article', 'Blog Post', 'Video', 'Podcast', 'Webinar', 'E-book', 'Guide', 
    'Case Study', 'Template', 'Checklist', 'Infographic', 'Course', 'Workshop'
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedContentLibrary = localStorage.getItem('step2_contentLibrary');
    const savedFunnelContent = localStorage.getItem('step2_funnelContent');
    const savedMarketingCopy = localStorage.getItem('step2_marketingCopy');
    
    if (savedContentLibrary) {
      setContentLibrary(JSON.parse(savedContentLibrary));
    }
    if (savedFunnelContent) {
      setFunnelContent(JSON.parse(savedFunnelContent));
    }
    if (savedMarketingCopy) {
      setMarketingCopy(savedMarketingCopy);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('step2_contentLibrary', JSON.stringify(contentLibrary));
  }, [contentLibrary]);

  useEffect(() => {
    localStorage.setItem('step2_funnelContent', JSON.stringify(funnelContent));
  }, [funnelContent]);

  useEffect(() => {
    localStorage.setItem('step2_marketingCopy', marketingCopy);
  }, [marketingCopy]);

  // Add new content
  const handleAddContent = () => {
    if (newContentForm.name && newContentForm.type) {
      const newContent = {
        id: Date.now(),
        ...newContentForm
      };
      setContentLibrary(prev => [...prev, newContent]);
      setNewContentForm({ type: '', name: '', description: '', notes: '' });
      setAddContentModalOpen(false);
    }
  };

  // Remove content from library
  const handleRemoveContent = (contentId) => {
    setContentLibrary(prev => prev.filter(item => item.id !== contentId));
    
    // Also remove from funnel content if it was placed
    const updatedFunnelContent = { ...funnelContent };
    Object.keys(updatedFunnelContent).forEach(stage => {
      updatedFunnelContent[stage] = updatedFunnelContent[stage].filter(item => item.id !== contentId);
    });
    setFunnelContent(updatedFunnelContent);
  };

  // Add content to funnel stage
  const addToFunnelStage = (content, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: [...prev[stage], content]
    }));
  };

  // Remove content from funnel stage
  const removeFromFunnelStage = (contentId, stage) => {
    setFunnelContent(prev => ({
      ...prev,
      [stage]: prev[stage].filter(item => item.id !== contentId)
    }));
  };

  // Generate Marketing Copy
  const handleGenerateMarketingCopy = async () => {
    const copy = `# TARE Framework Marketing Copy

## TRUST - Building Confidence in Your Expertise

Your proven track record speaks volumes. With ${Object.values(funnelContent).flat().length} pieces of strategic content mapped across your customer journey, you've demonstrated the depth and breadth of your knowledge.

## AUTHORITY - Establishing Your Thought Leadership

You're not just another expert in your field - you're a strategic thinker who understands the psychology of customer transformation.

## RESULTS - Demonstrating Tangible Outcomes

Your content strategy is designed for measurable impact:
- ${funnelContent.discover.length} pieces focused on problem awareness and education
- ${funnelContent.resonate.length} pieces that build emotional connection and trust
- ${funnelContent.envision.length} pieces showcasing transformation and results
- ${funnelContent.trust.length} pieces establishing credibility and process confidence
- ${funnelContent.authority.length} pieces positioning you as the go-to expert

## EXPERTISE - Showcasing Deep Knowledge

Your systematic approach to content mapping reveals the depth of your expertise.`;

    setMarketingCopy(copy);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* USING SAME CONTAINER APPROACH AS WORKING DASHBOARD */}
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
            <div className="px-6 pb-6 border-t border-gray-200">
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

        {/* Action Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Steps</h2>
          <p className="text-gray-600 mb-6">Complete all Action Steps below before moving to the next Step page.</p>
          
          {/* NUMBERED ACTION STEPS - USING TAILWIND CLASSES LIKE DASHBOARD */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex flex-wrap justify-center gap-4">
              {subSteps.map((step, index) => {
                const isCompleted = step.completed;
                const isActive = activeSubStep === step.id;
                const isUnlocked = step.id <= activeSubStep || isCompleted;

                return (
                  <button
                    key={step.id}
                    onClick={() => isUnlocked && setActiveSubStep(step.id)}
                    disabled={!isUnlocked}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all min-w-[200px] ${
                      isActive
                        ? 'border-green-500 bg-white'
                        : isUnlocked
                        ? 'border-gray-300 bg-white hover:border-green-500 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-green-500 text-white'
                        : isUnlocked
                          ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <span>{step.number}</span>
                        )}
                      </div>
                      <span className={`text-sm font-medium text-center ${
                        isActive
                          ? 'text-green-500'
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
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Sub-step 1: Content Library - TWO COLUMN LAYOUT */}
          {activeSubStep === 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Content Tools */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Content Asset</h4>
                  <button
                    onClick={() => setAddContentModalOpen(true)}
                    className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content Asset</span>
                  </button>
                </div>

                {/* LARGER Content Library Display */}
                {contentLibrary.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Library ({contentLibrary.length})</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {contentLibrary.map((content) => (
                        <div key={content.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 text-base">{content.name}</h5>
                              <p className="text-sm text-gray-600 font-medium">{content.type}</p>
                              {content.description && (
                                <p className="text-sm text-gray-700 mt-2">{content.description}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveContent(content.id)}
                              className="text-red-500 hover:text-red-700 ml-4 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Funnel Content Goal (ONLY shown in sub-step 1) */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Funnel Content Goal</h3>
                <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
                
                <div className="space-y-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className={`border-2 border-dashed rounded-lg p-4 ${stage.color}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                        <span className={`text-sm ${stage.textColor}`}>
                          {funnelContent[stage.id].length} items
                        </span>
                      </div>
                      <p className={`text-sm ${stage.textColor} mb-3`}>
                        {stage.description}
                      </p>
                      
                      {funnelContent[stage.id].length > 0 ? (
                        <div className="space-y-2">
                          {funnelContent[stage.id].map((content) => (
                            <div key={content.id} className="bg-white bg-opacity-70 rounded p-3 flex justify-between items-center">
                              <div>
                                <span className="font-medium text-gray-900">{content.name}</span>
                                <span className="text-xs text-gray-600 ml-2">{content.type}</span>
                              </div>
                              <button
                                onClick={() => removeFromFunnelStage(content.id, stage.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-6 ${stage.textColor} opacity-60`}>
                          No content assigned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 2: Marketing Copy & TARE - SINGLE COLUMN */}
          {activeSubStep === 1 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE Framework</h3>
                <p className="text-gray-600 mb-6">Generate comprehensive marketing copy based on the TARE framework.</p>
                
                <button
                  onClick={handleGenerateMarketingCopy}
                  className="w-full mb-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Generate Marketing Copy</span>
                </button>

                {marketingCopy && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Generated Marketing Copy</h4>
                    <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">{marketingCopy}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection - SINGLE COLUMN with Step 1 format */}
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
                      <span className="text-gray-700">Mapped content to strategic funnel stages</span>
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
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🏗️</span>
                    <h4 className="text-lg font-semibold text-blue-900">Building Your Authority Foundation:</h4>
                  </div>
                  <p className="text-blue-800 leading-relaxed">
                    Your strategic content audit and mapping from this step becomes the backbone of your entire authority-building system. Combined with your ideal client personas from Step 1, this content foundation will drive targeted lead generation, personalized funnel experiences, and compelling sales conversations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Content Modal */}
        {addContentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Content Asset</h3>
                  <button
                    onClick={() => setAddContentModalOpen(false)}
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
                  onClick={() => setAddContentModalOpen(false)}
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

        {/* Custom Step Footer - USING TAILWIND CLASSES LIKE DASHBOARD */}
        <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-0">
            <a 
              href="/step/1"
              className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-blue-600 hover:bg-blue-700"
            >
              <span className="text-sm lg:text-base">← Back to Step 1</span>
            </a>
            
            {/* Show orange "Continue To Step 3" button when on milestone reflection */}
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
          
          <div className="text-center py-4 lg:py-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm lg:text-base">
              © 2025 Cultivating Sales, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;

