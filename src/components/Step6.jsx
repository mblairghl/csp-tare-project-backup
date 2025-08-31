import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Package, BookOpen, Edit, Trash2 } from 'lucide-react';

const Step6 = () => {
  // Sub-step management (3 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [signatureProgram, setSignatureProgram] = useState(null);
  const [onboardingProcess, setOnboardingProcess] = useState(null);
  
  // Modal states
  const [aiProgramModalOpen, setAiProgramModalOpen] = useState(false);
  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);
  const [aiModulesModalOpen, setAiModulesModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [aiOnboardingModalOpen, setAiOnboardingModalOpen] = useState(false);
  
  // Form states
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    duration: '',
    deliveryMethod: '',
    modules: []
  });
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    duration: '',
    deliverables: ''
  });
  
  const [onboardingForm, setOnboardingForm] = useState({
    welcomeMessage: '',
    expectations: '',
    timeline: '',
    resources: ''
  });
  
  // AI results
  const [aiProgramSuggestion, setAiProgramSuggestion] = useState(null);
  const [aiModuleSuggestions, setAiModuleSuggestions] = useState([]);
  const [aiOnboardingSuggestion, setAiOnboardingSuggestion] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (3 steps total)
  const subSteps = [
    { id: 0, title: 'System Design', completed: false },
    { id: 1, title: 'Implementation & Scaling', completed: false },
    { id: 2, title: 'Milestone Reflection', completed: false }
  ];

  // Check completion status
  const hasSignatureProgram = signatureProgram !== null;
  const hasOnboardingProcess = onboardingProcess !== null;
  const isStepComplete = hasSignatureProgram && hasOnboardingProcess;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // System Design always unlocked
      case 1: return hasSignatureProgram; // Implementation unlocked when program exists
      case 2: return hasOnboardingProcess; // Milestone unlocked when onboarding exists
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasSignatureProgram; // System Design completed when program exists
      case 1: return hasOnboardingProcess; // Implementation completed when onboarding exists
      case 2: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Generate AI Signature Program
  const handleAISignatureProgram = () => {
    setIsAiLoading(true);
    setAiProgramModalOpen(true);

    // Simulate AI signature program generation
    setTimeout(() => {
      const program = {
        name: 'Authority Revenue Accelerator',
        description: 'A comprehensive 90-day program that transforms service providers into recognized authorities in their field while building predictable revenue systems.',
        duration: '90 days',
        deliveryMethod: 'Weekly group calls + self-paced modules + 1-on-1 support',
        modules: [
          {
            id: 1,
            title: 'Foundation & Positioning',
            description: 'Establish your unique market position and authority foundation',
            duration: 'Week 1-2',
            deliverables: 'Authority positioning statement, competitor analysis, unique value proposition'
          },
          {
            id: 2,
            title: 'Content Strategy & Creation',
            description: 'Build your content engine for consistent authority building',
            duration: 'Week 3-4',
            deliverables: 'Content calendar, 30 content ideas, content creation templates'
          },
          {
            id: 3,
            title: 'Lead Generation Systems',
            description: 'Create predictable lead generation that attracts ideal clients',
            duration: 'Week 5-6',
            deliverables: 'Lead magnet, landing pages, lead scoring system'
          },
          {
            id: 4,
            title: 'Sales Process Optimization',
            description: 'Build a sales process that converts prospects into clients',
            duration: 'Week 7-8',
            deliverables: 'Discovery script, objection handling, closing framework'
          },
          {
            id: 5,
            title: 'Service Delivery Excellence',
            description: 'Design a delivery system that creates raving fans',
            duration: 'Week 9-10',
            deliverables: 'Service blueprint, client onboarding, feedback systems'
          },
          {
            id: 6,
            title: 'Revenue Optimization',
            description: 'Maximize revenue through pricing, packaging, and upsells',
            duration: 'Week 11-12',
            deliverables: 'Pricing strategy, service packages, upsell framework'
          }
        ]
      };

      setAiProgramSuggestion(program);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Program Suggestion
  const useAIProgramSuggestion = () => {
    if (!aiProgramSuggestion) return;
    
    setSignatureProgram({
      id: Date.now(),
      name: aiProgramSuggestion.name,
      description: aiProgramSuggestion.description,
      duration: aiProgramSuggestion.duration,
      deliveryMethod: aiProgramSuggestion.deliveryMethod,
      modules: aiProgramSuggestion.modules
    });
    
    setAiProgramModalOpen(false);
  };

  // Add Module
  const handleAddModule = () => {
    if (!moduleForm.title) {
      alert('Please enter module title');
      return;
    }

    const newModule = {
      id: Date.now(),
      title: moduleForm.title,
      description: moduleForm.description,
      duration: moduleForm.duration,
      deliverables: moduleForm.deliverables
    };

    if (signatureProgram) {
      setSignatureProgram({
        ...signatureProgram,
        modules: [...signatureProgram.modules, newModule]
      });
    }

    setModuleForm({ title: '', description: '', duration: '', deliverables: '' });
    setAddModuleModalOpen(false);
  };

  // Generate AI Module Suggestions
  const handleAIModuleSuggestions = () => {
    setIsAiLoading(true);
    setAiModulesModalOpen(true);

    // Simulate AI module suggestions
    setTimeout(() => {
      const suggestions = [
        {
          title: 'Authority Mindset Mastery',
          description: 'Develop the confidence and mindset required to position yourself as an authority',
          duration: 'Week 1',
          deliverables: 'Mindset assessment, confidence building exercises, authority affirmations'
        },
        {
          title: 'Signature Story Development',
          description: 'Craft your compelling signature story that resonates with ideal clients',
          duration: 'Week 2',
          deliverables: 'Personal story framework, signature story script, story variations'
        },
        {
          title: 'Expert Positioning Strategy',
          description: 'Position yourself as the go-to expert in your specific niche',
          duration: 'Week 3',
          deliverables: 'Positioning statement, expert bio, credibility builders'
        },
        {
          title: 'Content Authority System',
          description: 'Create content that establishes and reinforces your authority',
          duration: 'Week 4',
          deliverables: 'Content pillars, authority content templates, publishing schedule'
        },
        {
          title: 'Relationship Building Framework',
          description: 'Build strategic relationships that amplify your authority',
          duration: 'Week 5',
          deliverables: 'Networking strategy, partnership templates, collaboration framework'
        }
      ];

      setAiModuleSuggestions(suggestions);
      setIsAiLoading(false);
    }, 2000);
  };

  // Add AI Module Suggestion
  const addAIModuleSuggestion = (suggestion) => {
    const newModule = {
      id: Date.now(),
      title: suggestion.title,
      description: suggestion.description,
      duration: suggestion.duration,
      deliverables: suggestion.deliverables
    };

    if (signatureProgram) {
      setSignatureProgram({
        ...signatureProgram,
        modules: [...signatureProgram.modules, newModule]
      });
    }
  };

  // Delete Module
  const deleteModule = (moduleId) => {
    if (signatureProgram) {
      setSignatureProgram({
        ...signatureProgram,
        modules: signatureProgram.modules.filter(module => module.id !== moduleId)
      });
    }
  };

  // Generate AI Onboarding
  const handleAIOnboarding = () => {
    setIsAiLoading(true);
    setAiOnboardingModalOpen(true);

    // Simulate AI onboarding generation
    setTimeout(() => {
      const onboarding = {
        welcomeMessage: `Welcome to ${signatureProgram?.name || 'Your Signature Program'}!

I'm thrilled you've decided to join us on this transformational journey. Over the next ${signatureProgram?.duration || '90 days'}, you're going to experience significant growth in your business and authority.

Here's what you can expect:

🎯 **Your Transformation Journey**
You'll go from where you are now to becoming a recognized authority in your field with a predictable revenue system.

📚 **Program Structure**
• ${signatureProgram?.modules?.length || 6} comprehensive modules
• Weekly group coaching calls
• Private community access
• 1-on-1 support when needed

🚀 **Getting Started**
1. Complete your welcome survey (link below)
2. Join our private community
3. Schedule your onboarding call
4. Access Module 1 materials

**Welcome Survey:** [Link]
**Community Access:** [Link]
**Calendar Link:** [Link]

I can't wait to see your transformation unfold!

[Your Name]`,
        expectations: `# PROGRAM EXPECTATIONS

## What You Can Expect From Us:
✅ **Weekly Group Calls** - Every Tuesday at 2pm EST
✅ **Module Release Schedule** - New module every 2 weeks
✅ **Community Support** - 24/7 access to our private group
✅ **Response Time** - All questions answered within 24 hours
✅ **1-on-1 Support** - Monthly 30-minute strategy sessions
✅ **Resource Library** - Templates, worksheets, and tools
✅ **Lifetime Access** - Keep all materials forever

## What We Expect From You:
🎯 **Active Participation** - Attend weekly calls when possible
🎯 **Implementation** - Complete assignments and take action
🎯 **Community Engagement** - Share wins and ask questions
🎯 **Feedback** - Help us improve the program with your input
🎯 **Commitment** - Stay engaged for the full program duration

## Success Metrics:
By the end of this program, you will have:
• Established authority positioning in your market
• Created a predictable lead generation system
• Built a sales process that converts consistently
• Developed a signature program/service offering
• Implemented systems for sustainable growth`,
        timeline: `# PROGRAM TIMELINE

## Phase 1: Foundation (Weeks 1-4)
**Focus:** Positioning & Strategy
- Week 1: Authority positioning and mindset
- Week 2: Signature story development
- Week 3: Market analysis and positioning
- Week 4: Content strategy foundation

**Deliverables:**
✅ Authority positioning statement
✅ Signature story script
✅ Content calendar template
✅ Ideal client avatar refinement

## Phase 2: Systems (Weeks 5-8)
**Focus:** Lead Generation & Sales
- Week 5: Lead magnet creation
- Week 6: Landing page optimization
- Week 7: Sales process development
- Week 8: Objection handling mastery

**Deliverables:**
✅ High-converting lead magnet
✅ Landing page copy and design
✅ Discovery call framework
✅ Sales script and objection responses

## Phase 3: Delivery (Weeks 9-12)
**Focus:** Service Excellence & Growth
- Week 9: Service delivery optimization
- Week 10: Client onboarding system
- Week 11: Revenue optimization
- Week 12: Scaling and automation

**Deliverables:**
✅ Service delivery blueprint
✅ Client onboarding sequence
✅ Pricing and packaging strategy
✅ Growth and scaling plan

## Ongoing Support:
• **Weekly Group Calls** - Every Tuesday
• **Monthly 1-on-1 Sessions** - 30 minutes each
• **Community Access** - 24/7 support and networking
• **Resource Updates** - New templates and tools added monthly`,
        resources: `# PROGRAM RESOURCES

## Core Materials:
📚 **Program Workbook** - 150+ page comprehensive guide
📋 **Implementation Worksheets** - Step-by-step action templates
🎥 **Video Training Library** - 20+ hours of training content
🎧 **Audio Modules** - Listen on-the-go versions of all content

## Templates & Tools:
📝 **Content Templates** - 50+ proven content templates
📊 **Tracking Spreadsheets** - Monitor your progress and metrics
📧 **Email Templates** - Nurture sequences and follow-up scripts
🎨 **Design Templates** - Social media and marketing materials

## Technology Stack:
🔧 **CRM Setup Guide** - Recommended tools and configuration
📱 **Social Media Scheduler** - Content planning and automation
📈 **Analytics Dashboard** - Track your authority and revenue growth
💬 **Community Platform** - Private group for networking and support

## Bonus Resources:
🎁 **Authority Toolkit** - Additional resources worth $500
🎁 **Revenue Calculator** - Project your growth potential
🎁 **Partnership Templates** - Collaboration and JV agreements
🎁 **Scaling Checklist** - When and how to scale your business

## Support Channels:
📞 **Weekly Group Calls** - Live Q&A and hot seat coaching
💬 **Private Community** - Peer support and networking
📧 **Email Support** - Direct access for urgent questions
📅 **Monthly 1-on-1** - Personalized strategy and troubleshooting`
      };

      setAiOnboardingSuggestion(onboarding);
      setIsAiLoading(false);
    }, 3000);
  };

  // Use AI Onboarding Suggestion
  const useAIOnboardingSuggestion = () => {
    if (!aiOnboardingSuggestion) return;
    
    setOnboardingProcess({
      id: Date.now(),
      welcomeMessage: aiOnboardingSuggestion.welcomeMessage,
      expectations: aiOnboardingSuggestion.expectations,
      timeline: aiOnboardingSuggestion.timeline,
      resources: aiOnboardingSuggestion.resources
    });
    
    setAiOnboardingModalOpen(false);
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Design your signature program delivery system with modules, onboarding, and client success frameworks.",
    steps: [
      {
        title: "System Design",
        description: "Create your signature program structure",
        color: "bg-[#0e9246]"
      },
      {
        title: "Implementation", 
        description: "Build onboarding and delivery processes",
        color: "bg-[#d7df21]"
      },
      {
        title: "Milestone",
        description: "Complete your delivery system",
        color: "bg-[#467a8f]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 6 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Build Your Delivery System
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Design your signature program structure and client onboarding process.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Current Sub-step */}
          <div className="space-y-6">
            {activeSubStep === 0 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">System Design</h3>
                <p className="text-gray-600 mb-6">Design your signature program structure and modules.</p>
                
                {/* AI Program Generation */}
                <div className="mb-8">
                  <button
                    onClick={handleAISignatureProgram}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Signature Program with AI</span>
                  </button>
                </div>

                {/* Program Display */}
                {!signatureProgram ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No signature program created yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Program Overview */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{signatureProgram.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{signatureProgram.description}</p>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>Duration: {signatureProgram.duration}</span>
                        <span>Modules: {signatureProgram.modules.length}</span>
                      </div>
                    </div>

                    {/* Modules Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Program Lessons ({signatureProgram.modules.length})</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setAddModuleModalOpen(true)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add Lesson
                          </button>
                          <button
                            onClick={handleAIModuleSuggestions}
                            className="px-3 py-1 bg-[#d7df21] text-black text-sm rounded hover:bg-[#c5cd1e]"
                          >
                            AI Ideas
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {signatureProgram.modules.map((module, index) => (
                          <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">Lesson {index + 1}: {module.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                                  <span>Duration: {module.duration}</span>
                                </div>
                                {module.deliverables && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    <span className="font-medium">Deliverables:</span> {module.deliverables}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1 ml-4">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteModule(module.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Implementation & Scaling</h3>
                <p className="text-gray-600 mb-6">Create your client onboarding process and delivery framework.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleAIOnboarding}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Onboarding with AI</span>
                  </button>
                  
                  <button
                    onClick={() => setOnboardingModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Manual Onboarding</span>
                  </button>
                </div>

                {onboardingProcess && (
                  <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Onboarding Process Created</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Welcome message and expectations</p>
                      <p>• Program timeline and milestones</p>
                      <p>• Resource library and tools</p>
                      <p>• Support channels and communication</p>
                    </div>
                    <button
                      onClick={() => setAiOnboardingModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Onboarding Process →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've built your complete delivery system.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Designed signature program: "{signatureProgram?.name}"</li>
                      <li>✅ Created {signatureProgram?.modules?.length || 0} program lessons</li>
                      <li>✅ Built comprehensive onboarding process</li>
                      <li>✅ Established client delivery framework</li>
                      <li>✅ Created scalable service delivery system</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 7: Metrics & Monitoring to track your business performance and growth.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Program Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Delivery System Overview</h3>
            
            {/* Signature Program Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Signature Program</h4>
              {!signatureProgram ? (
                <p className="text-gray-500 text-sm">No signature program created yet</p>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Package className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{signatureProgram.name}</span>
                  </div>
                  <p className="text-sm text-blue-700">{signatureProgram.duration}</p>
                  <p className="text-sm text-blue-700">{signatureProgram.modules.length} lessons</p>
                </div>
              )}
            </div>

            {/* Onboarding Process Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Onboarding Process</h4>
              {!onboardingProcess ? (
                <p className="text-gray-500 text-sm">No onboarding process created yet</p>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Complete Onboarding</span>
                  </div>
                  <p className="text-sm text-green-700">Welcome, expectations, timeline, resources</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">System Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Signature Program</span>
                  <span className={`text-sm font-medium ${hasSignatureProgram ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasSignatureProgram ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Onboarding Process</span>
                  <span className={`text-sm font-medium ${hasOnboardingProcess ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasOnboardingProcess ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Program Modal */}
        {aiProgramModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Signature Program</h3>
                  <button
                    onClick={() => setAiProgramModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated signature program structure</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating signature program...</span>
                  </div>
                ) : aiProgramSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{aiProgramSuggestion.name}</h4>
                      <p className="text-gray-600 mb-4">{aiProgramSuggestion.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <p className="text-gray-600">{aiProgramSuggestion.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Delivery:</span>
                          <p className="text-gray-600">{aiProgramSuggestion.deliveryMethod}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Lessons ({aiProgramSuggestion.modules.length})</h4>
                      <div className="space-y-3">
                        {aiProgramSuggestion.modules.map((module, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900">Lesson {index + 1}: {module.title}</h5>
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                              <span>Duration: {module.duration}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Deliverables:</span> {module.deliverables}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setAiProgramModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={useAIProgramSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Module Modal */}
        {addModuleModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add Program Lesson</h3>
                  <button
                    onClick={() => setAddModuleModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Enter lesson title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="What will students learn in this lesson?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={moduleForm.duration}
                    onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Week 1, 2 hours, 3 days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deliverables</label>
                  <textarea
                    value={moduleForm.deliverables}
                    onChange={(e) => setModuleForm({...moduleForm, deliverables: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="2"
                    placeholder="What will students receive or complete?"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddModuleModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModule}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Add Lesson
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Module Suggestions Modal */}
        {aiModulesModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Lesson Ideas</h3>
                  <button
                    onClick={() => setAiModulesModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated lesson ideas for your signature program</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating lesson ideas...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Recommended Lessons ({aiModuleSuggestions.length} ideas)</h4>
                    {aiModuleSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{suggestion.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          <span className="font-medium">Duration:</span> {suggestion.duration} | 
                          <span className="font-medium"> Deliverables:</span> {suggestion.deliverables}
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => addAIModuleSuggestion(suggestion)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add Lesson
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Onboarding Modal */}
        {aiOnboardingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Complete Onboarding Process</h3>
                  <button
                    onClick={() => setAiOnboardingModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating onboarding process...</span>
                  </div>
                ) : aiOnboardingSuggestion && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Welcome Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiOnboardingSuggestion.welcomeMessage}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Expectations</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiOnboardingSuggestion.expectations}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Timeline</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiOnboardingSuggestion.timeline}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Resources & Support</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiOnboardingSuggestion.resources}</pre>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = Object.values(aiOnboardingSuggestion || {}).join('\n\n');
                      navigator.clipboard.writeText(content);
                      alert('Onboarding process copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={useAIOnboardingSuggestion}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Use This Onboarding
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

export default Step6;

