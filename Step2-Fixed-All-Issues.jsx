import React, { useState, useEffect } from 'react';

const Step2 = () => {
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [showGapAnalysisModal, setShowGapAnalysisModal] = useState(false);
  const [contentLibrary, setContentLibrary] = useState([
    { id: 1, title: '5 Signs You Need a Better Business Strategy', type: 'Blog Post', stage: null },
    { id: 2, title: 'The Hidden Cost of Staying Where You Are', type: 'Video', stage: null },
    { id: 3, title: 'How [Client Name] Overcame [Specific Challenge]', type: 'Case Study', stage: null },
    { id: 4, title: 'Why Most Business Advice Fails', type: 'Article', stage: null },
    { id: 5, title: 'A Day in the Life: After Working Together', type: 'Video', stage: null },
    { id: 6, title: 'The [Outcome] Blueprint', type: 'Template', stage: null },
    { id: 7, title: 'Client Results: [Specific Metric] Improvement', type: 'Case Study', stage: null },
    { id: 8, title: 'Behind the Scenes: My Proven Process', type: 'Guide', stage: null },
    { id: 9, title: 'Exclusive: Advanced [Topic] Masterclass', type: 'Workshop', stage: null },
    { id: 10, title: 'The Complete Guide to [Transformation]', type: 'E-book', stage: null }
  ]);

  // Confetti effect for milestone reflection
  useEffect(() => {
    if (activeSubStep === 2) {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          width: 8px;
          height: 8px;
          z-index: 9999;
          pointer-events: none;
          animation: confetti-fall 3s linear forwards;
        }
      `;
      document.head.appendChild(style);

      const colors = ['#fbae42', '#0e9246', '#d7df21', '#467A8f'];
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);

        setTimeout(() => {
          if (document.body.contains(confetti)) {
            document.body.removeChild(confetti);
          }
        }, 5000);
      }

      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 5000);
    }
  }, [activeSubStep]);

  const subSteps = [
    { id: 0, title: 'Content Library', number: '1' },
    { id: 1, title: 'Content Assignment', number: '2' },
    { id: 2, title: 'Milestone Reflection', number: '3' }
  ];

  // Correct brand colors for funnel stages
  const funnelStages = [
    {
      id: 'discover',
      title: 'Discover the Possibility',
      description: 'They become aware that a better way exists.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800'
    },
    {
      id: 'resonate',
      title: 'Resonate with the Mission',
      description: 'They connect emotionally with your message and positioning.',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-800'
    },
    {
      id: 'envision',
      title: 'Envision Their Transformation',
      description: 'They see the tangible results of working with you.',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800'
    },
    {
      id: 'trust',
      title: 'Trust the Process',
      description: 'They gain confidence in your ability to deliver.',
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800'
    },
    {
      id: 'authority',
      title: 'Step Into Authority',
      description: 'They are ready to take action and invest.',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-800'
    }
  ];

  const assignContentToStage = (contentId, stageId) => {
    setContentLibrary(prev => prev.map(item => 
      item.id === contentId ? { ...item, stage: stageId } : item
    ));
  };

  const removeContentFromStage = (contentId) => {
    setContentLibrary(prev => prev.map(item => 
      item.id === contentId ? { ...item, stage: null } : item
    ));
  };

  const getContentForStage = (stageId) => {
    return contentLibrary.filter(item => item.stage === stageId);
  };

  const getUnassignedContent = () => {
    return contentLibrary.filter(item => item.stage === null);
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
              <span className="text-sm">{isHowThisWorksOpen ? '▲' : '▼'}</span>
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 border-t border-gray-200 bg-white">
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Library</h4>
                  <p className="text-sm text-gray-600">Add and organize your content assets</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Content Assignment</h4>
                  <p className="text-sm text-gray-600">Assign content to funnel stages</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Milestone Reflection</h4>
                  <p className="text-sm text-gray-600">Review your content mapping progress</p>
                </div>
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
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-gray-50 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeSubStep === step.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <span className="font-bold text-sm">{step.number}</span>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    activeSubStep === step.id ? 'text-orange-700' : 'text-gray-700'
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
            <div className="space-y-6">
              {/* Add New Content Asset */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Content Asset</h3>
                <button className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2 transition-colors">
                  <span>+ Add New Content Asset</span>
                </button>
              </div>

              {/* Content Library */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Library ({contentLibrary.length})</h3>
                
                <div className="space-y-3">
                  {contentLibrary.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                        {item.stage && (
                          <div className="text-xs text-green-600 mt-1">
                            Assigned to: {funnelStages.find(s => s.id === item.stage)?.title}
                          </div>
                        )}
                      </div>
                      <button className="text-red-500 hover:text-red-700">×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Gap Analysis */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Gap Analysis</h3>
                <button 
                  onClick={() => setShowGapAnalysisModal(true)}
                  className="w-full px-4 py-3 bg-lime-500 text-black rounded-lg hover:bg-lime-600 flex items-center justify-center space-x-2 transition-colors font-medium"
                >
                  <span>🧠 AI Content Gap Analysis</span>
                </button>
              </div>
            </div>
          )}

          {/* Sub-step 2: Content Assignment */}
          {activeSubStep === 1 && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Content Assignment</h3>
                <p className="text-gray-600 mb-6">Assign your content to the appropriate funnel stages. Goal: At least 2 content items per stage.</p>

                {/* Unassigned Content */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Unassigned Content</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getUnassignedContent().map((item) => (
                      <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                        <div className="text-sm text-gray-500 mb-3">{item.type}</div>
                        <select 
                          onChange={(e) => assignContentToStage(item.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          defaultValue=""
                        >
                          <option value="">Assign to stage...</option>
                          {funnelStages.map((stage) => (
                            <option key={stage.id} value={stage.id}>{stage.title}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funnel Stages with Assigned Content */}
                <div className="space-y-4">
                  {funnelStages.map((stage) => {
                    const assignedContent = getContentForStage(stage.id);
                    return (
                      <div key={stage.id} className={`border-2 border-dashed ${stage.borderColor} ${stage.bgColor} rounded-lg p-4`}>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                          <span className={`text-sm ${stage.textColor}`}>{assignedContent.length} items</span>
                        </div>
                        <p className={`text-sm ${stage.textColor} mb-3`}>{stage.description}</p>
                        
                        {assignedContent.length > 0 ? (
                          <div className="space-y-2">
                            {assignedContent.map((item) => (
                              <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded border">
                                <div>
                                  <div className={`text-sm ${stage.textColor} font-medium`}>{item.title}</div>
                                  <div className={`text-xs ${stage.textColor} opacity-75`}>{item.type}</div>
                                </div>
                                <button 
                                  onClick={() => removeContentFromStage(item.id)}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-sm ${stage.textColor} italic`}>No content assigned</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection */}
          {activeSubStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">🎉 Step 2 Complete!</h3>
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <p className="text-xl text-gray-700">Congratulations on completing your Content Audit & Mapping!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">🎯 What You've Accomplished</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✅</span>
                        <span className="text-green-800">Built comprehensive content library ({contentLibrary.length} pieces)</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✅</span>
                        <span className="text-green-800">Mapped content to strategic funnel stages</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✅</span>
                        <span className="text-green-800">Identified content gaps and opportunities</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✅</span>
                        <span className="text-green-800">Created strategic content distribution plan</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">🚀 Impact on Your Business</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Your strategic content audit and mapping creates the foundation for targeted lead generation, 
                      personalized customer journeys, and compelling sales conversations. This systematic approach 
                      ensures every piece of content serves a specific purpose in building authority and driving revenue.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-semibold text-orange-900 mb-2">🎊 Milestone Achieved!</h4>
                  <p className="text-orange-800">
                    You've successfully completed Step 2 of your Authority Revenue Toolkit. 
                    Your content is now strategically organized and ready to drive results!
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
              className="text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-blue-600 hover:bg-blue-700"
            >
              <span>← Back to Step 1</span>
            </a>
            
            {activeSubStep === 2 ? (
              <a 
                href="/step/3"
                className="text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-center bg-orange-500 hover:bg-orange-600"
              >
                <span>Continue To Step 3 →</span>
              </a>
            ) : (
              <div className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 text-gray-500 text-center">
                <span>Complete all sub-steps to continue</span>
              </div>
            )}
          </div>
          
          <div className="text-center py-6 border-t border-gray-200 mt-6">
            <p className="text-gray-500 text-sm">
              © 2025 Cultivating Sales, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* AI Content Gap Analysis Modal */}
      {showGapAnalysisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🧠</span>
                  <h3 className="text-xl font-semibold text-gray-900">AI Content Gap Analysis</h3>
                </div>
                <button 
                  onClick={() => setShowGapAnalysisModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">Identify content gaps and get AI-powered suggestions for each funnel stage.</p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funnelStages.map((stage) => {
                  const assignedContent = getContentForStage(stage.id);
                  const needed = Math.max(0, 2 - assignedContent.length);
                  
                  return (
                    <div key={stage.id} className={`${stage.bgColor} border ${stage.borderColor} rounded-lg p-4`}>
                      <h5 className={`font-medium ${stage.textColor} mb-2`}>{stage.title}</h5>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-sm ${stage.textColor}`}>Current: {assignedContent.length}</span>
                        <span className={`text-sm ${stage.textColor}`}>Goal: 2</span>
                      </div>
                      <button className="w-full px-3 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-600 text-sm font-medium transition-colors">
                        💡 Get Ideas ({needed > 0 ? `${needed} needed` : 'Complete'})
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setShowGapAnalysisModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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

