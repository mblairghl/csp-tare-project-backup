import React, { useContext, useState } from 'react';
import { FunnelContext } from '../context/FunnelContext';
import { X, Lightbulb, Plus, RefreshCw } from 'lucide-react';

const GapAnalysisModal = () => {
  const {
    funnelContent,
    contentLibrary,
    setContentLibrary,
    addToFunnelStage,
    setShowGapModal,
    personas
  } = useContext(FunnelContext);

  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');

  const funnelStages = [
    { id: 'discover', title: 'Discover the Possibility', goal: 2 },
    { id: 'resonate', title: 'Resonate with the Mission', goal: 2 },
    { id: 'envision', title: 'Envision Their Transformation', goal: 2 },
    { id: 'trust', title: 'Trust the Process', goal: 2 },
    { id: 'authority', title: 'Step Into Authority', goal: 2 }
  ];

  // Calculate gaps
  const gaps = funnelStages.map(stage => ({
    ...stage,
    current: funnelContent[stage.id]?.length || 0,
    gap: Math.max(0, stage.goal - (funnelContent[stage.id]?.length || 0))
  }));

  // Generate AI suggestions for a specific stage
  const generateSuggestions = async (stageId) => {
    setIsGenerating(true);
    setSelectedStage(stageId);
    
    try {
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const stage = funnelStages.find(s => s.id === stageId);
      const primaryPersona = personas[0] || { name: 'Your Ideal Client' };
      
      const stageSpecificSuggestions = {
        discover: [
          {
            type: 'Blog Post',
            name: `5 Signs You Need a Better ${primaryPersona.industry || 'Business'} Strategy`,
            description: 'Help prospects recognize they have a problem worth solving',
            stage: stageId
          },
          {
            type: 'Video',
            name: `The Hidden Cost of Staying Where You Are`,
            description: 'Create urgency around the status quo',
            stage: stageId
          },
          {
            type: 'Infographic',
            name: `Industry Trends That Are Changing Everything`,
            description: 'Position yourself as forward-thinking',
            stage: stageId
          }
        ],
        resonate: [
          {
            type: 'Case Study',
            name: `How [Client Name] Overcame [Specific Challenge]`,
            description: 'Show you understand their exact situation',
            stage: stageId
          },
          {
            type: 'Article',
            name: `Why Most ${primaryPersona.industry || 'Business'} Advice Fails`,
            description: 'Differentiate your approach from competitors',
            stage: stageId
          },
          {
            type: 'Podcast',
            name: `My Journey from [Struggle] to [Success]`,
            description: 'Share your origin story and values',
            stage: stageId
          }
        ],
        envision: [
          {
            type: 'Video',
            name: `A Day in the Life: After Working Together`,
            description: 'Paint a vivid picture of their future state',
            stage: stageId
          },
          {
            type: 'Template',
            name: `The [Outcome] Blueprint`,
            description: 'Give them a taste of your methodology',
            stage: stageId
          },
          {
            type: 'Webinar',
            name: `From [Current State] to [Desired State] in [Timeframe]`,
            description: 'Show the transformation journey',
            stage: stageId
          }
        ],
        trust: [
          {
            type: 'Case Study',
            name: `Client Results: [Specific Metric] Improvement`,
            description: 'Provide concrete proof of your methods',
            stage: stageId
          },
          {
            type: 'Guide',
            name: `Behind the Scenes: My Proven Process`,
            description: 'Demonstrate your systematic approach',
            stage: stageId
          },
          {
            type: 'Video',
            name: `Client Testimonials and Success Stories`,
            description: 'Let others vouch for your credibility',
            stage: stageId
          }
        ],
        authority: [
          {
            type: 'Workshop',
            name: `Exclusive: Advanced [Topic] Masterclass`,
            description: 'Position as the expert they need to work with',
            stage: stageId
          },
          {
            type: 'E-book',
            name: `The Complete Guide to [Transformation]`,
            description: 'Comprehensive resource that showcases expertise',
            stage: stageId
          },
          {
            type: 'Course',
            name: `[Outcome] Accelerator Program`,
            description: 'High-value offering that leads to consultation',
            stage: stageId
          }
        ]
      };
      
      setSuggestions(stageSpecificSuggestions[stageId] || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add suggestion to content library and funnel
  const addSuggestion = (suggestion) => {
    const newContent = {
      id: Date.now(),
      ...suggestion
    };
    
    // Add to content library
    setContentLibrary(prev => [...prev, newContent]);
    
    // Add to funnel stage
    addToFunnelStage(newContent, suggestion.stage);
  };

  // Generate more ideas for the current stage
  const generateMoreIdeas = () => {
    if (selectedStage) {
      generateSuggestions(selectedStage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">🧠 AI Content Gap Analysis</h3>
            <button
              onClick={() => setShowGapModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Identify content gaps and get AI-powered suggestions for each funnel stage.</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Gap Analysis Overview */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Current Content Distribution</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gaps.map((gap) => (
                <div key={gap.id} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 text-sm mb-2">{gap.title}</h5>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Current: {gap.current}</span>
                    <span className="text-sm text-gray-600">Goal: {gap.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${gap.current >= gap.goal ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min(100, (gap.current / gap.goal) * 100)}%` }}
                    ></div>
                  </div>
                  {gap.gap > 0 && (
                    <button
                      onClick={() => generateSuggestions(gap.id)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 text-sm bg-lime-500 text-white rounded-md hover:bg-lime-600 disabled:bg-gray-300 flex items-center justify-center space-x-1"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Get Ideas ({gap.gap} needed)</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  AI Suggestions for "{funnelStages.find(s => s.id === selectedStage)?.title}"
                </h4>
                <button
                  onClick={generateMoreIdeas}
                  disabled={isGenerating}
                  className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:bg-gray-100 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>More Ideas</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-blue-600">{suggestion.type}</span>
                          <span className="text-xs text-gray-500">
                            Recommended for: {funnelStages.find(s => s.id === suggestion.stage)?.title}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900 mb-1">{suggestion.name}</h5>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                      <button
                        onClick={() => addSuggestion(suggestion)}
                        className="ml-4 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-1 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to {funnelStages.find(s => s.id === suggestion.stage)?.title.split(' ')[0]}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-8">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating AI suggestions...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {suggestions.length === 0 && !isGenerating && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Click "Get Ideas" on any stage above to generate AI-powered content suggestions.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={() => setShowGapModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GapAnalysisModal;

