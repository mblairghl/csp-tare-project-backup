import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step4 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiFunnelBuild, setAiFunnelBuild] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [addedComponents, setAddedComponents] = useState([]);
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

  const handleAIFunnelBuild = async () => {
    if (!aiService.hasApiKey()) {
      setApiKeyModalOpen(true);
      return;
    }

    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const prompt = `Create a signature funnel build strategy for a business coaching service. Provide as JSON:
      {
        "funnelStructure": [
          {"component": "Landing Page", "description": "High-converting landing page with clear value proposition", "priority": "High"},
          {"component": "Lead Magnet", "description": "Free valuable resource to capture leads", "priority": "High"},
          {"component": "Email Sequence", "description": "5-part nurture sequence building trust and authority", "priority": "Medium"}
        ],
        "landingPageElements": [
          {"element": "Hero Section", "description": "Compelling headline and subheadline addressing main pain point", "priority": "High"},
          {"element": "Social Proof", "description": "Client testimonials and success stories", "priority": "Medium"}
        ],
        "emailSequence": [
          {"email": "Welcome Email", "subject": "Your [Lead Magnet] is here + what's next", "purpose": "Deliver lead magnet and set expectations", "priority": "High"},
          {"email": "Value Email #1", "subject": "The #1 mistake I see coaches make", "purpose": "Provide valuable insight and build authority", "priority": "Medium"}
        ]
      }`;
      
      const result = await aiService.makeAIRequest(prompt, 'funnel building expert');
      setAiResult(result);
    } catch (error) {
      console.error('Error generating funnel build:', error);
      alert('Error generating funnel build. Please check your API key and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle adding AI component
  const handleAddComponent = (component, type) => {
    const componentKey = `${type}_${component.component || component.element || component.email}`;
    setAddedComponents(prev => [...prev, componentKey]);
    console.log(`Added ${type}:`, component);
  };

  // Handle closing AI modal and resetting state
  const handleCloseAIModal = () => {
    setAiModalOpen(false);
    setAddedComponents([]);
  };

  const howThisWorksContent = {
    description: "Step 4 detailed description of how this works.",
    steps: [{'title': 'Sub Step 1', 'description': 'Description for sub step 1 of step 4.', 'color': 'bg-green-600', 'textColor': '#16a34a'}, {'title': 'Sub Step 2', 'description': 'Description for sub step 2 of step 4.', 'color': 'bg-blue-600', 'textColor': '#2563eb'}, {'title': 'Sub Step 3', 'description': 'Description for sub step 3 of step 4.', 'color': 'bg-yellow-600', 'textColor': '#ca8a04'}]
  };

  const subSteps = [{'id': 'tab-1', 'title': 'Tab 1', 'description': 'Tab 1 description'}, {'id': 'tab-2', 'title': 'Tab 2', 'description': 'Tab 2 description'}, {'id': 'milestone-reflection', 'title': 'Milestone Reflection', 'description': 'Celebrate progress'}];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 4 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Step 4 Title
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Step 4 objective description goes here.
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
            {activeTab === 'tab-1' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Signature Funnel Builder</h3>
                <p className="text-gray-600 mb-6">
                  Use AI to create a high-converting funnel structure for your signature solution based on your previous framework work.
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleAIFunnelBuild}
                    className="text-black px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#d7df21' }}
                  >
                    🤖 Generate AI Funnel Blueprint
                  </button>
                  
                  <button 
                    className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#fbae42' }}
                  >
                    Manual Funnel Building
                  </button>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">How to use AI results:</h4>
                    <ol className="text-blue-700 text-sm space-y-1">
                      <li>1. Click "Generate AI Funnel Blueprint" to get AI suggestions</li>
                      <li>2. Review the AI-generated funnel components in the popup</li>
                      <li>3. Click "Add" on suggestions you want to use</li>
                      <li>4. Use "Manual Funnel Building" to implement and customize your funnel</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tab-2' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tab 2</h3>
                <p className="text-gray-600 mb-6">
                  Content for the second tab goes here.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Second tab content area.</p>
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
                  Celebrate your progress and reflect on what you've accomplished in this step.
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Congratulations!</h4>
                  <p className="text-green-700">
                    You've successfully completed Step 4. Great work on your progress!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter currentStep={4} />

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={handleCloseAIModal}
          title="AI-Generated Funnel Blueprint"
          loading={aiLoading}
          selectedCount={addedComponents.length}
        >
          {aiResult && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-6">
                Here's your AI-generated funnel blueprint with actionable components:
              </p>
              
              {aiResult.funnelStructure && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Funnel Structure</h4>
                  <div className="space-y-2">
                    {(aiResult.funnelStructure || [])
                      .filter(component => !addedComponents.includes(`funnelStructure_${component.component}`))
                      .map((component, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{component.component}</h5>
                            <p className="text-sm text-gray-600">{component.description}</p>
                            <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                              component.priority === 'High' ? 'bg-red-100 text-red-600' :
                              component.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {component.priority} Priority
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddComponent(component, 'funnelStructure')}
                            className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiResult.landingPageElements && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Landing Page Elements</h4>
                  <div className="space-y-2">
                    {(aiResult.landingPageElements || [])
                      .filter(element => !addedComponents.includes(`landingPageElements_${element.element}`))
                      .map((element, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{element.element}</h5>
                            <p className="text-sm text-gray-600">{element.description}</p>
                            <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                              element.priority === 'High' ? 'bg-red-100 text-red-600' :
                              element.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {element.priority} Priority
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddComponent(element, 'landingPageElements')}
                            className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiResult.emailSequence && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Email Sequence</h4>
                  <div className="space-y-2">
                    {(aiResult.emailSequence || [])
                      .filter(email => !addedComponents.includes(`emailSequence_${email.email}`))
                      .map((email, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800">{email.email}</h5>
                            <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong> {email.subject}</p>
                            <p className="text-sm text-gray-600">{email.purpose}</p>
                            <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                              email.priority === 'High' ? 'bg-red-100 text-red-600' :
                              email.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {email.priority} Priority
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddComponent(email, 'emailSequence')}
                            className="ml-3 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {addedComponents.length > 0 && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-green-700 text-sm">
                    ✅ {addedComponents.length} component(s) added to your funnel blueprint
                  </p>
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

export default Step4;
