import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, User, Target, Lightbulb, Plus, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import APIKeyModal from './APIKeyModal';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step1 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Step completion tracking
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Persona data
  const [idealClient, setIdealClient] = useState({
    demographics: '',
    psychographics: '',
    painPoints: '',
    goals: '',
    challenges: '',
    values: ''
  });
  const [aiResult, setAiResult] = useState(null);

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

  // Load saved data
  useEffect(() => {
    const savedClient = storageOptimizer.safeGet('step1_ideal_client');
    
    if (savedClient && typeof savedClient === 'object') {
      setIdealClient(savedClient);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const requiredFields = ['demographics', 'psychographics', 'painPoints', 'goals'];
    const hasRequiredFields = requiredFields.every(field => 
      idealClient[field] && idealClient[field].trim().length > 0
    );
    
    const wasComplete = isStepComplete;
    const nowComplete = hasRequiredFields;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [idealClient, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Handle form changes
  const handleInputChange = (field, value) => {
    const updated = { ...idealClient, [field]: value };
    setIdealClient(updated);
    storageOptimizer.safeSet('step1_ideal_client', updated);
  };

  // AI persona generation
  const handleAIPersonaGeneration = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    
    try {
      const result = await aiService.generateIdealClientPersona();
      setAiResult(result);
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseAIPersona = (persona) => {
    setIdealClient(persona);
    storageOptimizer.safeSet('step1_ideal_client', persona);
    setAiModalOpen(false);
  };

  const howThisWorksContent = {
    description: "Define your ideal client persona to create targeted messaging and content that resonates with your perfect customers.",
    steps: [
      { title: 'Demographics', description: 'Define the basic characteristics of your ideal client including age, location, income, and role.', color: 'bg-blue-600', textColor: '#2563eb' },
      { title: 'Psychographics', description: 'Understand their mindset, values, interests, and lifestyle preferences.', color: 'bg-green-600', textColor: '#16a34a' },
      { title: 'Pain Points & Goals', description: 'Identify their biggest challenges and what they want to achieve.', color: 'bg-purple-600', textColor: '#9333ea' }
    ]
  };

  // Check section completion
  const hasDemographics = idealClient.demographics && idealClient.demographics.trim().length > 0;
  const hasPsychographics = idealClient.psychographics && idealClient.psychographics.trim().length > 0;
  const hasPainPoints = idealClient.painPoints && idealClient.painPoints.trim().length > 0;
  const hasGoals = idealClient.goals && idealClient.goals.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        {/* Component 1: Step Progress Indicator */}
        <div className="text-sm text-gray-500 mb-2">
          STEP 1 OF 9
        </div>

        {/* Component 2: Step Name */}
        <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
          Ideal Client Refinement
        </h1>

        {/* Component 3: Step Objective */}
        <p className="text-base lg:text-lg text-gray-600 mb-6">
          Define your ideal client persona to create targeted messaging and content that resonates with your perfect customers.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-green-600 font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 1 Complete! Your ideal client persona is defined.</p>
              <p className="text-sm text-green-700 mt-1">
                You now have a clear picture of who you're targeting with your authority-building content.
              </p>
            </div>
          </div>
        )}

        {/* Component 4: How This Works Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Works</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600 font-medium">Expand</span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 text-green-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-green-600" />
              )}
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-6">{howThisWorksContent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {howThisWorksContent.steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* All Sections in Vertical Layout */}
        <div className="space-y-8">
          
          {/* Section 1: Demographics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasDemographics ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Demographics</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Define the basic characteristics of your ideal client including age, location, income, and professional role.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demographics (Age, Location, Income, Role, etc.)
                </label>
                <textarea
                  value={idealClient.demographics}
                  onChange={(e) => handleInputChange('demographics', e.target.value)}
                  placeholder="e.g., 35-50 years old, business owners in major US cities, $100K+ annual revenue, CEO/Founder of service-based businesses..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Psychographics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasPsychographics ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Psychographics</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Understand their mindset, values, interests, and lifestyle preferences.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Psychographics (Values, Interests, Lifestyle, Mindset)
                </label>
                <textarea
                  value={idealClient.psychographics}
                  onChange={(e) => handleInputChange('psychographics', e.target.value)}
                  placeholder="e.g., Values efficiency and results, interested in business growth and innovation, busy lifestyle, growth-minded, values expertise and proven systems..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pain Points */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasPainPoints ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Pain Points & Challenges</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Identify their biggest challenges, frustrations, and obstacles they face.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pain Points & Challenges
                </label>
                <textarea
                  value={idealClient.painPoints}
                  onChange={(e) => handleInputChange('painPoints', e.target.value)}
                  placeholder="e.g., Struggling to generate consistent leads, overwhelmed by marketing options, difficulty establishing authority in their field, inconsistent revenue..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Goals & Aspirations */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasGoals ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Goals & Aspirations</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Define what they want to achieve and their desired outcomes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goals & Aspirations
                </label>
                <textarea
                  value={idealClient.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="e.g., Build a predictable lead generation system, establish themselves as the go-to expert in their field, scale their business to 7 figures, create more freedom and impact..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* AI Enhancement Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900">AI Enhancement</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Get AI-powered suggestions to refine and enhance your ideal client persona.
            </p>

            <div className="space-y-6">
              <button
                onClick={handleAIPersonaGeneration}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Persona Suggestions
              </button>

              {isStepComplete && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Ideal Client Persona Complete</h4>
                    <ul className="text-green-700 space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Demographics clearly defined
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Psychographics and mindset mapped
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Pain points and challenges identified
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Goals and aspirations documented
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                    <p className="text-yellow-700 text-sm">
                      Use this persona in Step 2 to audit and create content that speaks directly to your ideal client's needs and desires.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <StepFooter 
          currentStep={1} 
          totalSteps={9} 
          showNextStep={isStepComplete}
        />

        {/* AI Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI Persona Suggestions"
          loading={aiLoading}
        >
          {aiResult && (
            <div>
              <p className="text-gray-600 mb-6">
                AI has generated enhanced persona suggestions based on best practices:
              </p>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Enhanced Demographics</h4>
                  <p className="text-sm text-gray-600 mb-3">{aiResult.demographics}</p>
                  <button
                    onClick={() => handleInputChange('demographics', aiResult.demographics)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Use This
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Enhanced Psychographics</h4>
                  <p className="text-sm text-gray-600 mb-3">{aiResult.psychographics}</p>
                  <button
                    onClick={() => handleInputChange('psychographics', aiResult.psychographics)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Use This
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Enhanced Pain Points</h4>
                  <p className="text-sm text-gray-600 mb-3">{aiResult.painPoints}</p>
                  <button
                    onClick={() => handleInputChange('painPoints', aiResult.painPoints)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Use This
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Enhanced Goals</h4>
                  <p className="text-sm text-gray-600 mb-3">{aiResult.goals}</p>
                  <button
                    onClick={() => handleInputChange('goals', aiResult.goals)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Use This
                  </button>
                </div>
              </div>
            </div>
          )}
        </AIModal>

        {/* API Key Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          onSave={handleSaveApiKey}
        />
      </div>
    </div>
  );
};

export default Step1;

