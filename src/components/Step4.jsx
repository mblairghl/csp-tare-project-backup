import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Plus, Sparkles, X, Magnet, Mail, Globe } from 'lucide-react';

const Step4 = () => {
  // Sub-step management (4 steps total)
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [leadMagnet, setLeadMagnet] = useState(null);
  const [nurtureSequence, setNurtureSequence] = useState('');
  const [funnelPages, setFunnelPages] = useState('');
  
  // Modal states
  const [addLeadMagnetModalOpen, setAddLeadMagnetModalOpen] = useState(false);
  const [aiLeadMagnetModalOpen, setAiLeadMagnetModalOpen] = useState(false);
  const [nurtureSequenceModalOpen, setNurtureSequenceModalOpen] = useState(false);
  const [funnelPagesModalOpen, setFunnelPagesModalOpen] = useState(false);
  
  // Form states
  const [newLeadMagnetForm, setNewLeadMagnetForm] = useState({
    format: '',
    title: '',
    problem: '',
    valueProposition: ''
  });
  
  // AI results
  const [aiLeadMagnetSuggestions, setAiLeadMagnetSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // UI states
  const [isHowThisWorksOpen, setIsHowThisWorksOpen] = useState(false);

  // Sub-steps configuration (4 steps total)
  const subSteps = [
    { id: 0, title: 'Lead Magnet', completed: false },
    { id: 1, title: 'Nurture Sequence', completed: false },
    { id: 2, title: 'Funnel Pages', completed: false },
    { id: 3, title: 'Milestone Reflection', completed: false }
  ];

  // Lead magnet formats (comprehensive list)
  const leadMagnetFormats = [
    'Audio Training', 'Blueprint', 'Calculator', 'Case Study', 'Cheat Sheet',
    'Checklist', 'Comparison Chart', 'Course (Mini)', 'E-book', 'Email Course',
    'Framework', 'Guide', 'Infographic', 'Masterclass', 'PDF Report',
    'Planner', 'Quiz/Assessment', 'Resource List', 'Roadmap', 'Script',
    'Spreadsheet Template', 'Strategy Session', 'Swipe File', 'Template',
    'Toolkit', 'Training Video', 'Webinar', 'White Paper', 'Workbook', 'Workshop'
  ];

  // Check completion status
  const hasLeadMagnet = leadMagnet !== null;
  const hasNurtureSequence = nurtureSequence.length > 0;
  const hasFunnelPages = funnelPages.length > 0;
  const isStepComplete = hasLeadMagnet && hasNurtureSequence && hasFunnelPages;

  // Sub-step unlock logic
  const isSubStepUnlocked = (stepId) => {
    switch (stepId) {
      case 0: return true; // Lead Magnet always unlocked
      case 1: return hasLeadMagnet; // Nurture Sequence unlocked when lead magnet exists
      case 2: return hasNurtureSequence; // Funnel Pages unlocked when nurture sequence exists
      case 3: return hasFunnelPages; // Milestone unlocked when funnel pages exist
      default: return false;
    }
  };

  const isSubStepCompleted = (stepId) => {
    switch (stepId) {
      case 0: return hasLeadMagnet; // Lead Magnet completed when magnet exists
      case 1: return hasNurtureSequence; // Nurture Sequence completed when sequence exists
      case 2: return hasFunnelPages; // Funnel Pages completed when pages exist
      case 3: return isStepComplete; // Milestone completed when everything is done
      default: return false;
    }
  };

  // Add lead magnet
  const handleAddLeadMagnet = () => {
    if (!newLeadMagnetForm.format || !newLeadMagnetForm.title) {
      alert('Please fill in lead magnet format and title');
      return;
    }

    const newLeadMagnet = {
      id: Date.now(),
      format: newLeadMagnetForm.format,
      title: newLeadMagnetForm.title,
      problem: newLeadMagnetForm.problem,
      valueProposition: newLeadMagnetForm.valueProposition
    };

    setLeadMagnet(newLeadMagnet);
    setNewLeadMagnetForm({ format: '', title: '', problem: '', valueProposition: '' });
    setAddLeadMagnetModalOpen(false);
  };

  // AI Lead Magnet Suggestions
  const handleAILeadMagnetSuggestions = () => {
    setIsAiLoading(true);
    setAiLeadMagnetModalOpen(true);

    // Simulate AI analysis for lead magnet ideas
    setTimeout(() => {
      const suggestions = [
        {
          format: 'Checklist',
          title: 'The Ultimate Business Growth Checklist',
          problem: 'Business owners struggle to know what steps to take for consistent growth',
          valueProposition: 'A step-by-step checklist that ensures you never miss critical growth opportunities',
          reasoning: 'Checklists are highly actionable and provide immediate value while positioning you as organized and systematic.'
        },
        {
          format: 'E-book',
          title: '7 Secrets to Scaling Without Burnout',
          problem: 'Entrepreneurs work too many hours and struggle to scale effectively',
          valueProposition: 'Proven strategies to grow your business while working fewer hours',
          reasoning: 'E-books establish authority and allow for comprehensive value delivery in a professional format.'
        },
        {
          format: 'Calculator',
          title: 'ROI Calculator for Business Investments',
          problem: 'Business owners make investment decisions without clear ROI projections',
          valueProposition: 'Calculate the true return on investment for any business decision',
          reasoning: 'Interactive tools provide personalized value and encourage engagement while capturing lead information.'
        },
        {
          format: 'Webinar',
          title: 'The 90-Day Business Transformation Masterclass',
          problem: 'Business owners need a clear roadmap for rapid transformation',
          valueProposition: 'Live training showing exactly how to transform your business in 90 days',
          reasoning: 'Webinars allow for high-value delivery and real-time interaction while building strong relationships.'
        },
        {
          format: 'Template',
          title: 'Proven Sales Script Templates',
          problem: 'Business owners struggle with converting prospects into customers',
          valueProposition: 'Copy-paste scripts that convert prospects into paying customers',
          reasoning: 'Templates provide immediate practical value and demonstrate your expertise in sales conversion.'
        }
      ];

      setAiLeadMagnetSuggestions(suggestions);
      setIsAiLoading(false);
    }, 2000);
  };

  // Add AI suggestion as lead magnet
  const addAILeadMagnetSuggestion = (suggestion) => {
    setLeadMagnet({
      id: Date.now(),
      format: suggestion.format,
      title: suggestion.title,
      problem: suggestion.problem,
      valueProposition: suggestion.valueProposition
    });
    setAiLeadMagnetModalOpen(false);
  };

  // Generate Nurture Sequence
  const handleGenerateNurtureSequence = () => {
    if (!leadMagnet) {
      alert('Please create a lead magnet first');
      return;
    }

    setIsAiLoading(true);
    setNurtureSequenceModalOpen(true);

    // Simulate AI nurture sequence generation
    setTimeout(() => {
      const sequence = `# 5-EMAIL NURTURE SEQUENCE
## Bridging "${leadMagnet.title}" to Your Signature Offer

### EMAIL 1: Welcome & Delivery (Send immediately)
**Subject:** Your ${leadMagnet.format} is ready! Plus, what's next...

Hi [First Name],

Welcome! Your "${leadMagnet.title}" is attached/linked below.

**Quick question:** What's the #1 challenge you're facing with [relevant topic]?

I ask because over the next few days, I'll be sharing some insights that have helped hundreds of business owners just like you overcome this exact challenge.

**Your ${leadMagnet.format}:** [Download Link]

Talk soon,
[Your Name]

P.S. Keep an eye on your inbox - tomorrow I'm sharing the most common mistake I see business owners make (and how to avoid it).

---

### EMAIL 2: Common Mistake (Send Day 2)
**Subject:** The #1 mistake I see business owners make

Hi [First Name],

Yesterday I sent you the "${leadMagnet.title}" - did you get a chance to review it?

Today I want to share something important: the #1 mistake I see business owners make when trying to [achieve desired outcome].

**The mistake?** Trying to do everything themselves.

I get it. You started your business because you're good at what you do. But here's the thing - being good at your craft doesn't automatically make you good at marketing, sales, operations, and everything else required to scale.

**The solution?** Focus on your zone of genius and get help with the rest.

That's exactly what our signature program helps you do. We handle [specific services] so you can focus on what you do best.

Curious how this works? Hit reply and let me know what your biggest challenge is right now.

Best,
[Your Name]

---

### EMAIL 3: Case Study (Send Day 4)
**Subject:** How [Client Name] achieved [specific result]

Hi [First Name],

I want to share a quick story about [Client Name], a [client description] who was struggling with [specific challenge].

**The situation:** [Brief problem description]

**What we did:** [Brief solution description]

**The result:** [Specific outcome/transformation]

The best part? This transformation happened in just [timeframe].

**Why am I sharing this?** Because [Client Name]'s situation might sound familiar to you.

If you're dealing with [similar challenge], you don't have to figure this out alone.

Our [signature program name] has helped [number] business owners achieve similar results.

Want to see if it's a fit for your situation? Simply reply to this email and let me know what's your biggest challenge right now.

Best,
[Your Name]

---

### EMAIL 4: Social Proof & Process (Send Day 6)
**Subject:** Behind the scenes: How we get these results

Hi [First Name],

Over the past few days, I've shared some insights about [topic] and told you about [Client Name]'s success.

Today, I want to pull back the curtain and show you exactly how we help business owners like you achieve these results.

**Our 3-Step Process:**

**Step 1:** [Process step 1 description]
**Step 2:** [Process step 2 description]  
**Step 3:** [Process step 3 description]

**The results speak for themselves:**
• [Statistic 1]
• [Statistic 2]
• [Statistic 3]

But here's what I'm most proud of: [Emotional/personal result]

**Ready to see how this could work for your business?**

I'm opening up a few spots for complimentary strategy sessions where we'll:
✓ Analyze your current situation
✓ Identify your biggest opportunities
✓ Create a custom roadmap for your success

These sessions normally cost $500, but they're complimentary for serious business owners who are ready to take action.

**Interested?** Simply reply with "STRATEGY" and I'll send you the details.

Best,
[Your Name]

---

### EMAIL 5: Final Invitation (Send Day 8)
**Subject:** Last chance: Your complimentary strategy session

Hi [First Name],

This is my final email in this sequence, and I wanted to make sure you didn't miss this opportunity.

Over the past week, I've shared:
• The ${leadMagnet.title}
• The #1 mistake business owners make
• A real client success story
• Our proven 3-step process

**Now it's decision time.**

You have two choices:

**Choice 1:** Continue doing what you're doing and hope things improve on their own.

**Choice 2:** Take action and get the help you need to achieve the results you want.

If you choose option 2, I have a few complimentary strategy sessions available this week.

**On this call, we'll:**
✓ Identify what's really holding your business back
✓ Create a clear roadmap for your next 90 days
✓ Determine if our program is the right fit for you

**No sales pressure. No obligation.** Just valuable insights you can use immediately.

**Ready to take the next step?** Reply with "STRATEGY" and I'll send you the calendar link.

To your success,
[Your Name]

P.S. These sessions are limited and fill up quickly. If you're serious about transforming your business, don't wait.

---

**SEQUENCE SUMMARY:**
- **Total emails:** 5
- **Timeline:** 8 days
- **Purpose:** Bridge from lead magnet to signature offer consultation
- **Key elements:** Value delivery, social proof, process explanation, clear CTA
- **Conversion goal:** Book strategy session/consultation call`;

      setNurtureSequence(sequence);
      setIsAiLoading(false);
    }, 3000);
  };

  // Generate Funnel Pages
  const handleGenerateFunnelPages = () => {
    if (!leadMagnet) {
      alert('Please create a lead magnet first');
      return;
    }

    setIsAiLoading(true);
    setFunnelPagesModalOpen(true);

    // Simulate AI funnel page generation
    setTimeout(() => {
      const pages = `# COMPLETE FUNNEL PAGES COPY

## LANDING PAGE COPY

### Headline
**"Get Your Free ${leadMagnet.title} and Transform Your Business in 90 Days"**

### Hero Section
**Subheadline:** "Join 1,000+ business owners who've used this proven system to [achieve specific result] without [common pain point]"

**Hero Copy:**
Are you tired of [specific frustration]? Ready to [desired outcome] without [common obstacle]?

You're in the right place.

**[Your Name]** has helped hundreds of business owners just like you achieve [specific transformation] using a proven system that works even if you've tried everything else.

### Opening Story
**"How I Discovered the Secret to [Desired Outcome]"**

Three years ago, I was exactly where you are now. [Personal struggle story that relates to target audience].

I tried everything:
• [Common solution 1] - didn't work
• [Common solution 2] - made things worse  
• [Common solution 3] - too complicated

Then I discovered something that changed everything...

[Brief transformation story]

That's when I realized: [Key insight that led to your solution]

### Solution Introduction
**Introducing: ${leadMagnet.title}**

This isn't just another [format type]. It's a complete system that shows you:

✓ [Benefit 1 - specific outcome]
✓ [Benefit 2 - time/effort saving]
✓ [Benefit 3 - risk reduction]
✓ [Benefit 4 - competitive advantage]
✓ [Benefit 5 - long-term impact]

### Detailed Benefits
**What You'll Get Inside:**

**Module 1: [Section Name]**
• [Specific benefit/outcome]
• [Tool/resource included]
• [Time/money saved]

**Module 2: [Section Name]**
• [Specific benefit/outcome]
• [Tool/resource included]
• [Time/money saved]

**Module 3: [Section Name]**
• [Specific benefit/outcome]
• [Tool/resource included]
• [Time/money saved]

**BONUS: [Bonus Name]**
• [Additional value]
• [Why it's valuable]

### Social Proof and Stats
**The Results Speak for Themselves:**

• **500+ business owners** have used this system
• **Average result:** [Specific metric/outcome]
• **Success rate:** 94% of users see results within 30 days
• **Time to implement:** Less than 2 hours per week

### Client Testimonials
**"This system completely changed my business. In just 60 days, I [specific result]. I can't recommend it enough!"**
*- Sarah Johnson, Marketing Consultant*

**"I was skeptical at first, but the results don't lie. [Specific outcome] in [timeframe]. Worth every minute!"**
*- Mike Chen, Business Coach*

**"Finally, a system that actually works! [Specific transformation]. Thank you!"**
*- Lisa Rodriguez, Service Provider*

### Urgency and Scarcity
**⚠️ Limited Time Offer**

This ${leadMagnet.format} is normally part of our $2,000 signature program, but for a limited time, it's yours free.

**Why free?** Because I want to prove the value of our approach before you invest in anything.

**The catch?** This offer expires in 48 hours, and I'm only making it available to the first 100 people who request it.

### Risk Reversal
**100% Satisfaction Guarantee**

Try the strategies in this ${leadMagnet.format} for 30 days. If you don't see measurable improvement in your [specific area], just let me know and I'll personally help you implement it correctly.

**That's how confident I am this will work for you.**

### Call to Action Variations

**Primary CTA:**
"Get Your Free ${leadMagnet.title} Now"

**Secondary CTAs:**
• "Download Your Copy Today"
• "Claim Your Free ${leadMagnet.format}"
• "Get Instant Access"
• "Start Your Transformation"

### FAQ Section
**Q: How long does it take to see results?**
A: Most business owners see initial improvements within 7-14 days of implementation.

**Q: Is this suitable for my industry?**
A: This system works for any service-based business, regardless of industry or experience level.

**Q: What if I don't have time to implement this?**
A: The system is designed for busy business owners. You can implement it in just 30 minutes per day.

**Q: Is there any ongoing cost?**
A: No. This ${leadMagnet.format} is completely free with no hidden costs or obligations.

**Q: How is this different from other solutions?**
A: Unlike generic advice, this system is based on real-world results from 500+ business owners.

---

## THANK YOU PAGE COPY

### Headline
**"Success! Your ${leadMagnet.title} is On Its Way"**

### Thank You Message
**Congratulations!** You've just taken the first step toward [desired transformation].

**What happens next:**

**Step 1:** Check your email in the next 5 minutes for your ${leadMagnet.format}
**Step 2:** Download and review the materials
**Step 3:** Implement the first strategy within 24 hours
**Step 4:** Watch for my follow-up emails with additional insights

### Next Steps
**While you wait, here are 3 quick wins you can implement today:**

1. **[Quick Win 1]** - [Brief description and benefit]
2. **[Quick Win 2]** - [Brief description and benefit]  
3. **[Quick Win 3]** - [Brief description and benefit]

### Social Sharing
**Love what you've learned so far?** Share this with other business owners who could benefit:

[Social sharing buttons]

### Additional Resources
**Want to go deeper?** Check out these additional resources:

• [Resource 1] - [Brief description]
• [Resource 2] - [Brief description]
• [Resource 3] - [Brief description]

### Contact Information
**Questions?** Reply to any of my emails or reach out at [contact information].

**Follow me for daily insights:**
• LinkedIn: [Profile link]
• Twitter: [Profile link]
• Facebook: [Profile link]

---

*Generated based on your lead magnet: "${leadMagnet.title}" (${leadMagnet.format})*`;

      setFunnelPages(pages);
      setIsAiLoading(false);
    }, 3000);
  };

  // How This Works content
  const howThisWorksContent = {
    description: "Build your signature funnel with lead magnet, nurture sequence, and high-converting pages.",
    steps: [
      {
        title: "Lead Magnet",
        description: "Create or select your lead magnet offer",
        color: "bg-[#0e9246]"
      },
      {
        title: "Nurture Sequence", 
        description: "Generate 5-email sequence to your offer",
        color: "bg-[#d7df21]"
      },
      {
        title: "Funnel Pages",
        description: "Create landing and thank you page copy",
        color: "bg-[#fbae42]"
      },
      {
        title: "Milestone",
        description: "Complete your signature funnel",
        color: "bg-[#467a8f]"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">STEP 4 OF 9</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Signature Funnel Build
          </h1>
          <p className="text-base lg:text-lg text-gray-600">
            Create your lead magnet, nurture sequence, and high-converting funnel pages.
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lead Magnet Creation</h3>
                <p className="text-gray-600 mb-6">Create your signature lead magnet to attract ideal prospects.</p>
                
                {/* Section 1: Add Lead Magnet */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0e9246] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Create Lead Magnet</h4>
                  </div>
                  <button
                    onClick={() => setAddLeadMagnetModalOpen(true)}
                    className="w-full px-6 py-3 bg-[#0e9246] text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Lead Magnet</span>
                  </button>
                </div>

                {/* Section 2: AI Lead Magnet Ideas */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#d7df21] rounded-full flex items-center justify-center mr-3">
                      <span className="text-black text-sm font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Need Lead Magnet Ideas?</h4>
                  </div>
                  <button
                    onClick={handleAILeadMagnetSuggestions}
                    className="w-full px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Get AI Lead Magnet Ideas</span>
                  </button>
                </div>

                {/* Lead Magnet Display */}
                {!leadMagnet ? (
                  <div className="text-center py-12 text-gray-500">
                    <Magnet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No lead magnet created yet</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{leadMagnet.title}</h4>
                        <p className="text-sm text-gray-600">{leadMagnet.format}</p>
                        {leadMagnet.problem && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Problem:</span> {leadMagnet.problem}
                          </p>
                        )}
                        {leadMagnet.valueProposition && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Value:</span> {leadMagnet.valueProposition}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 1 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nurture Sequence</h3>
                <p className="text-gray-600 mb-6">Generate a personalized 5-email nurture sequence that bridges your lead magnet to your signature offer.</p>
                
                <button
                  onClick={handleGenerateNurtureSequence}
                  className="w-full mb-6 px-6 py-3 bg-[#d7df21] text-black rounded-lg hover:bg-[#c5cd1e] flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Generate Nurture Sequence</span>
                </button>

                {nurtureSequence && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">5-Email Nurture Sequence</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line max-h-96 overflow-y-auto">
                      {nurtureSequence.substring(0, 500)}...
                    </div>
                    <button
                      onClick={() => setNurtureSequenceModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Sequence →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 2 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Funnel Pages</h3>
                <p className="text-gray-600 mb-6">Generate high-converting landing page and thank you page copy.</p>
                
                <button
                  onClick={handleGenerateFunnelPages}
                  className="w-full mb-6 px-6 py-3 bg-[#fbae42] text-white rounded-lg hover:bg-[#e09d3a] flex items-center justify-center space-x-2"
                >
                  <Globe className="w-5 h-5" />
                  <span>Generate Funnel Pages</span>
                </button>

                {funnelPages && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Complete Funnel Pages Copy</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-line max-h-96 overflow-y-auto">
                      {funnelPages.substring(0, 500)}...
                    </div>
                    <button
                      onClick={() => setFunnelPagesModalOpen(true)}
                      className="mt-3 text-[#0e9246] hover:text-green-700 text-sm font-medium"
                    >
                      View Full Pages Copy →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSubStep === 3 && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">🎉 Milestone Reflection</h3>
                <p className="text-gray-600 mb-6">Congratulations! You've built your complete signature funnel.</p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">What You've Accomplished:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Created your signature lead magnet: "{leadMagnet?.title}"</li>
                      <li>✅ Generated 5-email nurture sequence</li>
                      <li>✅ Built complete funnel pages copy</li>
                      <li>✅ Established your lead generation system</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <p className="text-sm text-blue-800">
                      Move on to Step 5: Sales Pipeline Automation to automate your conversion process.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Funnel Overview */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Signature Funnel Overview</h3>
            
            {/* Lead Magnet Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Lead Magnet</h4>
              {!leadMagnet ? (
                <p className="text-gray-500 text-sm">No lead magnet created yet</p>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Magnet className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">{leadMagnet.title}</span>
                  </div>
                  <p className="text-sm text-blue-700">{leadMagnet.format}</p>
                </div>
              )}
            </div>

            {/* Nurture Sequence Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Nurture Sequence</h4>
              {!nurtureSequence ? (
                <p className="text-gray-500 text-sm">No nurture sequence generated yet</p>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-900">5-Email Sequence</span>
                  </div>
                  <p className="text-sm text-green-700">Bridges lead magnet to signature offer</p>
                </div>
              )}
            </div>

            {/* Funnel Pages Summary */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Funnel Pages</h4>
              {!funnelPages ? (
                <p className="text-gray-500 text-sm">No funnel pages generated yet</p>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Globe className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="font-medium text-orange-900">Complete Page Copy</span>
                  </div>
                  <p className="text-sm text-orange-700">Landing page + Thank you page</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Funnel Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lead Magnet</span>
                  <span className={`text-sm font-medium ${hasLeadMagnet ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasLeadMagnet ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nurture Sequence</span>
                  <span className={`text-sm font-medium ${hasNurtureSequence ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasNurtureSequence ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Funnel Pages</span>
                  <span className={`text-sm font-medium ${hasFunnelPages ? 'text-green-600' : 'text-gray-400'}`}>
                    {hasFunnelPages ? '✅ Complete' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Lead Magnet Modal */}
        {addLeadMagnetModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Create Lead Magnet</h3>
                  <button
                    onClick={() => setAddLeadMagnetModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Magnet Format *</label>
                  <select
                    value={newLeadMagnetForm.format}
                    onChange={(e) => setNewLeadMagnetForm({...newLeadMagnetForm, format: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                  >
                    <option value="">Select format</option>
                    {leadMagnetFormats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Magnet Title *</label>
                  <input
                    type="text"
                    value={newLeadMagnetForm.title}
                    onChange={(e) => setNewLeadMagnetForm({...newLeadMagnetForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    placeholder="Enter lead magnet title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Problem It Solves</label>
                  <textarea
                    value={newLeadMagnetForm.problem}
                    onChange={(e) => setNewLeadMagnetForm({...newLeadMagnetForm, problem: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="What specific problem does this solve?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value Proposition</label>
                  <textarea
                    value={newLeadMagnetForm.valueProposition}
                    onChange={(e) => setNewLeadMagnetForm({...newLeadMagnetForm, valueProposition: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
                    rows="3"
                    placeholder="What value does this provide?"
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setAddLeadMagnetModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLeadMagnet}
                  className="flex-1 px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                >
                  Create Lead Magnet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Lead Magnet Suggestions Modal */}
        {aiLeadMagnetModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">AI Lead Magnet Ideas</h3>
                  <button
                    onClick={() => setAiLeadMagnetModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">AI-generated lead magnet ideas based on your business</p>
              </div>
              
              <div className="p-6">
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e9246]"></div>
                    <span className="ml-3 text-gray-600">Generating lead magnet ideas...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Recommended Lead Magnets ({aiLeadMagnetSuggestions.length} ideas)</h4>
                    {aiLeadMagnetSuggestions.map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                            <p className="text-sm text-gray-600">{suggestion.format}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Problem it solves:</span>
                            <p className="text-sm text-gray-600">{suggestion.problem}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Value proposition:</span>
                            <p className="text-sm text-gray-600">{suggestion.valueProposition}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Why this works:</span> {suggestion.reasoning}
                          </p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => addAILeadMagnetSuggestion(suggestion)}
                            className="px-3 py-1 bg-[#0e9246] text-white text-sm rounded hover:bg-green-700"
                          >
                            Use This Lead Magnet
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

        {/* Nurture Sequence Modal */}
        {nurtureSequenceModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">5-Email Nurture Sequence</h3>
                  <button
                    onClick={() => setNurtureSequenceModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{nurtureSequence}</pre>
                </div>
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(nurtureSequence);
                      alert('Nurture sequence copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => setNurtureSequenceModalOpen(false)}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Save Sequence
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Funnel Pages Modal */}
        {funnelPagesModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Complete Funnel Pages Copy</h3>
                  <button
                    onClick={() => setFunnelPagesModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{funnelPages}</pre>
                </div>
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(funnelPages);
                      alert('Funnel pages copy copied to clipboard!');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => setFunnelPagesModalOpen(false)}
                    className="px-4 py-2 bg-[#0e9246] text-white rounded-md hover:bg-green-700"
                  >
                    Save Pages Copy
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

export default Step4;

