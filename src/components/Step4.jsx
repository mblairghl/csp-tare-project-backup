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
  const [leadMagnet, setLeadMagnet] = useState({
    title: '',
    format: '',
    problem: '',
    valueProposition: ''
  });
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
  const handleAddComponent = (leadMagnetIdea) => {
    // Populate lead magnet form with the selected AI idea
    setLeadMagnet({
      title: leadMagnetIdea.title,
      format: leadMagnetIdea.format,
      problem: leadMagnetIdea.problem,
      valueProposition: leadMagnetIdea.valueProposition
    });
    
    // Close modal after adding
    setAiModalOpen(false);
    setAddedComponents([]);
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Magnet Strategy</h3>
                <p className="text-gray-600 mb-6">
                  Add your existing lead magnet or get AI-powered ideas based on your project setup and previous steps.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Your Lead Magnet</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lead Magnet Title</label>
                        <input
                          type="text"
                          value={leadMagnet.title}
                          onChange={(e) => setLeadMagnet(prev => ({...prev, title: e.target.value}))}
                          placeholder="e.g., The Authority Success Blueprint"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                        <select
                          value={leadMagnet.format}
                          onChange={(e) => setLeadMagnet(prev => ({...prev, format: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select format...</option>
                          <option value="PDF Guide + Checklist">PDF Guide + Checklist</option>
                          <option value="Video Training Series">Video Training Series</option>
                          <option value="Interactive Quiz + Report">Interactive Quiz + Report</option>
                          <option value="Email Course">Email Course</option>
                          <option value="Template Pack">Template Pack</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Problem It Solves</label>
                      <textarea
                        value={leadMagnet.problem}
                        onChange={(e) => setLeadMagnet(prev => ({...prev, problem: e.target.value}))}
                        placeholder="What specific problem does your lead magnet solve?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value Proposition</label>
                      <textarea
                        value={leadMagnet.valueProposition}
                        onChange={(e) => setLeadMagnet(prev => ({...prev, valueProposition: e.target.value}))}
                        placeholder="What value does your lead magnet provide?"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {leadMagnet.title && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Current Lead Magnet</h4>
                      <div className="text-green-700">
                        <p className="font-medium">{leadMagnet.title}</p>
                        <p className="text-sm">{leadMagnet.format}</p>
                        <p className="text-sm mt-1">{leadMagnet.problem}</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Need Lead Magnet Ideas?</h4>
                    <p className="text-blue-700 text-sm mb-3">Get AI-powered lead magnet suggestions based on your project setup and previous steps.</p>
                    <button 
                      onClick={handleAIFunnelBuild}
                      className="text-black px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#d7df21' }}
                    >
                      🤖 Get Ideas
                    </button>
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
          title="Lead Magnet Ideas"
          loading={aiLoading}
          selectedCount={0}
        >
          {aiResult && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-6">
                AI-generated lead magnet ideas based on your project setup and previous steps. Click "ADD" to use any idea.
              </p>
              
              {aiResult.leadMagnetIdeas && (
                <div className="space-y-4">
                  {(aiResult.leadMagnetIdeas || []).map((idea, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Format:</span>
                              <span className="text-gray-600 ml-2">{idea.format}</span>
                              <span className="ml-4 font-medium text-gray-700">CTA:</span>
                              <span className="text-gray-600 ml-2">{idea.cta}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Problem:</span>
                              <p className="text-gray-600 mt-1">{idea.problem}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Value Proposition:</span>
                              <p className="text-gray-600 mt-1">{idea.valueProposition}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddComponent(idea)}
                          className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium transition-colors"
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  ))}
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
