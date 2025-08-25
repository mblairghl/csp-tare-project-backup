import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import StepFooter from './StepFooter';
import AIModal from './AIModal';
import PersonaCard from './PersonaCard';
import APIKeyModal from './APIKeyModal';
import ManualPersonaForm from './ManualPersonaForm';
import ContentBox from './ContentBox';
import EditDeleteActions from './EditDeleteActions';
import aiService from '../services/aiService';

const Step1 = () => {
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);
  const [activeSubStep, setActiveSubStep] = useState(1); // Sub-step navigation
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [manualFormOpen, setManualFormOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [aiPersonas, setAiPersonas] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [savedPersonas, setSavedPersonas] = useState([]);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState([]);
  const [refinedPersonas, setRefinedPersonas] = useState([]); // For sub-step 2
  const [allAiPersonas, setAllAiPersonas] = useState([]); // Store all generated personas
  const [currentPersonaSet, setCurrentPersonaSet] = useState(1);
  const [maxPersonaSets] = useState(4); // Total of 4 sets (12 personas)
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const handleAIPersonas = async () => {
    setAiModalOpen(true);
    setAiLoading(true);
    setCurrentPersonaSet(1); // Reset to first set
    setAllAiPersonas([]); // Clear previous personas
    
    try {
      const businessInfo = {
        business: 'Business coaching and consulting services',
        services: 'Authority building, revenue optimization, business strategy',
        industry: 'Business consulting and coaching'
      };
      
      const personas = await aiService.generatePersonas(businessInfo);
      setAiPersonas(personas);
      setAllAiPersonas(personas); // Store first set
      setSelectedPersonaIds([]); // Reset selections when new personas are generated
    } catch (error) {
      console.error('Error generating personas:', error);
      alert('Error generating personas. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMoreIdeas = async () => {
    if (currentPersonaSet >= maxPersonaSets) return;
    
    setAiLoading(true);
    
    try {
      const businessInfo = {
        business: 'Business coaching and consulting services',
        services: 'Authority building, revenue optimization, business strategy',
        industry: 'Business consulting and coaching'
      };
      
      const newPersonas = await aiService.generatePersonas(businessInfo);
      const updatedAllPersonas = [...allAiPersonas, ...newPersonas];
      
      setAllAiPersonas(updatedAllPersonas);
      setAiPersonas(updatedAllPersonas); // Show all personas
      setCurrentPersonaSet(prev => prev + 1);
    } catch (error) {
      console.error('Error generating more personas:', error);
      alert('Error generating more personas. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddPersona = (persona) => {
    // Add to saved personas
    const newPersona = { ...persona, id: persona.id || `persona_${Date.now()}` };
    setSavedPersonas(prev => [...prev, newPersona]);
    
    // Mark as selected in AI modal (but keep modal open)
    setSelectedPersonaIds(prev => [...prev, persona.id || persona.name]);
  };

  const handleRemovePersona = (persona) => {
    // Remove from saved personas
    setSavedPersonas(prev => prev.filter(p => p.id !== persona.id));
    
    // Unmark as selected in AI modal
    setSelectedPersonaIds(prev => prev.filter(id => id !== (persona.id || persona.name)));
  };

  const handleEditPersona = (persona) => {
    setEditingPersona(persona);
    setManualFormOpen(true);
  };

  const handleDeletePersona = (persona) => {
    if (window.confirm('Are you sure you want to delete this persona?')) {
      handleRemovePersona(persona);
    }
  };

  const handleSaveManualPersona = (personaData) => {
    if (editingPersona) {
      // Update existing persona
      setSavedPersonas(prev => prev.map(p => 
        p.id === editingPersona.id ? { ...personaData, id: editingPersona.id } : p
      ));
      setEditingPersona(null);
    } else {
      // Add new persona
      handleAddPersona(personaData);
    }
    setManualFormOpen(false);
  };

  const handleSaveApiKey = (apiKey) => {
    aiService.setApiKey(apiKey);
  };

  const howThisWorksContent = {
    description: "Transform your scattered marketing from random to strategic with AI-powered client intelligence and systematic persona development.",
    steps: [{'title': 'AI Persona Research', 'description': 'Discover detailed client personas and behavioral patterns tailored to your business.', 'color': 'bg-green-600', 'textColor': '#16a34a'}, {'title': 'Manual Refinement', 'description': 'Customize and refine your personas with your unique insights and experience.', 'color': 'bg-blue-600', 'textColor': '#2563eb'}, {'title': 'Strategic Foundation', 'description': 'Build the client intelligence foundation that powers all your marketing decisions.', 'color': 'bg-yellow-600', 'textColor': '#ca8a04'}]
  };

  const subSteps = [{'id': 'create-personas', 'title': 'Create Personas', 'description': 'Create 1+ personas'}, {'id': 'manual-refinement', 'title': 'Manual Refinement', 'description': ''}, {'id': 'milestone-reflection', 'title': 'Milestone Reflection', 'description': ''}];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
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
          Define and refine your ideal client personas to create targeted, effective authority-building content and strategies.
        </p>

        {/* Component 4: How This Works Section */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <h3 className="text-green-800 font-semibold text-base lg:text-lg">How This Works</h3>
            </div>
            <button
              onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
              className="text-green-600 hover:text-green-800 transition-colors text-xs lg:text-sm px-2 lg:px-3 py-1 bg-green-100 rounded flex-shrink-0"
            >
              {isHowThisWorksOpen ? (
                <>Collapse <ChevronUp className="w-3 h-3 lg:w-4 lg:h-4 inline ml-1" /></>
              ) : (
                <>Expand <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 inline ml-1" /></>
              )}
            </button>
          </div>
          
          {isHowThisWorksOpen && (
            <div className="mt-4 bg-white p-3 lg:p-4 rounded border border-green-200">
              <p className="text-gray-600 text-sm mb-4">
                {howThisWorksContent.description}
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <div className="flex flex-col lg:flex-row border-b overflow-x-auto">
            {subSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveSubStep(index + 1);
                  // Trigger confetti when milestone tab (step 3) is clicked
                  if (index + 1 === 3) {
                    setShowConfetti(true);
                    // Stop confetti after 3 seconds
                    setTimeout(() => setShowConfetti(false), 3000);
                  }
                }}
                className={`flex-1 px-3 lg:px-4 py-3 text-sm font-medium border-b-2 transition-colors min-w-0 ${
                  activeSubStep === index + 1
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    activeSubStep === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-left min-w-0">
                    <div className="font-medium truncate">{step.title}</div>
                    {step.description && <div className="text-xs text-gray-500 truncate">{step.description}</div>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 lg:p-6">
            {activeSubStep === 1 && (
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Client Personas</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  Create at least 1 detailed persona of your ideal client. You can add more personas if it makes sense for your business to serve multiple distinct client types.
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        setEditingPersona(null);
                        setManualFormOpen(true);
                      }}
                      className="text-white px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#fbae42' }}
                    >
                      + Add New Persona
                    </button>
                    
                    <button 
                      onClick={handleAIPersonas}
                      className="text-black px-4 lg:px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#d7df21' }}
                    >
                      🤖 AI Persona Suggestions
                    </button>
                  </div>

                  {/* Saved Personas Display */}
                  {savedPersonas.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Your Personas</h4>
                      <div className="grid gap-4">
                        {savedPersonas.map((persona) => (
                          <ContentBox
                            key={persona.id}
                            onEdit={() => handleEditPersona(persona)}
                            onDelete={() => handleDeletePersona(persona)}
                            className="group"
                          >
                            <PersonaCard 
                              persona={persona} 
                              showAddButton={false}
                              showRemoveButton={false}
                            />
                          </ContentBox>
                        ))}
                      </div>
                    </div>
                  )}

                  {savedPersonas.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-gray-500 mb-2">No personas created yet</p>
                      <p className="text-gray-400 text-sm">Create your first ideal client persona to get started</p>
                      <p className="text-gray-400 text-xs mt-4">Progress saved automatically</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubStep === 2 && (
              <div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Manual Refinement</h3>
                <p className="text-gray-600 mb-6 text-sm lg:text-base">
                  Refine and customize your selected personas to better match your specific business needs.
                </p>
                
                {savedPersonas.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 mb-2">No personas to refine yet</p>
                    <p className="text-gray-400 text-sm">Please create personas in Sub Step 1 first</p>
                    <button 
                      onClick={() => setActiveSubStep(1)}
                      className="mt-4 text-green-600 hover:text-green-800 font-medium"
                    >
                      ← Go back to Create Personas
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 Refinement Tips</h4>
                      <p className="text-blue-700 text-sm">
                        Review each persona and add specific details that make them more relevant to your business. 
                        You can edit any field and add additional notes that weren't covered in the original persona.
                      </p>
                    </div>

                    {savedPersonas.map((persona) => (
                      <ContentBox
                        key={persona.id}
                        className="p-6"
                        onEdit={() => {
                          setEditingPersona(persona);
                          setManualFormOpen(true);
                        }}
                        onDelete={() => handleDeletePersona(persona.id)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{persona.name}</h4>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Ready for Refinement
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Biggest Problem:</p>
                            <p className="text-gray-600">{persona.problem_that_bothers_most}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Primary Goal:</p>
                            <p className="text-gray-600">{persona.primary_goal_to_achieve}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setEditingPersona(persona);
                              setManualFormOpen(true);
                            }}
                            className="text-white px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#fbae42' }}
                          >
                            Refine This Persona
                          </button>
                        </div>
                      </ContentBox>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 3 && (
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
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Milestone Achieved!</h3>
                  <p className="text-gray-600 text-lg">
                    You've successfully completed Step 1: Ideal Client Refinement
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* What You've Accomplished */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                      <span className="mr-2">✅</span>
                      What You've Accomplished
                    </h4>
                    <ul className="text-green-700 space-y-2">
                      <li>• Created {savedPersonas.length} detailed client persona{savedPersonas.length !== 1 ? 's' : ''}</li>
                      <li>• Defined target demographics and psychographics</li>
                      <li>• Identified key pain points and goals</li>
                      <li>• Established communication preferences</li>
                      <li>• Built foundation for targeted marketing</li>
                    </ul>
                  </div>

                  {/* Why It Was Critical */}
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-4 flex items-center">
                      <span className="mr-2">❌</span>
                      Why It Was Critical
                    </h4>
                    <ul className="text-red-700 space-y-2">
                      <li>• Without clear personas, marketing becomes generic</li>
                      <li>• Unclear messaging leads to poor conversion rates</li>
                      <li>• Wasted ad spend on wrong audiences</li>
                      <li>• Content that doesn't resonate with prospects</li>
                      <li>• Difficulty creating compelling offers</li>
                    </ul>
                  </div>

                  {/* Impact on Future Steps */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <span className="mr-2">🎯</span>
                      Impact on Future Steps
                    </h4>
                    <ul className="text-blue-700 space-y-2">
                      <li>• Step 2: Target pain points for funnel mapping</li>
                      <li>• Step 3: Qualify leads based on persona criteria</li>
                      <li>• Step 4: Design funnels for specific personas</li>
                      <li>• Step 5: Automate based on persona behavior</li>
                      <li>• Steps 6-9: Deliver personalized experiences</li>
                    </ul>
                  </div>

                  {/* Business Benefits */}
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-4 flex items-center">
                      <span className="mr-2">💼</span>
                      Business Benefits
                    </h4>
                    <ul className="text-yellow-700 space-y-2">
                      <li>• Higher conversion rates from targeted messaging</li>
                      <li>• Reduced customer acquisition costs</li>
                      <li>• Improved customer lifetime value</li>
                      <li>• More effective content marketing</li>
                      <li>• Better product-market fit</li>
                    </ul>
                  </div>
                </div>

                {/* What's Next */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    What's Next: Step 2 Preview
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Now that you have clear personas, you'll map their customer journey and identify the specific pain points that drive them to seek solutions like yours.
                  </p>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h5 className="font-medium text-gray-800 mb-2">Step 2: Pain Point Identification</h5>
                    <p className="text-gray-600 text-sm">
                      Map your personas' journey from problem awareness to solution purchase, identifying key touchpoints and decision triggers.
                    </p>
                  </div>
                </div>

                {/* Step Completion Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
                    <span className="mr-2">🏆</span>
                    Step 1 Complete
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter 
          currentStep={1} 
          showNextStep={activeSubStep === 3}
        />

        {/* AI Persona Suggestions Modal */}
        <AIModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          title="AI-Generated Persona Suggestions"
          loading={aiLoading}
          onMoreIdeas={handleMoreIdeas}
          showMoreIdeas={true}
          selectedCount={selectedPersonaIds.length}
          maxSets={maxPersonaSets}
          currentSet={currentPersonaSet}
        >
          {aiPersonas.length > 0 && (
            <div>
              <p className="text-gray-600 mb-6">
                Select the personas that best match your target audience. Selected personas will be added to your project.
              </p>
              <div className="grid gap-6">
                {aiPersonas
                  .filter(persona => !selectedPersonaIds.includes(persona.id || persona.name))
                  .map((persona, index) => (
                  <PersonaCard
                    key={index}
                    persona={persona}
                    onAdd={handleAddPersona}
                    showAddButton={true}
                    isSelected={false}
                  />
                ))}
              </div>
              {aiPersonas.filter(persona => !selectedPersonaIds.includes(persona.id || persona.name)).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">✅ All personas have been added to your project!</p>
                  <p className="text-gray-400 text-sm mt-2">Close this popup to continue working with your selected personas.</p>
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
      </div>
    </div>
  );
};

export default Step1;
