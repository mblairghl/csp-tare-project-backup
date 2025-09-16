import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, X, FileText, Lightbulb } from 'lucide-react';

// Completely new Step2 component with fresh internal structure
const ContentAuditStep = () => {
  // State management
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [contentItems, setContentItems] = useState([]);
  const [funnelMapping, setFunnelMapping] = useState({
    discover: [],
    resonate: [],
    envision: [],
    trust: [],
    authority: []
  });
  const [copyContent, setCopyContent] = useState('');
  
  // UI states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [newItem, setNewItem] = useState({ type: '', name: '', description: '' });

  // Step configuration
  const stepConfig = [
    { id: 0, name: 'Content Library', done: false },
    { id: 1, name: 'Marketing Copy & TARE', done: false },
    { id: 2, name: 'Milestone Reflection', done: false }
  ];

  // Funnel stages
  const funnelStages = [
    { 
      key: 'discover', 
      name: 'Discover the Possibility', 
      style: 'bg-blue-100 border-blue-300 text-blue-800',
      info: 'They become aware that a better way exists.'
    },
    { 
      key: 'resonate', 
      name: 'Resonate with the Mission', 
      style: 'bg-green-100 border-green-300 text-green-800',
      info: 'They connect emotionally with your message and positioning.'
    },
    { 
      key: 'envision', 
      name: 'Envision Their Transformation', 
      style: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      info: 'They see the tangible results of working with you.'
    },
    { 
      key: 'trust', 
      name: 'Trust the Process', 
      style: 'bg-orange-100 border-orange-300 text-orange-800',
      info: 'They gain confidence in your ability to deliver.'
    },
    { 
      key: 'authority', 
      name: 'Step Into Authority', 
      style: 'bg-purple-100 border-purple-300 text-purple-800',
      info: 'They are ready to take action and invest.'
    }
  ];

  // Content types
  const contentTypeOptions = [
    'Article', 'Blog Post', 'Video', 'Podcast', 'Webinar', 'E-book', 'Guide', 
    'Case Study', 'Template', 'Checklist', 'Infographic', 'Course', 'Workshop'
  ];

  // Load saved data
  useEffect(() => {
    const savedItems = localStorage.getItem('step2_content_items');
    const savedMapping = localStorage.getItem('step2_funnel_mapping');
    const savedCopy = localStorage.getItem('step2_copy_content');
    
    if (savedItems) setContentItems(JSON.parse(savedItems));
    if (savedMapping) setFunnelMapping(JSON.parse(savedMapping));
    if (savedCopy) setCopyContent(savedCopy);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('step2_content_items', JSON.stringify(contentItems));
  }, [contentItems]);

  useEffect(() => {
    localStorage.setItem('step2_funnel_mapping', JSON.stringify(funnelMapping));
  }, [funnelMapping]);

  useEffect(() => {
    localStorage.setItem('step2_copy_content', copyContent);
  }, [copyContent]);

  // Add content handler
  const addContentItem = () => {
    if (newItem.name && newItem.type) {
      const item = {
        id: Date.now(),
        ...newItem
      };
      setContentItems(prev => [...prev, item]);
      setNewItem({ type: '', name: '', description: '' });
      setShowAddModal(false);
    }
  };

  // Generate marketing copy
  const generateCopy = () => {
    const sampleCopy = `# TARE Framework Marketing Copy

## TRUST - Building Confidence
Our proven methodology has helped hundreds of business owners achieve consistent results.

## AUTHORITY - Establishing Leadership  
Industry leaders trust our systematic approach to business growth.

## RESULTS - Demonstrating Outcomes
See measurable impact through our data-driven strategies.

## EXPERTISE - Showcasing Knowledge
Deep understanding from years of hands-on experience and success.`;
    
    setCopyContent(sampleCopy);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Step 2: Content Audit & Mapping</h1>
          <p className="text-gray-600">Organize your content and map it to your customer journey for maximum impact.</p>
        </div>

        {/* How This Works */}
        <div className="mb-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">How This Step Works</h3>
            </div>
            {showHowItWorks ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {showHowItWorks && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Library</h4>
                  <p className="text-sm text-gray-600">Add and organize your content assets</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Marketing Copy</h4>
                  <p className="text-sm text-gray-600">Generate TARE framework messaging</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Milestone</h4>
                  <p className="text-sm text-gray-600">Celebrate your progress</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {stepConfig.map((step) => {
              const isActive = currentSubStep === step.id;
              const isAccessible = step.id <= currentSubStep || step.done;

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && setCurrentSubStep(step.id)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-green-600 bg-green-50'
                      : isAccessible
                      ? 'border-gray-300 bg-white hover:border-green-600'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    step.done
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-green-600 text-white'
                      : isAccessible
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{step.id + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-green-600' : isAccessible ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Areas */}
        <div className="space-y-8">
          {/* Sub-step 1: Content Library */}
          {currentSubStep === 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Content Tools */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Content Asset</h4>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content Asset</span>
                  </button>
                </div>
              </div>

              {/* Right: Funnel Stages */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Funnel Content Goal</h3>
                <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
                
                <div className="space-y-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.key} className={`border-2 border-dashed rounded-lg p-4 ${stage.style}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{stage.name}</h4>
                        <span className="text-sm">{funnelMapping[stage.key].length} items</span>
                      </div>
                      <p className="text-sm mb-3">{stage.info}</p>
                      
                      {funnelMapping[stage.key].length > 0 ? (
                        <div className="space-y-2">
                          {funnelMapping[stage.key].map((item) => (
                            <div key={item.id} className="bg-white bg-opacity-70 rounded p-2">
                              <span className="font-medium text-gray-900">{item.name}</span>
                              <span className="text-xs text-gray-600 ml-2">{item.type}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 opacity-60">
                          No content assigned
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 2: Marketing Copy */}
          {currentSubStep === 1 && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Copy & TARE Framework</h3>
              <p className="text-gray-600 mb-6">Generate comprehensive marketing copy based on the TARE framework.</p>
              
              <button
                onClick={generateCopy}
                className="w-full mb-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>Generate Marketing Copy</span>
              </button>

              {copyContent && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Generated Marketing Copy</h4>
                  <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{copyContent}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection */}
          {currentSubStep === 2 && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Step 2 Milestone Celebration!</h3>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
                    <span className="text-gray-700">Built comprehensive content library ({Object.values(funnelMapping).flat().length} pieces)</span>
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
                  Your strategic content audit and mapping from this step becomes the backbone of your entire authority-building system. Combined with your ideal client personas from Step 1, this content foundation will drive targeted lead generation, personalized funnel experiences, and compelling sales conversations. Every piece of content now has a strategic purpose and placement in your customer journey.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add Content Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Content Asset</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
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
                    value={newItem.type}
                    onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Select type...</option>
                    {contentTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Enter content name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    rows="3"
                    placeholder="Brief description..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addContentItem}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Add Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-0">
            <a 
              href="/step/1"
              className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-blue-600 hover:bg-blue-700"
            >
              <span className="text-sm lg:text-base">← Back to Step 1</span>
            </a>
            
            {currentSubStep === 2 ? (
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

export default ContentAuditStep;

