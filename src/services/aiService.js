class AIService {
  constructor() {
    // Mock service - no API calls needed
  }

  setApiKey(apiKey) {
    // Mock function - no actual API key storage needed
  }

  getApiKey() {
    return 'mock-key';
  }

  hasApiKey() {
    return true; // Always return true to bypass API key checks
  }

  async generatePersonas(businessInfo) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return [
      {
        id: `persona_${Date.now()}_1`,
        name: "Sarah the Scaling Entrepreneur",
        summary: "Ambitious business owner ready to systematize and scale her growing company",
        demographics: {
          age_range: "35-45",
          occupation: "Business Owner/Entrepreneur",
          income_level: "$100K-$500K annually",
          location: "Urban/Suburban areas"
        },
        pain_points: [
          "Feeling overwhelmed by daily operations",
          "Struggling to delegate effectively",
          "Revenue plateauing despite hard work"
        ],
        goals: [
          "Scale business to 7-figures",
          "Build systems for passive income",
          "Establish market authority"
        ],
        problem_that_bothers_most: "Working IN the business instead of ON the business",
        primary_goal_to_achieve: "Build a scalable, systematic business that runs without constant oversight",
        benefits_they_crave: [
          "Time freedom and flexibility",
          "Predictable revenue growth",
          "Industry recognition and authority"
        ],
        current_status_quo_solution: "Manual processes and personal involvement in everything",
        triggering_event: "Realizing they can't scale without systems",
        platforms_active_on: ["LinkedIn", "Facebook Groups", "Industry Forums"],
        tools_currently_used: ["Basic CRM", "Email marketing", "Accounting software"],
        influencers_they_follow: ["Business coaches", "Industry thought leaders"],
        communication_style: "Direct, results-focused, values efficiency"
      },
      {
        id: `persona_${Date.now()}_2`,
        name: "Marcus the Revenue Optimizer",
        summary: "Established business owner looking to optimize and systematize revenue generation",
        demographics: {
          age_range: "40-55",
          occupation: "CEO/Founder",
          income_level: "$250K-$1M annually",
          location: "Major metropolitan areas"
        },
        pain_points: [
          "Inconsistent revenue streams",
          "Too dependent on personal sales efforts",
          "Lack of predictable growth systems"
        ],
        goals: [
          "Create predictable revenue systems",
          "Reduce personal involvement in sales",
          "Build a sellable business asset"
        ],
        problem_that_bothers_most: "Revenue depends too heavily on personal effort and relationships",
        primary_goal_to_achieve: "Build systematic, scalable revenue generation that works without constant personal involvement",
        benefits_they_crave: [
          "Predictable monthly revenue",
          "Business that runs without them",
          "Higher business valuation"
        ],
        current_status_quo_solution: "Personal networking and relationship-based sales",
        triggering_event: "Realizing the business can't grow beyond their personal capacity",
        platforms_active_on: ["LinkedIn", "Industry conferences", "Mastermind groups"],
        tools_currently_used: ["Advanced CRM", "Marketing automation", "Analytics tools"],
        influencers_they_follow: ["Revenue strategists", "Business exit experts"],
        communication_style: "Strategic, data-driven, focused on ROI"
      },
      {
        id: `persona_${Date.now()}_3`,
        name: "Jennifer the Authority Builder",
        summary: "Expert consultant wanting to establish thought leadership and premium positioning",
        demographics: {
          age_range: "30-50",
          occupation: "Consultant/Coach",
          income_level: "$75K-$300K annually",
          location: "Diverse geographic locations"
        },
        pain_points: [
          "Competing on price instead of value",
          "Difficulty standing out in crowded market",
          "Inconsistent client acquisition"
        ],
        goals: [
          "Establish thought leadership position",
          "Command premium pricing",
          "Build a recognized personal brand"
        ],
        problem_that_bothers_most: "Being seen as just another service provider instead of a trusted authority",
        primary_goal_to_achieve: "Become the go-to expert in their niche with premium pricing power",
        benefits_they_crave: [
          "Industry recognition and respect",
          "Premium pricing without pushback",
          "Inbound leads from reputation"
        ],
        current_status_quo_solution: "Traditional marketing and networking",
        triggering_event: "Losing a deal to a less qualified but better-positioned competitor",
        platforms_active_on: ["LinkedIn", "Industry publications", "Speaking events"],
        tools_currently_used: ["Content management", "Social media tools", "Email marketing"],
        influencers_they_follow: ["Thought leaders", "Personal branding experts"],
        communication_style: "Professional, educational, relationship-focused"
      }
    ];
  }

  async generateContentSuggestions(businessInfo) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get existing content from localStorage
    const existingContent = JSON.parse(localStorage.getItem('contentAssets') || '[]');
    
    if (existingContent.length === 0) {
      return {
        message: "No content found to analyze. Please add some content first.",
        contentAnalysis: [],
        totalItems: 0
      };
    }

    // Mock analysis of existing content
    const contentAnalysis = existingContent.map((content, index) => {
      const stages = [
        'discover-possibility',
        'resonate-mission', 
        'envision-transformation',
        'trust-process',
        'step-into-authority'
      ];
      
      const stageNames = [
        'Discover the Possibility',
        'Resonate with the Mission',
        'Envision Their Transformation', 
        'Trust the Process',
        'Step Into Authority'
      ];

      // Assign content to stages based on content type and title
      let suggestedStage = stages[index % stages.length];
      let stageName = stageNames[index % stageNames.length];
      
      // More intelligent stage assignment based on content
      if (content.title.toLowerCase().includes('sign') || content.title.toLowerCase().includes('problem')) {
        suggestedStage = 'discover-possibility';
        stageName = 'Discover the Possibility';
      } else if (content.title.toLowerCase().includes('solution') || content.title.toLowerCase().includes('method')) {
        suggestedStage = 'resonate-mission';
        stageName = 'Resonate with the Mission';
      } else if (content.title.toLowerCase().includes('result') || content.title.toLowerCase().includes('success')) {
        suggestedStage = 'envision-transformation';
        stageName = 'Envision Their Transformation';
      } else if (content.title.toLowerCase().includes('process') || content.title.toLowerCase().includes('system')) {
        suggestedStage = 'trust-process';
        stageName = 'Trust the Process';
      } else if (content.title.toLowerCase().includes('start') || content.title.toLowerCase().includes('action')) {
        suggestedStage = 'step-into-authority';
        stageName = 'Step Into Authority';
      }

      return {
        contentId: content.id,
        contentTitle: content.title,
        contentType: content.type,
        suggestedStage: suggestedStage,
        stageName: stageName,
        reasoning: `This ${content.type.toLowerCase()} appears to be focused on helping prospects ${stageName.toLowerCase()}.`,
        confidence: 'High'
      };
    });

    return {
      message: `Analyzed ${existingContent.length} content item(s) and provided placement suggestions.`,
      contentAnalysis: contentAnalysis,
      totalItems: existingContent.length
    };
  }

  async generateGapAnalysis(businessInfo) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get existing funnel stage content
    const funnelStages = JSON.parse(localStorage.getItem('funnelStages') || '{}');
    
    const stageInfo = {
      'discover-possibility': { name: 'Discover the Possibility', target: 2 },
      'resonate-mission': { name: 'Resonate with the Mission', target: 2 },
      'envision-transformation': { name: 'Envision Their Transformation', target: 2 },
      'trust-process': { name: 'Trust the Process', target: 2 },
      'step-into-authority': { name: 'Step Into Authority', target: 2 }
    };

    const gaps = [];
    const suggestions = [];

    Object.keys(stageInfo).forEach((stageKey, index) => {
      const stageContent = funnelStages[stageKey] || [];
      const stageData = stageInfo[stageKey];
      
      if (stageContent.length < stageData.target) {
        const needed = stageData.target - stageContent.length;
        gaps.push({
          stage: stageKey,
          stageName: stageData.name,
          currentCount: stageContent.length,
          targetCount: stageData.target,
          needed: needed
        });

        // Generate suggestions for this gap
        const stageSuggestions = this.generateStageSuggestions(stageKey, stageData.name, needed);
        suggestions.push(...stageSuggestions);
      }
    });

    if (gaps.length === 0) {
      return {
        message: "Great job! All funnel stages have sufficient content (2+ items each).",
        gaps: [],
        suggestions: [],
        overallStatus: "Complete"
      };
    }

    return {
      message: `Found ${gaps.length} stage(s) that need more content. Here are targeted suggestions:`,
      gaps: gaps,
      suggestions: suggestions,
      overallStatus: "Needs Content"
    };
  }

  generateStageSuggestions(stageKey, stageName, needed) {
    const suggestionTemplates = {
      'discover-possibility': [
        { type: 'Blog Post', title: '5 Signs Your Business Has Hit a Growth Ceiling', description: 'Help prospects recognize when they need systematic solutions.' },
        { type: 'Video', title: 'The Hidden Costs of Manual Business Processes', description: 'Eye-opening content about inefficiencies they might not see.' },
        { type: 'Infographic', title: 'Business Growth Bottlenecks Checklist', description: 'Visual guide to identifying growth limitations.' },
        { type: 'Podcast', title: 'Why Smart Entrepreneurs Are Stuck in Survival Mode', description: 'Interview-style content exploring common challenges.' }
      ],
      'resonate-mission': [
        { type: 'Article', title: 'The Authority Revenue Method: Our Proven Framework', description: 'Introduce your systematic approach to business growth.' },
        { type: 'Video', title: 'Why Most Business Advice Fails (And What Works Instead)', description: 'Position your unique methodology against common approaches.' },
        { type: 'Case Study', title: 'How We Helped [Client] Build Systematic Revenue', description: 'Real example of your methodology in action.' },
        { type: 'Webinar', title: 'The 3 Pillars of Scalable Business Systems', description: 'Educational content that showcases your expertise.' }
      ],
      'envision-transformation': [
        { type: 'Case Study', title: 'From Chaos to $1M: A Complete Business Transformation', description: 'Detailed success story showing the end result.' },
        { type: 'Video', title: 'A Day in the Life: Business Owner with Systematic Revenue', description: 'Show what life looks like after transformation.' },
        { type: 'Testimonial', title: 'Client Success Stories: Real Results from Real People', description: 'Multiple short testimonials showing various outcomes.' },
        { type: 'ROI Calculator', title: 'Calculate Your Revenue Potential with Systems', description: 'Interactive tool showing potential transformation.' }
      ],
      'trust-process': [
        { type: 'Behind-the-Scenes', title: 'Inside Our Client Onboarding Process', description: 'Show the professional systems and support they\'ll receive.' },
        { type: 'FAQ', title: 'Common Questions About Working with Us', description: 'Address concerns and build confidence in your process.' },
        { type: 'Credentials', title: 'Our Track Record: Results and Recognition', description: 'Showcase experience, certifications, and client outcomes.' },
        { type: 'Process Guide', title: 'What to Expect: Your Journey to Systematic Revenue', description: 'Step-by-step overview of the client experience.' }
      ],
      'step-into-authority': [
        { type: 'Sales Page', title: 'Ready to Build Your Revenue System? Start Here', description: 'Clear call-to-action for prospects ready to invest.' },
        { type: 'Application', title: 'Apply for Strategic Business Growth Consultation', description: 'Qualification process for serious prospects.' },
        { type: 'Urgency Content', title: 'Limited Spots: Why Timing Matters for Growth', description: 'Create appropriate urgency for decision-making.' },
        { type: 'Guarantee', title: 'Our Results Promise: What We Guarantee', description: 'Risk-reversal content to overcome final objections.' }
      ]
    };

    const templates = suggestionTemplates[stageKey] || [];
    return templates.slice(0, needed + 1).map((template, index) => ({
      id: `suggestion_${stageKey}_${Date.now()}_${index}`,
      stage: stageKey,
      stageName: stageName,
      type: template.type,
      title: template.title,
      description: template.description,
      priority: index === 0 ? 'High' : 'Medium'
    }));
  }
}

const aiService = new AIService();
export default aiService;

