import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Users, Target, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import PersonaCard from './PersonaCard';
import APIKeyModal from './APIKeyModal';
import ManualPersonaForm from './ManualPersonaForm';
import aiService from '../services/aiService';
import storageOptimizer from '../utils/storageOptimizer';

const Step1 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [manualFormOpen, setManualFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Step completion tracking
  const [isStepComplete, setIsStepComplete] = useState(false);

  // Persona data
  const [savedPersonas, setSavedPersonas] = useState([]);
  const [aiPersonas, setAiPersonas] = useState([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState([]);

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
    const saved = storageOptimizer.safeGet('step1_personas');
    if (saved && Array.isArray(saved)) {
      setSavedPersonas(saved);
    }
  }, []);

  // Check completion status
  useEffect(() => {
    const hasMinimumPersonas = savedPersonas.length >= 3;
    const hasPrimaryPersona = savedPersonas.some(p => p.type === 'primary');
    const hasSecondaryPersona = savedPersonas.some(p => p.type === 'secondary');
    
    const wasComplete = isStepComplete;
    const nowComplete = hasMinimumPersonas && hasPrimaryPersona && hasSecondaryPersona;
    
    setIsStepComplete(nowComplete);
    
    // Show confetti when step becomes complete
    if (!wasComplete && nowComplete) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [savedPersonas, isStepComplete]);

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  // Generate AI personas
  const handleAIPersonas = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    try {
      const businessInfo = {
        business: 'Business coaching and consulting services',
        services: 'Authority building, revenue optimization, business strategy',
        industry: 'Business consulting and coaching'
      };
      
      const personas = await aiService.generatePersonas(businessInfo);
      setAiPersonas(personas);
    } catch (error) {
      console.error('Error generating personas:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddPersona = (persona) => {
    const newPersona = {
      ...persona,
      id: Date.now() + Math.random(),
      dateAdded: new Date().toISOString()
    };
    
    const updated = [...savedPersonas, newPersona];
    setSavedPersonas(updated);
    storageOptimizer.safeSet('step1_personas', updated);
    
    // Remove from AI suggestions
    setSelectedPersonaIds(prev => [...prev, persona.id]);
  };

  const handleDeletePersona = (personaId) => {
    const updated = savedPersonas.filter(p => p.id !== personaId);
    setSavedPersonas(updated);
    storageOptimizer.safeSet('step1_personas', updated);
  };

  const handleEditPersona = (persona) => {
    setEditingPersona(persona);
    setManualFormOpen(true);
  };

  const handleSaveManualPersona = (personaData) => {
    if (editingPersona) {
      // Update existing persona
      const updated = savedPersonas.map(p => 
        p.id === editingPersona.id ? { ...personaData, id: editingPersona.id } : p
      );
      setSavedPersonas(updated);
      storageOptimizer.safeSet('step1_personas', updated);
    } else {
      // Add new persona
      const newPersona = {
        ...personaData,
        id: Date.now() + Math.random(),
        dateAdded: new Date().toISOString()
      };
      const updated = [...savedPersonas, newPersona];
      setSavedPersonas(updated);
      storageOptimizer.safeSet('step1_personas', updated);
    }
    
    setManualFormOpen(false);
    setEditingPersona(null);
  };

  const howThisWorksContent = {
    description: "Define and analyze your ideal client personas to create targeted messaging that resonates and converts.",
    steps: [
      { title: 'Persona Creation', description: 'Create detailed profiles of your ideal clients including demographics, pain points, and goals.', color: 'bg-blue-600', textColor: '#2563eb' },
      { title: 'Persona Refinement', description: 'Refine and validate your personas based on real client data and market research.', color: 'bg-green-600', textColor: '#16a34a' },
      { title: 'Implementation Strategy', description: 'Apply persona insights to your marketing, messaging, and content strategy.', color: 'bg-purple-600', textColor: '#9333ea' }
    ]
  };

  // Check section completion
  const hasPersonas = savedPersonas.length > 0;
  const hasMinimumPersonas = savedPersonas.length >= 3;
  const hasPrimaryPersona = savedPersonas.some(p => p.type === 'primary');

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
          Define and analyze your ideal client personas to create targeted messaging that resonates and converts.
        </p>

        {/* Step Completion Indicator */}
        {isStepComplete && (
          <div className="flex items-center gap-2 text-green-600 font-medium mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold">🎉 Step 1 Complete! You have defined your core audience.</p>
              <p className="text-sm text-green-700 mt-1">
                You have {savedPersonas.length} personas created. Use these insights for all your marketing and messaging.
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
          
          {/* Section 1: Persona Creation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasPersonas ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Persona Creation</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Create detailed profiles of your ideal clients to guide your marketing and messaging strategy.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={handleAIPersonas}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate AI Personas
                </button>
                <button
                  onClick={() => setManualFormOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Add Manual Persona
                </button>
              </div>

              {/* Current Personas Display */}
              {savedPersonas.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Your Personas ({savedPersonas.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPersonas.map((persona) => (
                      <PersonaCard
                        key={persona.id}
                        persona={persona}
                        onEdit={() => handleEditPersona(persona)}
                        onDelete={() => handleDeletePersona(persona.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {savedPersonas.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Personas Created</h4>
                  <p className="text-gray-600 mb-6">Start by generating AI personas or creating them manually.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Persona Refinement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {hasMinimumPersonas ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Persona Refinement</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Refine and validate your personas based on real client data and market insights.
            </p>

            {hasMinimumPersonas ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Persona Analysis Complete</h4>
                  <div className="space-y-2 text-green-700">
                    <p>• <strong>Total Personas:</strong> {savedPersonas.length}</p>
                    <p>• <strong>Primary Personas:</strong> {savedPersonas.filter(p => p.type === 'primary').length}</p>
                    <p>• <strong>Secondary Personas:</strong> {savedPersonas.filter(p => p.type === 'secondary').length}</p>
                    <p>• <strong>Negative Personas:</strong> {savedPersonas.filter(p => p.type === 'negative').length}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Refinement Recommendations</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Review each persona's pain points and ensure they align with your services</li>
                    <li>• Validate demographic data against your actual client base</li>
                    <li>• Update personas quarterly based on new client insights</li>
                    <li>• Use these personas to guide all marketing and content decisions</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Create More Personas</h4>
                <p className="text-gray-600 mb-6">You need at least 3 personas to complete this section. You currently have {savedPersonas.length}.</p>
              </div>
            )}
          </div>

          {/* Section 3: Implementation Strategy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              {isStepComplete ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">Implementation Strategy</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Apply your persona insights to create targeted marketing and messaging strategies.
            </p>

            {isStepComplete ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Implementation Checklist</h4>
                  <ul className="text-purple-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Create targeted messaging for each persona type
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Develop content themes that address persona pain points
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Choose marketing channels where your personas are active
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      Design lead magnets that appeal to persona interests
                    </li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Next Steps</h4>
                  <p className="text-yellow-700 text-sm">
                    Use these personas in Step 2 to audit your existing content and identify gaps in your messaging strategy.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto text-gray-400 mb-4">📋</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete Previous Sections</h4>
                <p className="text-gray-600 mb-6">Finish creating and refining your personas to unlock implementation strategies.</p>
              </div>
            )}
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
          title="AI-Generated Personas"
          loading={aiLoading}
          selectedCount={selectedPersonaIds.length}
        >
          {aiPersonas && aiPersonas.length > 0 && (
            <div>
              <p className="text-gray-600 mb-6">
                Select personas that best represent your ideal clients. You can edit them after adding.
              </p>
              <div className="space-y-4">
                {aiPersonas
                  .filter(persona => !selectedPersonaIds.includes(persona.id))
                  .map((persona, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{persona.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            persona.type === 'primary' ? 'bg-blue-100 text-blue-700' :
                            persona.type === 'secondary' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {persona.type} persona
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{persona.role} • {persona.company}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Pain Points:</strong> {persona.painPoints}</p>
                        <p className="text-sm text-gray-600"><strong>Goals:</strong> {persona.goals}</p>
                      </div>
                      <button
                        onClick={() => handleAddPersona(persona)}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AIModal>

        {/* Manual Persona Form Modal */}
        <ManualPersonaForm
          isOpen={manualFormOpen}
          onClose={() => {
            setManualFormOpen(false);
            setEditingPersona(null);
          }}
          onSave={handleSaveManualPersona}
          editingPersona={editingPersona}
        />

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

