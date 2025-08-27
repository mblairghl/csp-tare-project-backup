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
  const subSteps = [
    { id: 'lead-magnet-strategy', title: 'Lead Magnet Strategy', description: 'Create your lead magnet' },
    { id: 'nurture-sequence', title: 'Nurture Sequence', description: 'Plan your email sequence' },
    { id: 'funnel-pages', title: 'Funnel Pages', description: 'Create your landing pages' },
    { id: 'milestone-reflection', title: 'Milestone Reflection', description: 'Celebrate your progress' }
  ];

  const [activeSubStep, setActiveSubStep] = useState(1);
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
  const [nurtureSequence, setNurtureSequence] = useState([]);
  const [funnelPages, setFunnelPages] = useState([]);
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
    
    // Auto-progress to next sub-step after a short delay
    setTimeout(() => {
      setActiveSubStep(2);
    }, 1000);
  };

  // Handle closing AI modal and resetting state
  const handleCloseAIModal = () => {
    setAiModalOpen(false);
    setAddedComponents([]);
  };

  // Generate nurture sequence
  const handleGenerateNurtureSequence = async () => {
    setAiLoading(true);
    try {
      const mockSequence = [
        {
          id: 1,
          title: "Welcome! Your The Authority Success Blueprint is Here",
          purpose: "Deliver the lead magnet and set expectations",
          timing: "Immediately after opt-in",
          content: `Hi [First Name], Thank you for downloading "The Authority Success Blueprint"! I'm excited to share this PDF Guide + Checklist with you because I know how challenging it can be to achieve consistent results in today's competitive landscape. Over the next few days, I'll be sending you additional insights and strategies that have helped hundreds of business owners like you transform their approach to business growth. Your PDF Guide + Checklist is attached to this email. Take a few minutes to review it, and don't hesitate to reply if you have any questions. To your success, [Your Name] P.S. Keep an eye on your inbox - I have some valuable insights coming your way that you won't want to miss!`
        },
        {
          id: 2,
          title: "The #1 Mistake Most Business Owners Make",
          purpose: "Identify common problems and position your expertise",
          timing: "2 days after opt-in",
          content: `Hi [First Name], I've been working with business owners for over [X years], and I see the same costly mistake over and over again. Most people try to solve their challenges by doing MORE - more marketing, more networking, more content creation. But here's what I've learned: Success isn't about doing more. It's about doing the RIGHT things in the RIGHT order. The The Authority Success Blueprint I shared with you yesterday shows you exactly what those "right things" are. But there's something even more important... [Share a specific insight or story about the mistake and how to avoid it] Tomorrow, I'll share a real case study of how one of my clients avoided this mistake and achieved incredible results in just [timeframe]. Talk soon, [Your Name]`
        },
        {
          id: 3,
          title: "How [Client Name] Achieved Amazing Results",
          purpose: "Build credibility through social proof",
          timing: "4 days after opt-in",
          content: `Hi [First Name], I want to share a quick story about [Client Name], a business owner just like you. When [Client Name] first came to me, they were struggling with the same challenges you might be facing. They had tried everything - different strategies, various tools, even hired other consultants. Nothing worked. But within [timeframe] of implementing the system I'm going to tell you about, they achieved: • [Specific result #1] • [Specific result #2] • [Specific result #3] The breakthrough came when they stopped trying to figure it out alone and started following a proven system. The same system that's helped over [number] business owners achieve their goals. If you're ready to stop struggling and start seeing real results, I'd love to show you exactly how this system works. More details coming tomorrow... Best regards, [Your Name] P.S. [Client Name] told me last week that this was the best investment they've ever made in their business. I think you'd feel the same way.`
        },
        {
          id: 4,
          title: "The Secret to Consistent Success",
          purpose: "Share valuable insights and build authority",
          timing: "7 days after opt-in",
          content: `Hi [First Name], After working with hundreds of business owners, I've discovered something fascinating: The difference between those who achieve consistent success and those who struggle isn't talent, luck, or even hard work. It's having the right SYSTEM. Most people approach their goals randomly - trying different tactics, hoping something will stick. But successful people follow a proven framework that eliminates guesswork. Here's the 3-step system that's worked for over [number] business owners: Step 1: [Specific strategy related to their business] Step 2: [Implementation tactic that gets results] Step 3: [Optimization method for scaling] This is exactly what I teach in my signature program, and it's why my clients see results so quickly. The The Authority Success Blueprint you downloaded gives you a taste of this approach, but there's so much more... If you're serious about achieving your goals, I'd love to show you the complete system. Keep an eye on your inbox. [Your Name]`
        },
        {
          id: 5,
          title: "Ready to Take the Next Step?",
          purpose: "Soft introduction to your signature offer",
          timing: "10 days after opt-in",
          content: `Hi [First Name], Over the past week, I've shared some of my best strategies for achieving success. You've learned: ✓ The #1 mistake that keeps most business owners stuck ✓ How [Client Name] achieved amazing results using our system ✓ The 3-step framework that eliminates guesswork and delivers consistent results But here's the thing - knowledge without implementation is just entertainment. If you're ready to stop learning and start DOING, I have something special for you. My signature program takes everything I've shared (and much more) and gives you a step-by-step roadmap to achieve your goals in the next [timeframe]. This isn't just another course. It's a complete system with: • Done-for-you templates and frameworks • Weekly group coaching calls • Direct access to me for questions • A community of like-minded business owners I only work with [number] clients at a time to ensure everyone gets the attention they deserve. If you're interested in learning more, simply reply to this email with "TELL ME MORE" and I'll send you the details. To your success, [Your Name] P.S. Don't wait too long - I have limited spots available and they fill up quickly.`
        }
      ];
      
      setNurtureSequence(mockSequence);
      
      // Auto-progress to next sub-step after generating sequence
      setTimeout(() => {
        setActiveSubStep(3);
      }, 1500);
    } catch (error) {
      console.error('Error generating nurture sequence:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Generate funnel pages
  const handleGenerateFunnelPages = async () => {
    setAiLoading(true);
    try {
      const mockPages = [
        {
          id: 1,
          type: "Landing Page",
          title: "Get Your Free Authority Success Blueprint",
          content: {
            headline: "Finally! The Proven Framework That Transforms Struggling Business Owners Into Recognized Authorities",
            subheadline: "Download your free PDF Guide + Checklist and discover the exact system successful authorities use to achieve consistent results",
            bullets: [
              "The 3-step authority framework that eliminates guesswork",
              "How to systematically grow your business without overwhelming complexity",
              "The exact strategies that have helped 500+ business owners achieve their goals"
            ],
            cta: "Get My Free Blueprint Now",
            form: {
              fields: ["First Name", "Email Address"],
              button: "Download Now"
            }
          }
        },
        {
          id: 2,
          type: "Thank You Page",
          title: "Success! Your Blueprint is On Its Way",
          content: {
            headline: "Check Your Email - Your Authority Success Blueprint is Coming!",
            message: "I've just sent your PDF Guide + Checklist to your email address. It should arrive within the next few minutes.",
            nextSteps: [
              "Check your email (including spam folder) for your blueprint",
              "Download and review the PDF Guide + Checklist",
              "Watch for my follow-up emails with additional strategies"
            ],
            socialProof: "Join 2,500+ business owners who are already using this framework to grow their authority and revenue."
          }
        }
      ];
      
      setFunnelPages(mockPages);
      
      // Auto-progress to milestone after generating pages
      setTimeout(() => {
        setActiveSubStep(4);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }, 1500);
    } catch (error) {
      console.error('Error generating funnel pages:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Check if lead magnet is complete
  const isLeadMagnetComplete = leadMagnet.title && leadMagnet.format && leadMagnet.problem && leadMagnet.valueProposition;

  // Auto-progress when lead magnet form is manually completed
  useEffect(() => {
    if (isLeadMagnetComplete && activeSubStep === 1) {
      const timer = setTimeout(() => {
        setActiveSubStep(2);
      }, 2000); // Give user time to see completion
      
      return () => clearTimeout(timer);
    }
  }, [isLeadMagnetComplete, activeSubStep]);

  const howThisWorksContent = {
    description: "Step 4 detailed description of how this works.",
    steps: [
      { title: 'Lead Magnet Creation', description: 'Create compelling lead magnets that attract your ideal clients.', color: 'bg-green-600', textColor: '#16a34a' },
      { title: 'Nurture Sequence', description: 'Build trust with automated email sequences that guide prospects to purchase.', color: 'bg-blue-600', textColor: '#2563eb' },
      { title: 'Funnel Pages', description: 'Create high-converting landing pages and thank you pages.', color: 'bg-yellow-600', textColor: '#ca8a04' }
    ]
  };

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
                  activeSubStep === index + 1
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed ? 'bg-green-600 text-white' : 
                    activeSubStep === index + 1 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
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
            {activeSubStep === 1 && (
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

            {activeSubStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nurture Sequence Planning</h3>
                <p className="text-gray-600 mb-6">
                  Plan your email sequence that builds trust and guides prospects toward your signature offer.
                </p>
                
                <div className="space-y-6">
                  {nurtureSequence.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Nurture Sequence Planned</h4>
                      <p className="text-gray-600 mb-4">Generate your personalized email sequence that bridges your lead magnet to your signature offer.</p>
                      <button 
                        onClick={handleGenerateNurtureSequence}
                        disabled={aiLoading}
                        className="text-black px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#d7df21' }}
                      >
                        {aiLoading ? '🤖 Generating...' : '🤖 Generate Sequence'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900">Your Nurture Sequence</h4>
                        <button 
                          onClick={handleGenerateNurtureSequence}
                          disabled={aiLoading}
                          className="text-black px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: '#d7df21' }}
                        >
                          {aiLoading ? '🤖 Regenerating...' : '🤖 Generate Sequence'}
                        </button>
                      </div>
                      
                      {nurtureSequence.map((email, index) => (
                        <div key={email.id} className="bg-white p-6 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h5 className="text-lg font-semibold text-gray-900 mb-2">
                                Email {email.id}: {email.title}
                              </h5>
                              <p className="text-sm text-gray-600 mb-2">{email.purpose}</p>
                              <p className="text-sm font-medium text-blue-600">Send: {email.timing}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                Edit
                              </button>
                              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded border">
                            <h6 className="font-medium text-gray-900 mb-2">Content:</h6>
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {email.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Funnel Pages</h3>
                <p className="text-gray-600 mb-6">
                  Create your lead magnet landing page and thank you page using a high converting funnel framework.
                </p>
                
                <div className="space-y-6">
                  {funnelPages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">No Funnel Pages Created</h4>
                      <p className="text-gray-600 mb-4">Generate your high converting landing page and thank you page.</p>
                      <button 
                        onClick={handleGenerateFunnelPages}
                        disabled={aiLoading}
                        className="text-black px-6 py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#d7df21' }}
                      >
                        {aiLoading ? '🤖 Generating...' : '🤖 Generate Pages'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900">Your Funnel Pages</h4>
                        <button 
                          onClick={handleGenerateFunnelPages}
                          disabled={aiLoading}
                          className="text-black px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                          style={{ backgroundColor: '#d7df21' }}
                        >
                          {aiLoading ? '🤖 Regenerating...' : '🤖 Generate Pages'}
                        </button>
                      </div>
                      
                      {funnelPages.map((page, index) => (
                        <div key={page.id} className="bg-white p-6 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h5 className="text-lg font-semibold text-gray-900 mb-2">
                                {page.type}: {page.title}
                              </h5>
                            </div>
                            <div className="flex space-x-2">
                              <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                Edit
                              </button>
                              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded border">
                            <h6 className="font-medium text-gray-900 mb-3">Page Content:</h6>
                            
                            {page.type === "Landing Page" && (
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium text-gray-800">Headline:</p>
                                  <p className="text-gray-700">{page.content.headline}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Subheadline:</p>
                                  <p className="text-gray-700">{page.content.subheadline}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Key Benefits:</p>
                                  <ul className="list-disc list-inside text-gray-700 ml-2">
                                    {page.content.bullets.map((bullet, idx) => (
                                      <li key={idx}>{bullet}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Call-to-Action:</p>
                                  <p className="text-gray-700">{page.content.cta}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Form Fields:</p>
                                  <p className="text-gray-700">{page.content.form.fields.join(", ")}</p>
                                </div>
                              </div>
                            )}
                            
                            {page.type === "Thank You Page" && (
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium text-gray-800">Headline:</p>
                                  <p className="text-gray-700">{page.content.headline}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Message:</p>
                                  <p className="text-gray-700">{page.content.message}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Next Steps:</p>
                                  <ul className="list-disc list-inside text-gray-700 ml-2">
                                    {page.content.nextSteps.map((step, idx) => (
                                      <li key={idx}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">Social Proof:</p>
                                  <p className="text-gray-700">{page.content.socialProof}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

              {activeSubStep === 4 && (
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
                    You've successfully completed Step 4: Signature Funnel Build
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
                      <li>• Created your lead magnet strategy with clear value proposition</li>
                      <li>• Developed a complete 5-email nurture sequence</li>
                      <li>• Generated high-converting landing page and thank you page templates</li>
                      <li>• Built the foundation for your signature funnel system</li>
                    </ul>
                  </div>
                  
                  {/* What This Means */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <span className="mr-2">🚀</span>
                      What This Means
                    </h4>
                    <ul className="text-blue-700 space-y-2">
                      <li>• You have a complete funnel blueprint ready to implement</li>
                      <li>• Your lead magnet will attract and convert your ideal clients</li>
                      <li>• Your nurture sequence builds trust and guides prospects to purchase</li>
                      <li>• You're ready to move on to sales pipeline automation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <span className="mr-2">💡</span>
                    Key Insight
                  </h4>
                  <p className="text-yellow-700">
                    Your signature funnel is the engine that transforms strangers into clients. With your lead magnet, 
                    nurture sequence, and landing pages in place, you now have a systematic way to attract, educate, 
                    and convert your ideal clients consistently.
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ready to automate your sales pipeline and scale your authority business?
                  </p>
                  <div className="text-sm text-gray-500">
                    Continue to Step 5: Sales Pipeline Automation
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <StepFooter 
          currentStep={4} 
          totalSteps={9} 
          showNextStep={activeSubStep === 4}
        />

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
