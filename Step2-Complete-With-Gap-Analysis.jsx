import React, { useState, useEffect } from 'react';

const Step2 = () => {
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGapAnalysisModal, setShowGapAnalysisModal] = useState(false);

  // Confetti effect for milestone reflection
  useEffect(() => {
    if (activeSubStep === 2) {
      setShowConfetti(true);
      // Create confetti animation
      const createConfetti = () => {
        const colors = ['#fbae42', '#0e9246', '#d7df21', '#467A8f'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        `;
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 50%;
            animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
          `;
          confettiContainer.appendChild(confetti);
        }

        // Add CSS animation
        if (!document.getElementById('confetti-animation')) {
          const style = document.createElement('style');
          style.id = 'confetti-animation';
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

        // Clean up after 4 seconds
        setTimeout(() => {
          if (document.body.contains(confettiContainer)) {
            document.body.removeChild(confettiContainer);
          }
          setShowConfetti(false);
        }, 4000);
      };

      createConfetti();
    }
  }, [activeSubStep]);

  const subSteps = [
    { id: 0, title: 'Content Library', number: '1' },
    { id: 1, title: 'Marketing Copy & TARE', number: '2' },
    { id: 2, title: 'Milestone Reflection', number: '3' }
  ];

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
                  <p className="text-sm text-gray-600">Add content and organize your assets</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Gap Analysis</h4>
                  <p className="text-sm text-gray-600">Identify missing content opportunities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Marketing Copy</h4>
                  <p className="text-sm text-gray-600">Generate TARE framework messaging</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Steps Navigation */}
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
                      : 'border-gray-200 bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeSubStep === step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <span className="font-bold text-sm">{step.number}</span>
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
                {/* Add New Content Asset */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Content Asset</h3>
                  <button className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2 transition-colors">
                    <span>+ Add New Content Asset</span>
                  </button>
                </div>

                {/* Content Library */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Library (20)</h3>
                  
                  {/* Sample content items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">5 Signs You Need a Better Business Strategy</div>
                        <div className="text-sm text-gray-500">Blog Post</div>
                      </div>
                      <button className="text-red-500 hover:text-red-700">×</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">The Hidden Cost of Staying Where You Are</div>
                        <div className="text-sm text-gray-500">Video</div>
                      </div>
                      <button className="text-red-500 hover:text-red-700">×</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">How [Client Name] Overcame [Specific Challenge]</div>
                        <div className="text-sm text-gray-500">Case Study</div>
                      </div>
                      <button className="text-red-500 hover:text-red-700">×</button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Why Most Business Advice Fails</div>
                        <div className="text-sm text-gray-500">Article</div>
                      </div>
                      <button className="text-red-500 hover:text-red-700">×</button>
                    </div>
                  </div>
                </div>

                {/* Content Gap Analysis Section - THIS WAS MISSING */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Gap Analysis</h3>
                  <button 
                    onClick={() => setShowGapAnalysisModal(true)}
                    className="w-full px-4 py-3 bg-lime-500 text-black rounded-lg hover:bg-lime-600 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>🧠 AI Content Gap Analysis</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Funnel Content Goal */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Content Goal</h3>
                <p className="text-gray-600 mb-6">Goal: At least 2 content items per stage to start.</p>
                
                <div className="space-y-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className={`border-2 border-dashed ${stage.borderColor} ${stage.bgColor} rounded-lg p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`font-medium ${stage.textColor}`}>{stage.title}</h4>
                        <span className={`text-sm ${stage.textColor.replace('800', '600')}`}>2 items</span>
                      </div>
                      <p className={`text-sm ${stage.textColor.replace('800', '700')} mb-3`}>{stage.description}</p>
                      
                      {/* Show assigned content */}
                      <div className="space-y-2">
                        {stage.id === 'discover' && (
                          <>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              5 Signs You Need a Better Business Strategy
                            </div>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              The Hidden Cost of Staying Where You Are
                            </div>
                          </>
                        )}
                        {stage.id === 'resonate' && (
                          <>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              How [Client Name] Overcame [Specific Challenge]
                            </div>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              Why Most Business Advice Fails
                            </div>
                          </>
                        )}
                        {stage.id === 'envision' && (
                          <>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              A Day in the Life: After Working Together
                            </div>
                            <div className={`text-sm ${stage.textColor.replace('800', '600')} bg-white p-2 rounded border`}>
                              The [Outcome] Blueprint
                            </div>
                          </>
                        )}
                        {(stage.id === 'trust' || stage.id === 'authority') && (
                          <p className={`text-sm ${stage.textColor.replace('800', '600')} italic`}>No content assigned</p>
                        )}
                      </div>
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
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">📄</span>
                  </div>
                  <p className="text-gray-600 mb-4">Add content first: Go back to the Content Library step and add some content assets to generate personalized marketing copy.</p>
                  <button
                    onClick={() => setActiveSubStep(0)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add Content First
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sub-step 3: Milestone Reflection with Confetti */}
          {activeSubStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Step 2 Milestone Celebration!</h3>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">✓</span>
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
                      <span className="text-gray-700">Built comprehensive content library (20 pieces)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">✅</span>
                      <span className="text-gray-700">Mapped content to strategic funnel stages (6 total placements)</span>
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
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Content Distribution</h4>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {funnelStages.map((stage) => (
                    <div key={stage.id} className={`${stage.bgColor} border ${stage.borderColor} rounded-lg p-4`}>
                      <h5 className={`font-medium ${stage.textColor} mb-2`}>{stage.title}</h5>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-sm ${stage.textColor.replace('800', '600')}`}>
                          Current: {stage.id === 'discover' || stage.id === 'resonate' || stage.id === 'envision' ? '2' : '0'}
                        </span>
                        <span className={`text-sm ${stage.textColor.replace('800', '600')}`}>Goal: 2</span>
                      </div>
                      <button className="w-full px-3 py-2 bg-lime-500 text-black rounded-lg hover:bg-lime-600 text-sm font-medium transition-colors">
                        💡 Get Ideas (2 needed)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">💡</span>
                </div>
                <p className="text-gray-500">Click "Get Ideas" on any stage above to generate AI-powered content suggestions.</p>
              </div>
              
              <div className="flex justify-end">
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

