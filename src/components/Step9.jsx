import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Mic, Users, RefreshCw, Calendar, MapPin, Edit, Trash2, Target, Award } from 'lucide-react';

const Step9 = () => {
  // Sub-step management (2 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [speakingEngagements, setSpeakingEngagements] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [contentPieces, setContentPieces] = useState([]);
  const [repurposingPlans, setRepurposingPlans] = useState([]);
  
  // Modal states
  const [addSpeakingModalOpen, setAddSpeakingModalOpen] = useState(false);
  const [addPartnershipModalOpen, setAddPartnershipModalOpen] = useState(false);
  const [addContentModalOpen, setAddContentModalOpen] = useState(false);
  const [aiRepurposingModalOpen, setAiRepurposingModalOpen] = useState(false);
  
  // Form states
  const [speakingForm, setSpeakingForm] = useState({
    eventName: '',
    eventType: '',
    date: '',
    audience: '',
    topic: '',
    status: 'Planned'
  });
  
  const [partnershipForm, setPartnershipForm] = useState({
    partnerName: '',
    partnerType: '',
    collaborationType: '',
    expectedReach: '',
    timeline: '',
    status: 'Planned'
  });
  
  const [contentForm, setContentForm] = useState({
    title: '',
    type: '',
    originalPlatform: '',
    description: '',
    url: ''
  });
  
  // AI results
  const [aiRepurposingSuggestions, setAiRepurposingSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (2 steps total)
  const subSteps = [
    { id: 0, title: 'Strategy Hub', completed: false },
    { id: 1, title: 'Authority Scaling', completed: false }
  ];

  // Check completion status
  const hasStrategies = speakingEngagements.length > 0 || partnerships.length > 0 || contentPieces.length > 0;
  const hasRepurposingPlans = repurposingPlans.length > 0;
  const isStepComplete = hasStrategies && hasRepurposingPlans;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // Strategy Hub always unlocked
      case 1: return hasStrategies; // Authority Scaling unlocked when strategies exist
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasStrategies; // Strategy completed when any strategy exists
      case 1: return hasRepurposingPlans; // Scaling completed when repurposing plans exist
      default: return false;
    }
  };

  // Event type options
  const eventTypes = [
    'Conference Keynote',
    'Industry Panel',
    'Workshop',
    'Webinar',
    'Podcast Interview',
    'Virtual Summit',
    'Networking Event',
    'Masterclass',
    'Training Session',
    'Expert Panel'
  ];

  // Partnership types
  const partnershipTypes = [
    'Joint Venture',
    'Affiliate Partnership',
    'Content Collaboration',
    'Cross-Promotion',
    'Strategic Alliance',
    'Referral Partnership',
    'Co-Marketing',
    'Guest Expert',
    'Advisory Role',
    'Mentorship Exchange'
  ];

  // Content types for repurposing
  const contentTypes = [
    'Blog Post',
    'Video',
    'Podcast Episode',
    'Webinar',
    'Social Media Post',
    'Email Newsletter',
    'Case Study',
    'White Paper',
    'Infographic',
    'Course Module',
    'Workshop',
    'Interview'
  ];

  // Add Speaking Engagement
  const addSpeakingEngagement = () => {
    if (!speakingForm.eventName || !speakingForm.eventType) {
      alert('Please fill in event name and type');
      return;
    }
    
    const newEngagement = {
      id: Date.now(),
      ...speakingForm,
      createdAt: new Date().toISOString()
    };
    
    setSpeakingEngagements([...speakingEngagements, newEngagement]);
    setSpeakingForm({
      eventName: '',
      eventType: '',
      date: '',
      audience: '',
      topic: '',
      status: 'Planned'
    });
    setAddSpeakingModalOpen(false);
  };

  // Add Partnership
  const addPartnership = () => {
    if (!partnershipForm.partnerName || !partnershipForm.partnerType) {
      alert('Please fill in partner name and type');
      return;
    }
    
    const newPartnership = {
      id: Date.now(),
      ...partnershipForm,
      createdAt: new Date().toISOString()
    };
    
    setPartnerships([...partnerships, newPartnership]);
    setPartnershipForm({
      partnerName: '',
      partnerType: '',
      collaborationType: '',
      expectedReach: '',
      timeline: '',
      status: 'Planned'
    });
    setAddPartnershipModalOpen(false);
  };

  // Add Content Piece
  const addContentPiece = () => {
    if (!contentForm.title || !contentForm.type) {
      alert('Please fill in content title and type');
      return;
    }
    
    const newContent = {
      id: Date.now(),
      ...contentForm,
      createdAt: new Date().toISOString()
    };
    
    setContentPieces([...contentPieces, newContent]);
    setContentForm({
      title: '',
      type: '',
      originalPlatform: '',
      description: '',
      url: ''
    });
    setAddContentModalOpen(false);
  };

  // Generate AI Repurposing Ideas
  const handleAIRepurposing = () => {
    if (contentPieces.length === 0) {
      alert('Please add at least one content piece first');
      return;
    }
    
    setIsAiLoading(true);
    setAiRepurposingModalOpen(true);

    // Simulate AI repurposing generation
    setTimeout(() => {
      const repurposingSuggestions = contentPieces.map(content => ({
        originalContent: content,
        repurposingIdeas: [
          {
            platform: 'LinkedIn',
            format: 'Carousel Post',
            description: `Transform "${content.title}" into a 5-slide carousel highlighting key insights`,
            timeline: '1 week',
            effort: 'Low'
          },
          {
            platform: 'Twitter/X',
            format: 'Thread',
            description: `Create a 10-tweet thread breaking down the main points from "${content.title}"`,
            timeline: '2 days',
            effort: 'Low'
          },
          {
            platform: 'YouTube',
            format: 'Short Video',
            description: `Create a 60-second video summary of "${content.title}" key takeaways`,
            timeline: '3 days',
            effort: 'Medium'
          },
          {
            platform: 'Instagram',
            format: 'Story Series',
            description: `Break "${content.title}" into 5 Instagram stories with key quotes and insights`,
            timeline: '1 day',
            effort: 'Low'
          },
          {
            platform: 'Email Newsletter',
            format: 'Feature Article',
            description: `Adapt "${content.title}" into a newsletter feature with actionable tips`,
            timeline: '2 days',
            effort: 'Medium'
          },
          {
            platform: 'Podcast',
            format: 'Episode Topic',
            description: `Use "${content.title}" as the foundation for a 30-minute podcast episode`,
            timeline: '1 week',
            effort: 'High'
          }
        ]
      }));

      setAiRepurposingSuggestions(repurposingSuggestions);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Repurposing Suggestions
  const useAIRepurposingSuggestions = () => {
    if (!aiRepurposingSuggestions.length) return;
    
    const newPlans = aiRepurposingSuggestions.flatMap(suggestion => 
      suggestion.repurposingIdeas.map(idea => ({
        id: Date.now() + Math.random(),
        originalContent: suggestion.originalContent.title,
        platform: idea.platform,
        format: idea.format,
        description: idea.description,
        timeline: idea.timeline,
        effort: idea.effort,
        status: 'Planned'
      }))
    );
    
    setRepurposingPlans([...repurposingPlans, ...newPlans]);
    setAiRepurposingModalOpen(false);
  };

  // Delete functions
  const deleteSpeakingEngagement = (id) => {
    setSpeakingEngagements(speakingEngagements.filter(item => item.id !== id));
  };

  const deletePartnership = (id) => {
    setPartnerships(partnerships.filter(item => item.id !== id));
  };

  const deleteContentPiece = (id) => {
    setContentPieces(contentPieces.filter(item => item.id !== id));
  };

  const deleteRepurposingPlan = (id) => {
    setRepurposingPlans(repurposingPlans.filter(item => item.id !== id));
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Develop and manage strategic initiatives to amplify your authority across multiple channels.",
    steps: [
      {
        title: "Strategy Hub",
        description: "Plan speaking, partnerships, and content",
        color: "bg-[#0e9246]"
      },
      {
        title: "Authority Scaling", 
        description: "Scale authority across multiple channels",
        color: "bg-[#d7df21]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 9 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Authority Amplification
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Develop and manage strategic initiatives to amplify your authority across multiple channels.
          </p>
        </div>

        {/* How This Works Section */}
        <div className={`rounded-lg shadow-lg border border-gray-200 mb-6 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2 ${isHowThisWorksOpen ? 'bg-white' : 'bg-white'}`}>
          <button
            onClick={() => setIsHowThisWorksOpen(!isHowThisWorksOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">?</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">How This Step Works</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#0e9246] font-medium">
                {isHowThisWorksOpen ? 'Collapse' : 'Expand'}
              </span>
              {isHowThisWorksOpen ? (
                <ChevronUp className="w-5 h-5 text-[#0e9246]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#0e9246]" />
              )}
            </div>
          </button>
          
          {isHowThisWorksOpen && (
            <div className="px-6 pb-6 bg-white border-t border-[#0e9246]">
              <p className="text-gray-600 mb-6">{howThisWorksContent.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Action Steps Navigation */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Action Steps</h2>
          <p className="text-sm text-gray-600">Complete all Action Steps below before moving to the next Step page.</p>
        </div>
        
        <div className="bg-[#467a8f] bg-opacity-10 rounded-lg shadow-lg border border-[#467a8f] border-opacity-20 mb-8 transform transition-all duration-200 hover:shadow-xl hover:-translate-y-2">
          <div className="flex flex-wrap">
            {subSteps.map((step) => {
              const isUnlocked = isSubStepUnlocked(step.id);
              const isActive = activeSubStep === step.id;
              const isCompleted = isSubStepCompleted(step.id);

              return (
                <button
                  key={step.id}
                  onClick={() => isUnlocked && setActiveSubStep(step.id)}
                  disabled={!isUnlocked}
                  className={`flex-1 min-w-0 px-4 py-4 text-center border-b-2 transition-colors duration-200 ${
                    isActive
                      ? 'border-[#fbae42] bg-orange-50'
                      : isUnlocked
                      ? 'border-transparent hover:border-gray-300 hover:bg-white hover:bg-opacity-50'
                      : 'border-transparent bg-transparent'
                  } ${
                    !isUnlocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-[#0e9246] text-white'
                        : isActive
                        ? 'bg-[#fbae42] text-white'
                        : isUnlocked
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : !isUnlocked ? (
                        <span className="text-xs">🔒</span>
                      ) : (
                        <span className="text-sm font-bold">{step.id + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isActive
                        ? 'text-[#fbae42]'
                        : isUnlocked
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-step Content */}
        <div className="space-y-8">
          {activeSubStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Strategy Components */}
              <div className="space-y-6">
                {/* Speaking Engagement Tracker */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Speaking Engagement Tracker</h3>
                  <p className="text-gray-600 mb-6">Manage speaking opportunities and events.</p>
                  
                  <button
                    onClick={() => setAddSpeakingModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2 mb-4"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Speaking Opportunity</span>
                  </button>

                  {speakingEngagements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Mic className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No speaking engagements yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {speakingEngagements.map((engagement) => (
                        <div key={engagement.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{engagement.eventName}</h4>
                              <p className="text-sm text-gray-600">{engagement.eventType}</p>
                              {engagement.date && <p className="text-xs text-gray-500">Date: {engagement.date}</p>}
                              {engagement.audience && <p className="text-xs text-gray-500">Audience: {engagement.audience}</p>}
                              <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                engagement.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                engagement.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {engagement.status}
                              </span>
                            </div>
                            <button 
                              onClick={() => deleteSpeakingEngagement(engagement.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Strategic Partnership Finder */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Strategic Partnership Finder</h3>
                  <p className="text-gray-600 mb-6">Identify and manage strategic partnerships.</p>
                  
                  <button
                    onClick={() => setAddPartnershipModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2 mb-4"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Partnership</span>
                  </button>

                  {partnerships.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No partnerships yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {partnerships.map((partnership) => (
                        <div key={partnership.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{partnership.partnerName}</h4>
                              <p className="text-sm text-gray-600">{partnership.partnerType}</p>
                              {partnership.collaborationType && <p className="text-xs text-gray-500">Type: {partnership.collaborationType}</p>}
                              {partnership.expectedReach && <p className="text-xs text-gray-500">Reach: {partnership.expectedReach}</p>}
                              <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                                partnership.status === 'Active' ? 'bg-green-100 text-green-800' :
                                partnership.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {partnership.status}
                              </span>
                            </div>
                            <button 
                              onClick={() => deletePartnership(partnership.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Authority Overview */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Authority Strategy Overview</h3>
                
                {/* Speaking Summary */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Speaking Engagements</h4>
                  {speakingEngagements.length === 0 ? (
                    <p className="text-gray-500 text-sm">No speaking engagements planned</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{speakingEngagements.length} engagements planned</p>
                      <div className="space-y-1">
                        {speakingEngagements.slice(0, 3).map((engagement, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <div className="flex items-center">
                              <Mic className="w-3 h-3 text-blue-600 mr-2" />
                              <span className="font-medium text-blue-900 text-xs">{engagement.eventName}</span>
                            </div>
                            <p className="text-xs text-blue-700">{engagement.eventType}</p>
                          </div>
                        ))}
                        {speakingEngagements.length > 3 && (
                          <p className="text-xs text-gray-500">+ {speakingEngagements.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Partnership Summary */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Strategic Partnerships</h4>
                  {partnerships.length === 0 ? (
                    <p className="text-gray-500 text-sm">No partnerships established</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{partnerships.length} partnerships planned</p>
                      <div className="space-y-1">
                        {partnerships.slice(0, 3).map((partnership, index) => (
                          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 text-green-600 mr-2" />
                              <span className="font-medium text-green-900 text-xs">{partnership.partnerName}</span>
                            </div>
                            <p className="text-xs text-green-700">{partnership.partnerType}</p>
                          </div>
                        ))}
                        {partnerships.length > 3 && (
                          <p className="text-xs text-gray-500">+ {partnerships.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Summary */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Content for Repurposing</h4>
                  {contentPieces.length === 0 ? (
                    <p className="text-gray-500 text-sm">No content pieces added</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{contentPieces.length} content pieces</p>
                      <div className="space-y-1">
                        {contentPieces.slice(0, 3).map((content, index) => (
                          <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                            <div className="flex items-center">
                              <RefreshCw className="w-3 h-3 text-orange-600 mr-2" />
                              <span className="font-medium text-orange-900 text-xs">{content.title}</span>
                            </div>
                            <p className="text-xs text-orange-700">{content.type}</p>
                          </div>
                        ))}
                        {contentPieces.length > 3 && (
                          <p className="text-xs text-gray-500">+ {contentPieces.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Strategy Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Speaking Engagements</span>
                      <span className={`text-sm font-medium ${speakingEngagements.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {speakingEngagements.length > 0 ? '✅ Added' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Strategic Partnerships</span>
                      <span className={`text-sm font-medium ${partnerships.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {partnerships.length > 0 ? '✅ Added' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Content for Repurposing</span>
                      <span className={`text-sm font-medium ${contentPieces.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {contentPieces.length > 0 ? '✅ Added' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubStep === 1 && (
            <div className="space-y-6">
              {/* Content Repurposing Engine */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Repurposing Engine</h3>
                <p className="text-gray-600 mb-6">Maximize content reach across multiple channels and formats.</p>
                
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setAddContentModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Content Piece</span>
                  </button>
                  
                  <button
                    onClick={handleAIRepurposing}
                    disabled={contentPieces.length === 0}
                    className={`w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${
                      contentPieces.length === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#d7df21] text-black hover:bg-[#c5cd1e]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI Repurposing Ideas</span>
                  </button>
                </div>

                {/* Content Pieces Display */}
                {contentPieces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No Content Repurposing Plans Yet</p>
                    <p className="text-sm">Add content pieces to get AI repurposing suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Content for Repurposing ({contentPieces.length})</h4>
                    {contentPieces.map((content) => (
                      <div key={content.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{content.title}</h5>
                            <p className="text-sm text-gray-600">{content.type}</p>
                            {content.originalPlatform && <p className="text-xs text-gray-500">Platform: {content.originalPlatform}</p>}
                          </div>
                          <button 
                            onClick={() => deleteContentPiece(content.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Repurposing Plans Display */}
                {repurposingPlans.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Repurposing Plans ({repurposingPlans.length})</h4>
                    <div className="space-y-2">
                      {repurposingPlans.slice(0, 5).map((plan) => (
                        <div key={plan.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-purple-900 text-sm">{plan.platform} - {plan.format}</h5>
                              <p className="text-xs text-purple-700">{plan.description}</p>
                              <div className="flex space-x-2 mt-1">
                                <span className="text-xs text-purple-600">Timeline: {plan.timeline}</span>
                                <span className={`text-xs ${
                                  plan.effort === 'Low' ? 'text-green-600' :
                                  plan.effort === 'Medium' ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  Effort: {plan.effort}
                                </span>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteRepurposingPlan(plan.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {repurposingPlans.length > 5 && (
                        <p className="text-xs text-gray-500">+ {repurposingPlans.length - 5} more plans</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Speaking Engagement Modal */}
        {addSpeakingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Speaking Opportunity</h3>
                  <button
                    onClick={() => setAddSpeakingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={speakingForm.eventName}
                    onChange={(e) => setSpeakingForm({...speakingForm, eventName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Digital Marketing Summit 2025"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                  <select
                    value={speakingForm.eventType}
                    onChange={(e) => setSpeakingForm({...speakingForm, eventType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={speakingForm.date}
                    onChange={(e) => setSpeakingForm({...speakingForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={speakingForm.audience}
                    onChange={(e) => setSpeakingForm({...speakingForm, audience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Marketing professionals, Business owners"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speaking Topic</label>
                  <textarea
                    value={speakingForm.topic}
                    onChange={(e) => setSpeakingForm({...speakingForm, topic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="Brief description of your speaking topic"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={speakingForm.status}
                    onChange={(e) => setSpeakingForm({...speakingForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Applied">Applied</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddSpeakingModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addSpeakingEngagement}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Engagement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Partnership Modal */}
        {addPartnershipModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Strategic Partnership</h3>
                  <button
                    onClick={() => setAddPartnershipModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name *</label>
                  <input
                    type="text"
                    value={partnershipForm.partnerName}
                    onChange={(e) => setPartnershipForm({...partnershipForm, partnerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Industry Expert, Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partnership Type *</label>
                  <select
                    value={partnershipForm.partnerType}
                    onChange={(e) => setPartnershipForm({...partnershipForm, partnerType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select partnership type</option>
                    {partnershipTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collaboration Type</label>
                  <input
                    type="text"
                    value={partnershipForm.collaborationType}
                    onChange={(e) => setPartnershipForm({...partnershipForm, collaborationType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Joint webinar, Cross-promotion, Content exchange"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Reach</label>
                  <input
                    type="text"
                    value={partnershipForm.expectedReach}
                    onChange={(e) => setPartnershipForm({...partnershipForm, expectedReach: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., 10,000+ professionals, 5,000 email subscribers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <select
                    value={partnershipForm.timeline}
                    onChange={(e) => setPartnershipForm({...partnershipForm, timeline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select timeline</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddPartnershipModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addPartnership}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Partnership
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Content Piece Modal */}
        {addContentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Content Piece</h3>
                  <button
                    onClick={() => setAddContentModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Title *</label>
                  <input
                    type="text"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({...contentForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., How to Build Authority in Your Industry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    value={contentForm.type}
                    onChange={(e) => setContentForm({...contentForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select content type</option>
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Platform</label>
                  <input
                    type="text"
                    value={contentForm.originalPlatform}
                    onChange={(e) => setContentForm({...contentForm, originalPlatform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., LinkedIn, YouTube, Blog"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={contentForm.description}
                    onChange={(e) => setContentForm({...contentForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Brief description of the content"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
                  <input
                    type="url"
                    value={contentForm.url}
                    onChange={(e) => setContentForm({...contentForm, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddContentModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addContentPiece}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Repurposing Modal */}
        {aiRepurposingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Content Repurposing Ideas</h3>
                  <button
                    onClick={() => setAiRepurposingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated ideas to maximize your content reach across multiple platforms</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating repurposing ideas...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-900">Repurposing Suggestions for {contentPieces.length} Content Pieces</h4>
                      <button
                        onClick={useAIRepurposingSuggestions}
                        className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                      >
                        Use All Suggestions
                      </button>
                    </div>
                    
                    {aiRepurposingSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">
                          📄 {suggestion.originalContent.title} ({suggestion.originalContent.type})
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {suggestion.repurposingIdeas.map((idea, ideaIndex) => (
                            <div key={ideaIndex} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <h6 className="font-medium text-sm text-gray-900">{idea.platform}</h6>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  idea.effort === 'Low' ? 'bg-green-100 text-green-800' :
                                  idea.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {idea.effort}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{idea.format}</p>
                              <p className="text-xs text-gray-500 mb-2">{idea.description}</p>
                              <p className="text-xs text-gray-400">Timeline: {idea.timeline}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiRepurposingSuggestions, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Repurposing ideas copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step9;

