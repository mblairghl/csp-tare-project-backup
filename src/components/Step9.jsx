import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';

const Step9 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tab-1');

  const howThisWorksContent = {
    description: "Step 9 detailed description of how this works.",
    steps: [{'title': 'Sub Step 1', 'description': 'Description for sub step 1 of step 9.', 'color': 'bg-green-600', 'textColor': '#16a34a'}, {'title': 'Sub Step 2', 'description': 'Description for sub step 2 of step 9.', 'color': 'bg-blue-600', 'textColor': '#2563eb'}, {'title': 'Sub Step 3', 'description': 'Description for sub step 3 of step 9.', 'color': 'bg-yellow-600', 'textColor': '#ca8a04'}]
  };

  const subSteps = [{'id': 'tab-1', 'title': 'Tab 1', 'description': 'Tab 1 description'}, {'id': 'tab-2', 'title': 'Tab 2', 'description': 'Tab 2 description'}, {'id': 'milestone-reflection', 'title': 'Milestone Reflection', 'description': 'Celebrate progress'}];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 9 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Step 9 Title
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-lg text-gray-600 mb-6">
          Step 9 objective description goes here.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Authority Amplification</h3>
                <p className="text-gray-600 mb-6">
                  Use AI to transform your success into visible market leadership that attracts high-quality opportunities and premium clients.
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      const aiPrompt = `I'm working on Step 9 of my Authority Revenue Toolkit - Authority Amplification. I need help transforming my success into visible market leadership and increased demand.

Based on my business achievements, please help me create an authority amplification strategy:

My Business Success: [DESCRIBE YOUR ACHIEVEMENTS HERE]
My Expertise Areas: [LIST YOUR SPECIALTIES HERE]
My Target Audience: [PASTE YOUR PERSONAS FROM STEP 1 HERE]
My Current Visibility: [DESCRIBE CURRENT PRESENCE HERE]

Please provide:
1. Content strategy for demonstrating expertise
2. Speaking and presentation opportunities to pursue
3. Media and podcast outreach strategy
4. Thought leadership content calendar
5. Strategic partnerships and collaboration ideas
6. Awards and recognition opportunities
7. Book/publication strategy
8. Community building and engagement tactics
9. PR and media coverage strategies

Focus on building genuine authority that attracts high-quality opportunities and premium clients.`;
                      
                      const encodedPrompt = encodeURIComponent(aiPrompt);
                      window.open(`https://chat.openai.com/?q=${encodedPrompt}`, '_blank');
                    }}
                    className="text-black px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#d7df21' }}
                  >
                    🤖 Generate AI Authority Strategy
                  </button>
                  
                  <button 
                    className="text-white px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#fbae42' }}
                  >
                    Manual Authority Building
                  </button>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">How to use AI results:</h4>
                    <ol className="text-blue-700 text-sm space-y-1">
                      <li>1. Click "Generate AI Authority Strategy" to open ChatGPT</li>
                      <li>2. Fill in your achievements and current visibility</li>
                      <li>3. Copy the AI-generated authority amplification plan</li>
                      <li>4. Use "Manual Authority Building" to implement your strategy</li>
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
                    You've successfully completed Step 9. Great work on your progress!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter currentStep={9} />

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI-Generated Step 9 Strategy"
          loading={aiLoading}
        >
          {aiResult && (
            <div>
              <p className="text-gray-600 mb-6">
                Here's your AI-generated strategy for Step 9:
              </p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(aiResult, null, 2)}
              </pre>
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

export default Step9;
