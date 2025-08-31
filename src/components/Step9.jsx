import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Mic, Users, RefreshCw, Calendar, MapPin, Edit, Trash2, Target, Award } from 'lucide-react';

const Step9 = () => {
  // Sub-step management (3 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  
  // Data states
  const [speakingEngagements, setSpeakingEngagements] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [contentPieces, setContentPieces] = useState([]);
  
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
    status: 'Confirmed'
  });
  
  const [partnershipForm, setPartnershipForm] = useState({
    partnerName: '',
    partnerType: '',
    collaborationType: '',
    expectedReach: '',
    timeline: '',
    status: 'Active'
  });
  
  const [contentForm, setContentForm] = useState({
    title: '',
    type: '',
    status: 'In Progress',
    repurposingPlan: '',
    platforms: '',
    reach: '',
    conversions: ''
  });
  
  // AI results
  const [aiRepurposingSuggestions, setAiRepurposingSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (3 steps total)
  const subSteps = [
    { id: 0, title: 'Strategy Hub', completed: false },
    { id: 1, title: 'Authority Scaling', completed: false },
    { id: 2, title: 'Milestone Reflection', completed: false }
  ];

  // Check completion status
  const hasStrategies = speakingEngagements.length > 0 || partnerships.length > 0;
  const hasContent = contentPieces.length > 0;
  const isStepComplete = hasStrategies && hasContent;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // Strategy Hub always unlocked
      case 1: return hasStrategies; // Authority Scaling unlocked when strategies exist
      case 2: return hasStrategies && hasContent; // Milestone unlocked when both exist
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasStrategies; // Strategy completed when any strategy exists
      case 1: return hasContent; // Scaling completed when content exists
      case 2: return isStepComplete; // Milestone completed when everything done
      default: return false;
    }
  };

  // Event type options
  const eventTypes = [
    'Conference',
    'Trade Show',
    'Podcast',
    'Webinar',
    'Workshop',
    'Panel Discussion',
    'Keynote',
    'Masterclass',
    'Virtual Summit',
    'Industry Event'
  ];

  // Partnership types
  const partnershipTypes = [
    'Industry Expert',
    'Media Partner',
    'Business Consultant',
    'Content Creator',
    'Technology Partner',
    'Strategic Alliance',
    'Joint Venture',
    'Affiliate Partner',
    'Referral Partner',
    'Cross-Promotion'
  ];

  // Content types
  const contentTypes = [
    'Webinar',
    'White Paper',
    'Case Study',
    'Blog Post',
    'Video Series',
    'Podcast Episode',
    'E-book',
    'Course Module',
    'Workshop',
    'Masterclass'
  ];

  // Status options
  const statusOptions = [
    'Planning',
    'In Progress', 
    'Completed',
    'Scheduled',
    'Confirmed',
    'Negotiating',
    'Prospecting'
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
      status: 'Confirmed'
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
      status: 'Active'
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
      status: 'In Progress',
      repurposingPlan: '',
      platforms: '',
      reach: '',
      conversions: ''
    });
    setAddContentModalOpen(false);
  };

  // Generate AI Repurposing Ideas
  const handleAIRepurposing = () => {
    setIsAiLoading(true);
    setAiRepurposingModalOpen(true);

    // Simulate AI repurposing generation
    setTimeout(() => {
      const suggestions = [
        {
          title: "LinkedIn Authority Building Strategy",
          description: "Develop a comprehensive LinkedIn strategy to establish thought leadership",
          platforms: "LinkedIn, Blog, Email Newsletter",
          timeline: "3 months",
          expectedReach: "50,000+ professionals"
        },
        {
          title: "Podcast Guest Appearance Campaign", 
          description: "Secure 10 podcast appearances on industry-relevant shows",
          platforms: "Podcasts, Social Media, Website",
          timeline: "6 months",
          expectedReach: "100,000+ listeners"
        },
        {
          title: "Content Collaboration Network",
          description: "Build relationships with 5 complementary service providers",
          platforms: "Cross-promotion, Joint Content, Referrals",
          timeline: "4 months",
          expectedReach: "25,000+ combined audiences"
        }
      ];

      setAiRepurposingSuggestions(suggestions);
      setIsAiLoading(false);
    }, 2000);
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

  // How This Works content
  const howThisWorksContent = {
    description: "Scale your authority and influence through strategic partnerships, thought leadership, and systematic expansion of your market presence.",
    steps: [
      {
        title: "Strategy Hub",
        description: "Plan speaking engagements and partnerships",
        color: "bg-[#0e9246]"
      },
      {
        title: "Authority Scaling", 
        description: "Execute content repurposing and scaling",
        color: "bg-[#d7df21]"
      },
      {
        title: "Milestone Reflection",
        description: "Celebrate authority amplification success",
        color: "bg-[#0e9246]"
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
            Scale your authority and influence through strategic partnerships, thought leadership, and systematic expansion of your market presence.
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
              {/* Speaking Engagement Tracker */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Speaking Engagement Tracker</h3>
                  <button
                    className="px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Ideas</span>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Manage speaking opportunities and thought leadership events.</p>
                
                <button
                  onClick={() => setAddSpeakingModalOpen(true)}
                  className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2 mb-6"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Speaking Opportunity</span>
                </button>

                {/* Speaking Engagements List */}
                <div className="space-y-4">
                  {speakingEngagements.map((engagement) => (
                    <div key={engagement.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{engagement.eventName}</h4>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteSpeakingEngagement(engagement.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{engagement.eventType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium">{engagement.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">{engagement.date || 'TBD'}</p>
                        </div>
                      </div>
                      
                      {engagement.topic && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Topic:</span>
                          <p className="text-sm text-gray-700">{engagement.topic}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Partnership Finder */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Strategic Partnership Finder</h3>
                  <button
                    className="px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Ideas</span>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Identify and manage strategic partnership opportunities.</p>
                
                <button
                  onClick={() => setAddPartnershipModalOpen(true)}
                  className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2 mb-6"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Partnership</span>
                </button>

                {/* Partnerships List */}
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{partnership.partnerName}</h4>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deletePartnership(partnership.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{partnership.partnerType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium">{partnership.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Timeline:</span>
                          <p className="font-medium">{partnership.timeline || 'TBD'}</p>
                        </div>
                      </div>
                      
                      {partnership.collaborationType && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Collaboration:</span>
                          <p className="text-sm text-gray-700">{partnership.collaborationType}</p>
                        </div>
                      )}
                      
                      {partnership.expectedReach && (
                        <div className="mt-2">
                          <span className="text-gray-500 text-sm">Expected Reach:</span>
                          <p className="text-sm text-gray-700">{partnership.expectedReach}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubStep === 1 && (
            <div className="space-y-6">
              {/* Content Repurposing Engine */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Content Repurposing Engine</h3>
                  <button
                    onClick={handleAIRepurposing}
                    className="px-4 py-2 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Repurposing Ideas</span>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">Maximize content value by repurposing across multiple channels and formats.</p>
                
                <button
                  onClick={() => setAddContentModalOpen(true)}
                  className="w-full px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2 mb-6"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Content Piece</span>
                </button>

                {/* Content Pieces List */}
                <div className="space-y-4">
                  {contentPieces.map((content) => (
                    <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{content.title}</h4>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteContentPiece(content.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{content.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium">{content.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Platforms:</span>
                          <p className="font-medium">{content.platforms || 'TBD'}</p>
                        </div>
                      </div>
                      
                      {content.repurposingPlan && (
                        <div className="mt-3">
                          <span className="text-gray-500 text-sm">Repurposing Plan:</span>
                          <p className="text-sm text-gray-700">{content.repurposingPlan}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-gray-500">Reach:</span>
                          <p className="font-medium">{content.reach || 'TBD'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Conversions:</span>
                          <p className="font-medium">{content.conversions || 'TBD'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubStep === 2 && (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0e9246] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 Authority Amplification Complete!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Congratulations! You've successfully built your authority amplification strategy.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What You've Accomplished</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div>
                      <h4 className="font-medium text-[#0e9246] mb-2">Speaking Strategy</h4>
                      <p className="text-sm text-gray-600">
                        {speakingEngagements.length} speaking engagements planned to establish thought leadership
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e9246] mb-2">Strategic Partnerships</h4>
                      <p className="text-sm text-gray-600">
                        {partnerships.length} partnerships identified to expand your reach and influence
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#0e9246] mb-2">Content Amplification</h4>
                      <p className="text-sm text-gray-600">
                        {contentPieces.length} content pieces ready for multi-platform repurposing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 You're Ready to Amplify Your Authority!</h3>
                  <p className="text-blue-800 mb-4">
                    Your authority amplification strategy is now complete. You have the speaking opportunities, 
                    strategic partnerships, and content repurposing plan needed to scale your influence across 
                    multiple channels and establish yourself as the go-to expert in your industry.
                  </p>
                  <p className="text-blue-700 text-sm">
                    <strong>Next:</strong> Execute your speaking engagements, activate partnerships, and implement 
                    your content repurposing strategy to maximize your authority and market presence.
                  </p>
                </div>
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
                    placeholder="e.g., Authority Marketing Summit 2024"
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
                    placeholder="e.g., 100,000+ industry professionals"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speaking Topic</label>
                  <textarea
                    value={speakingForm.topic}
                    onChange={(e) => setSpeakingForm({...speakingForm, topic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="e.g., Building Authentic Authority in the Digital Age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={speakingForm.status}
                    onChange={(e) => setSpeakingForm({...speakingForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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
                    placeholder="e.g., Strategic Business Consultants Inc."
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
                    placeholder="e.g., Cross-Referral Program"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Reach</label>
                  <input
                    type="text"
                    value={partnershipForm.expectedReach}
                    onChange={(e) => setPartnershipForm({...partnershipForm, expectedReach: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., 50,000+ target participants"
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
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={partnershipForm.status}
                    onChange={(e) => setPartnershipForm({...partnershipForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
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
                    placeholder="e.g., Authority Building Master"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={contentForm.status}
                    onChange={(e) => setContentForm({...contentForm, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repurposing Plan</label>
                  <textarea
                    value={contentForm.repurposingPlan}
                    onChange={(e) => setContentForm({...contentForm, repurposingPlan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="e.g., Extract 5 key insights for LinkedIn posts, Create podcast episode from audio, Develop blog post series (3 parts)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                  <input
                    type="text"
                    value={contentForm.platforms}
                    onChange={(e) => setContentForm({...contentForm, platforms: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., LinkedIn, Blog, YouTube, Podcast, Email Newsletter"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reach</label>
                    <input
                      type="text"
                      value={contentForm.reach}
                      onChange={(e) => setContentForm({...contentForm, reach: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                      placeholder="e.g., 15,000+ views"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Conversions</label>
                    <input
                      type="text"
                      value={contentForm.conversions}
                      onChange={(e) => setContentForm({...contentForm, conversions: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                      placeholder="e.g., 125 new leads"
                    />
                  </div>
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Authority Amplification Ideas</h3>
                  <button
                    onClick={() => setAiRepurposingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated strategies to amplify your authority and expand your influence</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating authority amplification ideas...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {aiRepurposingSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-3">{suggestion.title}</h4>
                        <p className="text-gray-700 mb-4">{suggestion.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Platforms:</span>
                            <p className="font-medium">{suggestion.platforms}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Timeline:</span>
                            <p className="font-medium">{suggestion.timeline}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Expected Reach:</span>
                            <p className="font-medium">{suggestion.expectedReach}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            // Add suggestion as content piece
                            const newContent = {
                              id: Date.now() + index,
                              title: suggestion.title,
                              type: 'Strategy',
                              status: 'Planning',
                              repurposingPlan: suggestion.description,
                              platforms: suggestion.platforms,
                              reach: suggestion.expectedReach,
                              conversions: 'TBD'
                            };
                            setContentPieces([...contentPieces, newContent]);
                          }}
                          className="mt-4 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                        >
                          Add Strategy
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiRepurposingSuggestions, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Authority amplification ideas copied to clipboard!');
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

        {/* Footer */}
        <div className="mt-12 flex justify-between items-center">
          <button className="px-6 py-3 bg-[#467a8f] text-white rounded-lg hover:bg-[#3a6b7d] flex items-center space-x-2">
            <span>← Previous Step</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">Progress saved automatically</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">© 2025 Cultivating Sales, LLC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Step9;

