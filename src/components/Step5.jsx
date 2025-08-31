import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Calendar, MessageSquare, Phone } from 'lucide-react';

const Step5 = () => {
  // Sub-step management (3 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [discoverySetup, setDiscoverySetup] = useState(null);
  const [conversationFramework, setConversationFramework] = useState(null);
  
  // Modal states
  const [discoverySetupModalOpen, setDiscoverySetupModalOpen] = useState(false);
  const [aiDiscoveryQuestionsModalOpen, setAiDiscoveryQuestionsModalOpen] = useState(false);
  const [conversationFrameworkModalOpen, setConversationFrameworkModalOpen] = useState(false);
  const [longTermNurtureModalOpen, setLongTermNurtureModalOpen] = useState(false);
  
  // Form states
  const [discoveryForm, setDiscoveryForm] = useState({
    sessionName: '',
    timeFrame: '',
    calendarLink: '',
    confirmationMessage: '',
    smsEnabled: false,
    questions: []
  });
  
  const [conversationForm, setConversationForm] = useState({
    questions: [],
    objections: [],
    closingScript: '',
    callOutcomes: [],
    longTermNurture: ''
  });
  
  // AI results
  const [aiDiscoveryQuestions, setAiDiscoveryQuestions] = useState([]);
  const [aiConversationFramework, setAiConversationFramework] = useState(null);
  const [aiLongTermNurture, setAiLongTermNurture] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (3 steps total)
  const subSteps = [
    { id: 0, title: 'Discovery Setup', completed: false },
    { id: 1, title: 'Conversation Framework', completed: false },
    { id: 2, title: 'Milestone Reflection', completed: false }
  ];

  // Check completion status
  const hasDiscoverySetup = discoverySetup !== null;
  const hasConversationFramework = conversationFramework !== null;
  const isStepComplete = hasDiscoverySetup && hasConversationFramework;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // Discovery Setup always unlocked
      case 1: return hasDiscoverySetup; // Conversation Framework unlocked when discovery setup exists
      case 2: return hasConversationFramework; // Milestone unlocked when conversation framework exists
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasDiscoverySetup; // Discovery Setup completed when setup exists
      case 1: return hasConversationFramework; // Conversation Framework completed when framework exists
      case 2: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Add discovery question
  const addDiscoveryQuestion = (question) => {
    setDiscoveryForm({
      ...discoveryForm,
      questions: [...discoveryForm.questions, { id: Date.now(), question }]
    });
  };

  // Save discovery setup
  const handleSaveDiscoverySetup = () => {
    if (!discoveryForm.sessionName || !discoveryForm.timeFrame) {
      alert('Please fill in session name and time frame');
      return;
    }

    setDiscoverySetup({
      id: Date.now(),
      sessionName: discoveryForm.sessionName,
      timeFrame: discoveryForm.timeFrame,
      calendarLink: discoveryForm.calendarLink,
      confirmationMessage: discoveryForm.confirmationMessage,
      smsEnabled: discoveryForm.smsEnabled,
      questions: discoveryForm.questions
    });
    
    setDiscoverySetupModalOpen(false);
  };

  // Generate AI Discovery Questions
  const handleAIDiscoveryQuestions = () => {
    setIsAiLoading(true);
    setAiDiscoveryQuestionsModalOpen(true);

    // Simulate AI analysis for discovery questions
    setTimeout(() => {
      const questions = [
        {
          category: 'Current Situation',
          question: 'What\'s your current biggest challenge with [your business area]?',
          purpose: 'Identify pain points and establish need'
        },
        {
          category: 'Current Situation', 
          question: 'How are you currently handling [specific process] in your business?',
          purpose: 'Understand current state and inefficiencies'
        },
        {
          category: 'Impact Assessment',
          question: 'What would it mean for your business if this challenge was completely resolved?',
          purpose: 'Quantify value and create urgency'
        },
        {
          category: 'Impact Assessment',
          question: 'What\'s this problem currently costing you in terms of time, money, or opportunities?',
          purpose: 'Establish cost of inaction'
        },
        {
          category: 'Decision Making',
          question: 'What\'s prevented you from solving this problem until now?',
          purpose: 'Identify obstacles and objections'
        },
        {
          category: 'Decision Making',
          question: 'Who else would be involved in making a decision about this?',
          purpose: 'Identify decision makers and process'
        },
        {
          category: 'Timeline & Budget',
          question: 'What\'s your ideal timeline for getting this resolved?',
          purpose: 'Establish urgency and fit'
        },
        {
          category: 'Timeline & Budget',
          question: 'What kind of investment are you prepared to make to solve this problem?',
          purpose: 'Qualify budget and commitment level'
        },
        {
          category: 'Qualification',
          question: 'How committed are you to making a change, on a scale of 1-10?',
          purpose: 'Assess motivation and likelihood to buy'
        },
        {
          category: 'Next Steps',
          question: 'If I could show you exactly how to solve this, what would your next step be?',
          purpose: 'Test readiness to move forward'
        }
      ];

      setAiDiscoveryQuestions(questions);
      setIsAiLoading(false);
    }, 2000);
  };

  // Add AI discovery question
  const addAIDiscoveryQuestion = (question) => {
    addDiscoveryQuestion(question.question);
  };

  // Generate AI Conversation Framework
  const handleAIConversationFramework = () => {
    setIsAiLoading(true);
    setConversationFrameworkModalOpen(true);

    // Simulate AI conversation framework generation
    setTimeout(() => {
      const framework = {
        questions: [
          'Based on what you\'ve shared, it sounds like [summarize their situation]. Is that accurate?',
          'What would success look like for you in [specific timeframe]?',
          'What\'s the cost of not solving this problem in the next 6 months?',
          'How important is it for you to get this resolved quickly?',
          'What questions do you have about our approach to solving this?'
        ],
        objections: [
          {
            objection: 'I need to think about it',
            response: 'I understand wanting to think it through. What specifically would you like to think about? Is it the investment, the timeline, or something else?'
          },
          {
            objection: 'It\'s too expensive',
            response: 'I hear you on the investment. Let me ask - what\'s it costing you to not solve this problem? Often the cost of inaction is much higher than the cost of action.'
          },
          {
            objection: 'I need to talk to my partner/team',
            response: 'That makes sense. What concerns do you think they might have? Let\'s address those now so you can present this confidently.'
          },
          {
            objection: 'I\'ve tried similar things before',
            response: 'I appreciate you sharing that. What was missing from those previous attempts? Our approach specifically addresses [key differentiator].'
          },
          {
            objection: 'I don\'t have time right now',
            response: 'I understand time is tight. That\'s exactly why this is so important - our system is designed to save you time, not cost you more time.'
          }
        ],
        closingScript: `Based on everything we've discussed, it's clear that [summarize their situation and pain points].

Our [program name] is specifically designed to help business owners like you [achieve desired outcome] without [common obstacle they mentioned].

Here's what I recommend:

**Option 1: [Premium Package]**
- [Key benefit 1]
- [Key benefit 2] 
- [Key benefit 3]
- Investment: $[amount]

**Option 2: [Standard Package]**
- [Key benefit 1]
- [Key benefit 2]
- Investment: $[amount]

Given what you've shared about [their specific situation], I believe [recommended option] would be the best fit because [specific reasoning].

The question isn't whether you need this - we've established that. The question is: are you ready to make the investment in yourself and your business to get this handled once and for all?

What questions do you have?`,
        callOutcomes: [
          'Closed - Signed up for [Program Name]',
          'Follow-up scheduled - Needs to discuss with partner',
          'Follow-up scheduled - Reviewing proposal',
          'Not qualified - Budget not aligned',
          'Not qualified - Not decision maker',
          'Not qualified - No urgency',
          'Lost - Went with competitor',
          'Lost - Decided not to move forward'
        ]
      };

      setAiConversationFramework(framework);
      setIsAiLoading(false);
    }, 3000);
  };

  // Save conversation framework
  const saveConversationFramework = () => {
    if (!aiConversationFramework) {
      alert('Please generate conversation framework first');
      return;
    }

    setConversationFramework({
      id: Date.now(),
      questions: aiConversationFramework.questions,
      objections: aiConversationFramework.objections,
      closingScript: aiConversationFramework.closingScript,
      callOutcomes: aiConversationFramework.callOutcomes,
      longTermNurture: aiLongTermNurture
    });
    
    setConversationFrameworkModalOpen(false);
  };

  // Generate 12-Month Long Term Nurture
  const handleLongTermNurture = () => {
    setIsAiLoading(true);
    setLongTermNurtureModalOpen(true);

    // Simulate AI long-term nurture generation
    setTimeout(() => {
      const nurture = `# 12-MONTH LONG-TERM NURTURE SEQUENCE
## For Prospects Not Ready Now

### EMAIL 1: Month 1 - Thank You & Stay Connected
**Subject:** Thank you for our conversation + staying connected

Hi [First Name],

Thank you for taking the time to speak with me about [their challenge]. I really enjoyed learning about your business and the goals you're working toward.

I know you mentioned that now isn't the right time to move forward with [solution], and I completely understand. Timing is everything in business.

I wanted to let you know that I'll be staying in touch over the coming months with valuable insights, case studies, and strategies that can help you with [their specific challenge] - no strings attached.

My goal is simple: to be a valuable resource for you, whether we work together or not.

Here's something you can implement right away: [Quick tip related to their challenge]

Looking forward to staying connected!

Best,
[Your Name]

---

### EMAIL 2: Month 2 - Case Study
**Subject:** How [Similar Client] overcame [similar challenge]

Hi [First Name],

I wanted to share a quick story that reminded me of our conversation.

[Client Name], a [similar business type], was facing [similar challenge to prospect]. Like you, they were [specific situation].

Here's what happened: [Brief case study with specific results]

The transformation took [timeframe] and the results speak for themselves: [specific outcomes].

What made the difference? [Key insight or strategy]

I thought you might find this interesting given what you shared about [their specific situation].

How are things going with [their challenge] on your end?

Best,
[Your Name]

---

### EMAIL 3: Month 3 - Industry Insight
**Subject:** New trend affecting [their industry]

Hi [First Name],

I've been seeing an interesting trend in [their industry] that I thought you'd want to know about.

[Share relevant industry insight, statistic, or trend]

This is particularly relevant for businesses like yours because [connection to their situation].

Here's what I recommend: [Actionable advice]

How is this trend affecting your business? I'd love to hear your perspective.

Best,
[Your Name]

---

### EMAIL 4: Month 4 - Resource Share
**Subject:** Thought you'd find this useful

Hi [First Name],

I came across [resource/tool/article] and immediately thought of you and our conversation about [their challenge].

[Brief description of resource and why it's valuable]

You can access it here: [Link]

The part that I think will be most relevant for you is [specific section], especially given what you mentioned about [their specific situation].

Let me know what you think!

Best,
[Your Name]

---

### EMAIL 5: Month 5 - Quick Check-in
**Subject:** Quick question about [their challenge]

Hi [First Name],

I was just thinking about our conversation from a few months ago about [their challenge].

How are things progressing with that? Have you been able to make any headway?

I ask because I've been working with several businesses facing similar challenges, and I've learned some new strategies that might be helpful.

If you're still working on this, I'd be happy to share what's been working best.

Either way, I hope business is going well for you!

Best,
[Your Name]

---

### EMAIL 6: Month 6 - Mid-Year Check-in
**Subject:** How's your year going so far?

Hi [First Name],

Can you believe we're already halfway through the year?

I was reflecting on the goals and challenges we discussed back in [month of conversation], and I'm curious - how has your year been unfolding?

Have you been able to make progress on [their specific challenge]? 

I've been working with [number] businesses this year on similar challenges, and I've seen some incredible transformations. The common thread among the most successful ones has been [key insight].

If you're still working on [their challenge] and want to explore some new approaches, I'm here to help.

How can I best support you in the second half of the year?

Best,
[Your Name]

---

### EMAIL 7: Month 7 - Success Story
**Subject:** Amazing results from [similar client]

Hi [First Name],

I had to share this with you because it reminded me so much of what you were dealing with when we spoke.

[Client Name] just achieved [specific result] after implementing [solution/strategy]. What makes this especially relevant is that they started in a very similar position to where you were - [similar challenge/situation].

Here's what they did: [Brief overview of approach]

The results: [Specific outcomes and timeline]

What I found most interesting was [key insight or lesson learned].

I thought you might find this encouraging, especially if you're still working on [their challenge].

How are things going on your end?

Best,
[Your Name]

---

### EMAIL 8: Month 8 - Strategy Tip
**Subject:** One strategy that's working really well right now

Hi [First Name],

I wanted to share a strategy that's been working incredibly well for businesses like yours.

It's called [strategy name] and here's how it works:

[Detailed explanation of strategy]

The reason this is so effective is [explanation of why it works].

I've seen businesses implement this and get [specific type of results] within [timeframe].

Given what you shared about [their situation], this could be particularly effective for you because [specific reason].

Want to give it a try? Here's how to get started:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Let me know how it goes!

Best,
[Your Name]

---

### EMAIL 9: Month 9 - Market Update
**Subject:** What I'm seeing in [their industry] right now

Hi [First Name],

I wanted to give you a quick update on what I'm seeing in [their industry] right now.

**The Challenge:** [Current industry challenge]
**The Opportunity:** [Current industry opportunity]
**What This Means for You:** [Specific implications]

The businesses that are thriving right now are the ones that [key success factor].

Based on what I know about your business, I think you're well-positioned to [specific opportunity] if you [specific action].

What are you seeing in your market? I'd love to hear your perspective.

Best,
[Your Name]

---

### EMAIL 10: Month 10 - Personal Note
**Subject:** Thinking of you

Hi [First Name],

I was just reviewing my notes from our conversation almost a year ago, and I realized how much I enjoyed speaking with you.

Your insights about [something they shared] really stuck with me, and I've actually shared that perspective with other clients (with your permission, of course).

I'm curious - how has your year been? Have you been able to make progress on [their original challenge]?

I know when we spoke, you were [their situation at the time]. I hope things have been moving in a positive direction.

If there's anything I can do to support you as you finish out the year strong, please don't hesitate to reach out.

Best,
[Your Name]

---

### EMAIL 11: Month 11 - Year-End Reflection
**Subject:** As we head into the new year...

Hi [First Name],

As we approach the end of the year, I find myself reflecting on the conversations and connections that have meant the most to me.

Our conversation about [their challenge] was definitely one of those meaningful exchanges. Your perspective on [something they shared] really influenced how I think about [related topic].

As you're planning for next year, I'm curious:
- What were your biggest wins this year?
- What challenges are you hoping to tackle in the new year?
- How can I best support you moving forward?

I've been working on some new approaches to [their area of challenge] that I think you'd find interesting. If you're open to it, I'd love to share what I've learned.

Here's to a strong finish to this year and an even better next year!

Best,
[Your Name]

---

### EMAIL 12: Month 12 - New Year, New Opportunities
**Subject:** Ready for your best year yet?

Hi [First Name],

Happy New Year! 

As we start fresh, I wanted to reach out and see how you're feeling about the year ahead.

It's been almost a year since we first spoke about [their challenge]. A lot can change in a year, and I'm curious where things stand for you now.

Are you still working on [their original challenge]? Has your situation evolved?

I ask because I've developed some new strategies and approaches over the past year that have been incredibly effective for businesses like yours. 

If you're ready to tackle [their challenge] with fresh energy and new tools, I'd love to explore how I can help.

I have a few spots open in my calendar this month for complimentary strategy sessions. These are designed to:
✓ Assess where you are now vs. where you want to be
✓ Identify the biggest opportunities for growth
✓ Create a clear roadmap for achieving your goals

No pressure, no sales pitch - just valuable insights you can use whether we work together or not.

If you're interested, simply reply with "STRATEGY" and I'll send you the calendar link.

Here's to making this your best year yet!

Best,
[Your Name]

---

**SEQUENCE SUMMARY:**
- **Total emails:** 12
- **Timeline:** 12 months
- **Purpose:** Stay top-of-mind with prospects not ready to buy now
- **Key elements:** Value delivery, relationship building, soft re-engagement
- **Conversion goal:** Re-open conversation when timing is better`;

      setAiLongTermNurture(nurture);
      setIsAiLoading(false);
    }, 3000);
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Automate your sales pipeline with discovery sessions, conversation frameworks, and long-term nurturing.",
    steps: [
      {
        title: "Discovery Setup",
        description: "Configure discovery sessions and questions",
        color: "bg-[#0e9246]"
      },
      {
        title: "Conversation Framework", 
        description: "Build objection handling and closing scripts",
        color: "bg-[#d7df21]"
      },
      {
        title: "Milestone",
        description: "Complete your sales automation",
        color: "bg-[#467a8f]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 5 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Sales Pipeline Automation
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Automate your sales process with discovery sessions, conversation frameworks, and nurturing sequences.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Discovery Setup</h3>
                <p className="text-gray-600 mb-6">Configure your discovery session details and questions.</p>
                
                {/* Discovery Session Setup */}
                <div className="mb-8">
                  <button
                    onClick={() => setDiscoverySetupModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Setup Discovery Session</span>
                  </button>
                </div>

                {/* AI Discovery Questions */}
                <div className="mb-8">
                  <button
                    onClick={handleAIDiscoveryQuestions}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Discovery Questions</span>
                  </button>
                </div>

                {/* Discovery Setup Display */}
                {!discoverySetup ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No discovery setup configured yet</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{discoverySetup.sessionName}</h4>
                    <p className="text-sm text-gray-600 mb-2">Duration: {discoverySetup.timeFrame}</p>
                    {discoverySetup.calendarLink && (
                      <p className="text-sm text-gray-600 mb-2">Calendar: {discoverySetup.calendarLink}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">SMS Enabled: {discoverySetup.smsEnabled ? 'Yes' : 'No'}</p>
                    <p className="text-sm text-gray-600">Questions: {discoverySetup.questions.length}</p>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversation Framework</h3>
                <p className="text-gray-600 mb-6">Build your conversation framework with objection handling and closing scripts.</p>
                
                <button
                  onClick={handleAIConversationFramework}
                  className="w-full mb-6 px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Generate Conversation Framework</span>
                </button>

                {aiConversationFramework && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Framework Generated</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• {aiConversationFramework.questions.length} Discovery Questions</p>
                        <p>• {aiConversationFramework.objections.length} Objection Responses</p>
                        <p>• Complete Closing Script</p>
                        <p>• {aiConversationFramework.callOutcomes.length} Call Outcome Options</p>
                      </div>
                      <button
                        onClick={() => setConversationFrameworkModalOpen(true)}
                        className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                      >
                        View Full Framework →
                      </button>
                    </div>

                    {/* Long Term Nurture Section */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">12-Month Long Term Nurture</h4>
                      <p className="text-sm text-gray-600 mb-3">For prospects not ready now</p>
                      <button
                        onClick={handleLongTermNurture}
                        className="w-full px-4 py-2 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Generate 12-Month Nurture</span>
                      </button>
                      
                      {aiLongTermNurture && (
                        <div className="mt-3">
                          <p className="text-sm text-green-600">✅ 12 emails generated</p>
                          <button
                            onClick={() => setLongTermNurtureModalOpen(true)}
                            className="mt-2 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                          >
                            View 12-Month Sequence →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've automated your sales pipeline.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Configured discovery session: "{discoverySetup?.sessionName}"</li>
                      <li>✅ Generated discovery questions and conversation framework</li>
                      <li>✅ Built objection handling and closing scripts</li>
                      <li>✅ Created 12-month long-term nurture sequence</li>
                      <li>✅ Established complete sales automation system</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 6: Build Your Delivery System to create your service delivery framework.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pipeline Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Sales Pipeline Overview</h3>
            
            {/* Discovery Setup Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Discovery Setup</h4>
              {!discoverySetup ? (
                <p className="text-gray-500 text-sm">No discovery setup configured yet</p>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{discoverySetup.sessionName}</span>
                  </div>
                  <p className="text-sm text-blue-700">{discoverySetup.timeFrame} session</p>
                  <p className="text-sm text-blue-700">{discoverySetup.questions.length} questions</p>
                </div>
              )}
            </div>

            {/* Conversation Framework Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Conversation Framework</h4>
              {!conversationFramework ? (
                <p className="text-gray-500 text-sm">No conversation framework generated yet</p>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">Complete Framework</span>
                  </div>
                  <p className="text-sm text-green-700">Questions, objections, closing script</p>
                  <p className="text-sm text-green-700">12-month nurture sequence</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Pipeline Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discovery Setup</span>
                  <span className={`text-sm font-medium ${hasDiscoverySetup ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasDiscoverySetup ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversation Framework</span>
                  <span className={`text-sm font-medium ${hasConversationFramework ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasConversationFramework ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discovery Setup Modal */}
        {discoverySetupModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Discovery Session Setup</h3>
                  <button
                    onClick={() => setDiscoverySetupModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Name *</label>
                  <input
                    type="text"
                    value={discoveryForm.sessionName}
                    onChange={(e) => setDiscoveryForm({...discoveryForm, sessionName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="e.g., Strategy Session, Discovery Call"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Frame *</label>
                  <select
                    value={discoveryForm.timeFrame}
                    onChange={(e) => setDiscoveryForm({...discoveryForm, timeFrame: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select duration</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="60 minutes">60 minutes</option>
                    <option value="90 minutes">90 minutes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Link</label>
                  <input
                    type="url"
                    value={discoveryForm.calendarLink}
                    onChange={(e) => setDiscoveryForm({...discoveryForm, calendarLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="https://calendly.com/your-link"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Message</label>
                  <textarea
                    value={discoveryForm.confirmationMessage}
                    onChange={(e) => setDiscoveryForm({...discoveryForm, confirmationMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="Thank you for booking! I'm looking forward to our conversation..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsEnabled"
                    checked={discoveryForm.smsEnabled}
                    onChange={(e) => setDiscoveryForm({...discoveryForm, smsEnabled: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="smsEnabled" className="text-sm text-gray-700">Enable SMS reminders</label>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setDiscoverySetupModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDiscoverySetup}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Save Setup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Discovery Questions Modal */}
        {aiDiscoveryQuestionsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Discovery Questions</h3>
                  <button
                    onClick={() => setAiDiscoveryQuestionsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated discovery questions to uncover needs and qualify prospects</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating discovery questions...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Recommended Questions ({aiDiscoveryQuestions.length} questions)</h4>
                    {aiDiscoveryQuestions.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-600">{item.category}</span>
                            <h5 className="font-medium text-gray-900 mt-1">{item.question}</h5>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Purpose:</span> {item.purpose}
                          </p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => addAIDiscoveryQuestion(item)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Add Question
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

        {/* Conversation Framework Modal */}
        {conversationFrameworkModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Complete Conversation Framework</h3>
                  <button
                    onClick={() => setConversationFrameworkModalOpen(false)}
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
                    <span className="ml-3 text-gray-600">Generating conversation framework...</span>
                  </div>
                ) : aiConversationFramework && (
                  <div className="space-y-6">
                    {/* Discovery Questions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Discovery Questions</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {aiConversationFramework.questions.map((question, index) => (
                            <li key={index} className="text-sm text-gray-700">• {question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Objection Handling */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Objection Handling</h4>
                      <div className="space-y-3">
                        {aiConversationFramework.objections.map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900 mb-2">"{item.objection}"</p>
                            <p className="text-sm text-gray-700">{item.response}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Closing Script */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Closing Script</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiConversationFramework.closingScript}</pre>
                      </div>
                    </div>

                    {/* Call Outcomes */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Call Outcomes</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="space-y-1">
                          {aiConversationFramework.callOutcomes.map((outcome, index) => (
                            <li key={index} className="text-sm text-gray-700">• {outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      const content = JSON.stringify(aiConversationFramework, null, 2);
                      navigator.clipboard.writeText(content);
                      alert('Conversation framework copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={saveConversationFramework}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Save Framework
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Long Term Nurture Modal */}
        {longTermNurtureModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">12-Month Long Term Nurture Sequence</h3>
                  <button
                    onClick={() => setLongTermNurtureModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">For prospects not ready to buy now</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating 12-month nurture sequence...</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{aiLongTermNurture}</pre>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiLongTermNurture);
                      alert('12-month nurture sequence copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => setLongTermNurtureModalOpen(false)}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Save Sequence
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

export default Step5;

