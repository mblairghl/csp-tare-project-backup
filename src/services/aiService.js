// AI Service with Mock Responses (No API Key Required)
class AIService {
  constructor() {
    // No API key needed - using mock responses
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
        current_status_quo_solution: "DIY approach with scattered tools and manual processes",
        triggering_event: "Revenue plateau or major operational breakdown",
        platforms_active_on: ["LinkedIn", "Instagram", "Industry Forums"],
        tools_currently_used: ["Basic CRM", "Email marketing", "Accounting software"],
        influencers_they_follow: ["Business coaches", "Industry thought leaders"],
        communication_style: "Direct, results-focused, values efficiency"
      },
      {
        id: `persona_${Date.now()}_2`,
        name: "Mike the Methodical Manager",
        summary: "Detail-oriented professional seeking structured growth frameworks",
        demographics: {
          age_range: "40-55",
          occupation: "Senior Manager/Director",
          income_level: "$75K-$200K annually",
          location: "Metropolitan areas"
        },
        pain_points: [
          "Lack of clear growth strategy",
          "Inconsistent team performance",
          "Difficulty measuring ROI"
        ],
        goals: [
          "Implement proven systems",
          "Achieve consistent results",
          "Advance to executive level"
        ],
        problem_that_bothers_most: "Uncertainty about which strategies actually work",
        primary_goal_to_achieve: "Implement systematic approaches that deliver predictable results",
        benefits_they_crave: [
          "Clear frameworks and processes",
          "Measurable outcomes",
          "Professional advancement"
        ],
        current_status_quo_solution: "Trial and error with various business books and courses",
        triggering_event: "Performance review or new role requirements",
        platforms_active_on: ["LinkedIn", "Professional associations", "Webinars"],
        tools_currently_used: ["Project management tools", "Analytics platforms", "Team collaboration software"],
        influencers_they_follow: ["Management consultants", "Business strategists"],
        communication_style: "Analytical, data-driven, prefers detailed explanations"
      },
      {
        id: `persona_${Date.now()}_3`,
        name: "Lisa the Learning Leader",
        summary: "Growth-minded professional committed to continuous improvement",
        demographics: {
          age_range: "30-40",
          occupation: "Team Lead/Small Business Owner",
          income_level: "$50K-$150K annually",
          location: "Diverse geographic areas"
        },
        pain_points: [
          "Information overload from too many sources",
          "Difficulty implementing what she learns",
          "Limited budget for premium solutions"
        ],
        goals: [
          "Build sustainable business practices",
          "Develop leadership skills",
          "Create multiple income streams"
        ],
        problem_that_bothers_most: "Knowing what to do but struggling with consistent execution",
        primary_goal_to_achieve: "Transform knowledge into actionable, profitable systems",
        benefits_they_crave: [
          "Step-by-step implementation guides",
          "Community support and accountability",
          "Affordable, comprehensive solutions"
        ],
        current_status_quo_solution: "Free content, online courses, and networking groups",
        triggering_event: "Career transition or business growth opportunity",
        platforms_active_on: ["Facebook groups", "YouTube", "Podcasts"],
        tools_currently_used: ["Free/basic versions of business tools", "Social media", "Online learning platforms"],
        influencers_they_follow: ["Online educators", "Success coaches"],
        communication_style: "Enthusiastic, collaborative, values community input"
      }
    ];
  }

  async generateContentSuggestions(businessInfo) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get existing content from localStorage
    const existingContent = JSON.parse(localStorage.getItem('contentAssets') || '[]');
    
    console.log('DEBUG - AI Service - Content found:', existingContent);
    console.log('DEBUG - AI Service - Content length:', existingContent.length);
    
    if (existingContent.length === 0) {
      return {
        message: "No content found to analyze. Please add some content first using the 'Add New Content Asset' button."
      };
    }
    
    // Analyze each piece of content and suggest funnel stage placement
    const suggestions = existingContent.map((content, index) => {
      console.log('DEBUG - Analyzing content:', content);
      
      // Simple AI logic to suggest funnel stage based on content type and title
      let suggestedStage = 'discover-possibility'; // default
      let reasoning = '';
      
      const title = (content.name || content.title || '').toLowerCase();
      const description = content.description?.toLowerCase() || '';
      const type = content.type?.toLowerCase() || '';
      
      console.log('DEBUG - Title:', title, 'Type:', type);
      
      // AI logic for stage placement
      if (title.includes('sign') || title.includes('problem') || title.includes('struggle') || 
          title.includes('challenge') || title.includes('mistake') || title.includes('why') ||
          type.includes('blog') || type.includes('article')) {
        suggestedStage = 'discover-possibility';
        reasoning = 'This content helps prospects recognize problems and discover new possibilities.';
      } else if (title.includes('story') || title.includes('mission') || title.includes('believe') || 
                 title.includes('philosophy') || title.includes('about') || title.includes('journey')) {
        suggestedStage = 'resonate-mission';
        reasoning = 'This content builds emotional connection and shares your mission/story.';
      } else if (title.includes('result') || title.includes('success') || title.includes('case study') || 
                 title.includes('transformation') || title.includes('before') || title.includes('after') ||
                 type.includes('case study') || type.includes('testimonial')) {
        suggestedStage = 'envision-transformation';
        reasoning = 'This content shows prospects the results and transformation possible.';
      } else if (title.includes('how') || title.includes('method') || title.includes('process') || 
                 title.includes('system') || title.includes('framework') || title.includes('guide') ||
                 type.includes('guide') || type.includes('webinar')) {
        suggestedStage = 'trust-process';
        reasoning = 'This content demonstrates your methodology and builds trust in your process.';
      } else if (title.includes('ready') || title.includes('start') || title.includes('book') || 
                 title.includes('call') || title.includes('consultation') || title.includes('apply') ||
                 type.includes('landing page') || type.includes('sales page')) {
        suggestedStage = 'step-into-authority';
        reasoning = 'This content encourages prospects to take action and engage with you.';
      }
      
      const result = {
        id: content.id,
        title: content.name || content.title,
        description: content.description || 'No description provided',
        type: content.type,
        suggestedStage,
        reasoning,
        confidence: 'High' // Could be High, Medium, Low based on matching criteria
      };
      
      console.log('DEBUG - Analysis result:', result);
      return result;
    });
    
    const finalResult = {
      contentAnalysis: suggestions,
      totalItems: existingContent.length,
      message: `Analyzed ${existingContent.length} content item(s) and provided placement suggestions.`
    };
    
    console.log('DEBUG - Final AI result:', finalResult);
    return finalResult;
  }

  async generateGapSuggestions(businessInfo) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const gapStages = businessInfo.gaps || [];
    const suggestions = {};
    
    const allSuggestions = {
      "discover-possibility": [
        {
          title: "The Business Growth Reality Check Quiz",
          description: "Interactive assessment helping prospects identify their current growth stage and biggest obstacles.",
          type: "Interactive Quiz"
        },
        {
          title: "3 Myths About Business Scaling That Keep You Stuck",
          description: "Myth-busting article that challenges common misconceptions about business growth.",
          type: "Article"
        },
        {
          title: "Is Your Business Ready for Systematic Growth?",
          description: "Checklist-style content helping prospects evaluate their readiness for transformation.",
          type: "Checklist"
        },
        {
          title: "The Entrepreneur's Dilemma: Growth vs. Control",
          description: "Thought-provoking piece about the challenges of scaling while maintaining quality.",
          type: "Blog Post"
        }
      ],
      "resonate-mission": [
        {
          title: "Why We're Obsessed with Business Systems",
          description: "Behind-the-scenes look at the passion and purpose driving our systematic approach.",
          type: "Behind the Scenes"
        },
        {
          title: "The Authority Revenue Philosophy",
          description: "Core principles and beliefs that guide our approach to business transformation.",
          type: "Manifesto"
        },
        {
          title: "Our Promise: No More Business Guesswork",
          description: "Clear statement of commitment to providing systematic, proven business solutions.",
          type: "Value Proposition"
        },
        {
          title: "From Overwhelmed to Organized: Our Story",
          description: "Founder's journey from business chaos to systematic success.",
          type: "Origin Story"
        }
      ],
      "envision-transformation": [
        {
          title: "ROI Calculator: Your Potential Business Growth",
          description: "Interactive tool showing prospects their potential return on investment with systematic approaches.",
          type: "ROI Calculator"
        },
        {
          title: "Success Timeline: What to Expect in Your First Year",
          description: "Month-by-month breakdown of typical transformation milestones and achievements.",
          type: "Timeline"
        },
        {
          title: "The Authority Revenue Transformation Gallery",
          description: "Visual showcase of client transformations with specific metrics and outcomes.",
          type: "Success Gallery"
        },
        {
          title: "Your Business in 12 Months: A Visualization Exercise",
          description: "Guided visualization helping prospects imagine their transformed business reality.",
          type: "Guided Exercise"
        }
      ],
      "trust-process": [
        {
          title: "The Authority Revenue Methodology Explained",
          description: "Comprehensive breakdown of our proven 9-step framework with supporting research.",
          type: "Methodology Guide"
        },
        {
          title: "Credentials & Certifications: Why Trust Our System",
          description: "Detailed overview of qualifications, experience, and third-party validations.",
          type: "Credentials Page"
        },
        {
          title: "Risk Reversal: Our Guarantee to You",
          description: "Clear explanation of guarantees, support, and risk mitigation for new clients.",
          type: "Guarantee"
        },
        {
          title: "FAQ: Everything You Need to Know",
          description: "Comprehensive answers to common questions about the system and implementation.",
          type: "FAQ"
        }
      ],
      "step-into-authority": [
        {
          title: "Start Your Authority Revenue Journey Today",
          description: "Primary call-to-action page with clear next steps and immediate value.",
          type: "CTA Page"
        },
        {
          title: "Limited Time: Authority Revenue Toolkit Bonus",
          description: "Urgency-driven offer page with additional incentives for immediate action.",
          type: "Offer Page"
        },
        {
          title: "Schedule Your Free Strategy Session",
          description: "No-pressure consultation booking page with clear value and next steps.",
          type: "Booking Page"
        },
        {
          title: "Join the Authority Revenue Community",
          description: "Community-focused entry point for prospects who prefer group learning environments.",
          type: "Community Page"
        }
      ]
    };
    
    // Only return suggestions for gap stages
    gapStages.forEach(stage => {
      if (allSuggestions[stage]) {
        suggestions[stage] = allSuggestions[stage];
      }
    });
    
    return suggestions;
  }

  async generatePersonas(businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Create 3 detailed customer personas for: ${businessInfo.business || 'Business coaching and consulting services'}

Generate personas as a JSON array with this structure:
{
  "name": "Persona Name",
  "summary": "Brief summary",
  "demographics": {
    "age_range": "Age range",
    "occupation": "Occupation",
    "income_level": "Income level",
    "location": "Location"
  },
  "pain_points": ["3 specific pain points"],
  "goals": ["3 primary goals"],
  "problem_that_bothers_most": "Biggest problem",
  "primary_goal_to_achieve": "Top goal",
  "benefits_they_crave": ["3 benefits they want"],
  "current_status_quo_solution": "Current solution",
  "triggering_event": "What makes them buy",
  "platforms_active_on": ["3 platforms"],
  "tools_currently_used": ["3 tools"],
  "influencers_they_follow": ["2 influencer types"],
  "communication_style": "Communication preference"
}

Focus on entrepreneurs and business owners seeking growth. Make personas realistic and actionable.

Return ONLY valid JSON array, no extra text.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a business strategist. Return only valid JSON arrays.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Parse the JSON response
      let personas;
      try {
        personas = JSON.parse(content);
      } catch (parseError) {
        // If JSON parsing fails, try to extract JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          personas = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from API');
        }
      }

      // Ensure we have an array of personas
      if (!Array.isArray(personas)) {
        throw new Error('API did not return an array of personas');
      }

      // Add unique IDs to each persona and ensure all required fields exist
      return personas.map((persona, index) => ({
        id: `persona_${Date.now()}_${index}`,
        name: persona.name || `Persona ${index + 1}`,
        summary: persona.summary || '',
        demographics: persona.demographics || {},
        pain_points: persona.pain_points || [],
        goals: persona.goals || [],
        challenges: persona.challenges || [],
        platforms_active_on: persona.platforms_active_on || [],
        problem_that_bothers_most: persona.problem_that_bothers_most || '',
        pains_that_irritate: persona.pains_that_irritate || [],
        primary_goal_to_achieve: persona.primary_goal_to_achieve || '',
        benefits_they_crave: persona.benefits_they_crave || [],
        current_status_quo_solution: persona.current_status_quo_solution || '',
        context_about_other_solutions: persona.context_about_other_solutions || '',
        triggering_event: persona.triggering_event || '',
        barriers_that_slow_them_down: persona.barriers_that_slow_them_down || [],
        advisors_who_impact_decisions: persona.advisors_who_impact_decisions || [],
        tools_currently_used: persona.tools_currently_used || [],
        communities_they_know_about: persona.communities_they_know_about || [],
        content_they_consume: persona.content_they_consume || [],
        influencers_they_follow: persona.influencers_they_follow || [],
        communication_style: persona.communication_style || ''
      }));

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  async generateFunnelMap(businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Based on the following business information, create a comprehensive marketing funnel map:

Business: ${businessInfo.business || '[Business description needed]'}
Signature Offer: ${businessInfo.offer || '[Signature offer needed]'}
Ideal Clients: ${businessInfo.personas || '[Personas from Step 1 needed]'}

Provide content ideas for each funnel stage as a JSON object:
{
  "awareness": [
    {"title": "Content Title", "description": "Brief description", "type": "blog/social/podcast"}
  ],
  "interest": [
    {"title": "Content Title", "description": "Brief description", "type": "lead magnet/email/webinar"}
  ],
  "consideration": [
    {"title": "Content Title", "description": "Brief description", "type": "case study/testimonial/demo"}
  ],
  "decision": [
    {"title": "Content Title", "description": "Brief description", "type": "sales page/consultation/proposal"}
  ],
  "retention": [
    {"title": "Content Title", "description": "Brief description", "type": "onboarding/upsell/referral"}
  ]
}

Provide 3-5 specific content pieces for each stage with actionable titles and descriptions.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert marketing strategist. Always respond with valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const funnelMap = JSON.parse(content);
        return funnelMap;
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', content);
        throw new Error('AI response was not in the expected format');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateLeadStrategy(businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Create a lead intelligence strategy based on:

Business: ${businessInfo.business || '[Business description needed]'}
Ideal Clients: ${businessInfo.personas || '[Personas needed]'}
Current Lead Sources: ${businessInfo.leadSources || '[Current sources needed]'}

Provide recommendations as JSON:
{
  "topLeadSources": [
    {"source": "Source Name", "description": "Why this source works", "priority": "High/Medium/Low"}
  ],
  "qualificationCriteria": [
    {"criteria": "Qualification point", "description": "How to assess this"}
  ],
  "trackingMetrics": [
    {"metric": "Metric name", "description": "What to measure and why"}
  ]
}`;

    return this.makeAIRequest(prompt, 'lead intelligence expert');
  }

  async generateContentSuggestions(businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Based on the following business information, suggest content for each funnel stage:

Business: ${businessInfo.business || 'Business coaching and consulting services'}
Signature Offer: ${businessInfo.offer || 'Authority Revenue Toolkit - systematic business growth framework'}
Ideal Clients: ${businessInfo.personas || 'Business owners and entrepreneurs seeking systematic growth'}

Create content suggestions for these 5 funnel stages as JSON:
{
  "discover-possibility": [
    {"title": "Content Title", "description": "Brief description", "type": "Blog Post"}
  ],
  "resonate-mission": [
    {"title": "Content Title", "description": "Brief description", "type": "Video"}
  ],
  "envision-transformation": [
    {"title": "Content Title", "description": "Brief description", "type": "Case Study"}
  ],
  "trust-process": [
    {"title": "Content Title", "description": "Brief description", "type": "Webinar"}
  ],
  "step-into-authority": [
    {"title": "Content Title", "description": "Brief description", "type": "Sales Page"}
  ]
}

Provide 2-3 specific, actionable content pieces for each stage. Focus on business growth and authority building.

Return ONLY valid JSON, no extra text.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a content marketing strategist. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      try {
        const suggestions = JSON.parse(content);
        return suggestions;
      } catch (parseError) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from API');
        }
      }
    } catch (error) {
      console.error('Error generating content suggestions:', error);
      throw error;
    }
  }

  async generateGapAnalysis(currentContent, businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const contentSummary = Object.entries(currentContent).map(([stage, items]) => 
      `${stage}: ${items.length} items (${items.map(item => item.title).join(', ')})`
    ).join('\n');

    const prompt = `Analyze the current content distribution and provide gap analysis:

Business: ${businessInfo.business || 'Business coaching and consulting services'}
Current Content Distribution:
${contentSummary}

Target: At least 2 content items per stage

Provide analysis as JSON:
{
  "overallScore": "Percentage complete (0-100)",
  "gaps": [
    {"stage": "Stage name", "currentCount": 0, "recommendedCount": 2, "priority": "High/Medium/Low"}
  ],
  "recommendations": [
    {"stage": "Stage name", "suggestion": "Specific recommendation", "contentType": "Recommended type"}
  ],
  "nextSteps": [
    "Prioritized action item 1",
    "Prioritized action item 2"
  ]
}

Focus on business growth content strategy and authority building.

Return ONLY valid JSON, no extra text.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a content strategy analyst. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch (parseError) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from API');
        }
      }
    } catch (error) {
      console.error('Error generating gap analysis:', error);
      throw error;
    }
  }

  async generateGapSuggestions(businessInfo) {
    if (!this.hasApiKey()) {
      throw new Error('OpenAI API key not set');
    }

    const gapStages = businessInfo.gaps || [];
    const stageDescriptions = {
      'discover-possibility': 'They become aware that a better way exists',
      'resonate-mission': 'They connect emotionally with your message and positioning',
      'envision-transformation': 'They see the tangible results of working with you',
      'trust-process': 'They gain confidence in your ability to deliver',
      'step-into-authority': 'They are ready to take action and invest'
    };

    const prompt = `Generate content suggestions to fill gaps in these specific funnel stages:

Business: ${businessInfo.business || 'Business coaching and consulting services'}
Signature Offer: ${businessInfo.offer || 'Authority Revenue Toolkit - systematic business growth framework'}
Ideal Clients: ${businessInfo.personas || 'Business owners and entrepreneurs seeking systematic growth'}

Focus ONLY on these stages that need more content:
${gapStages.map(stage => `- ${stage.replace(/-/g, ' ')}: ${stageDescriptions[stage]}`).join('\n')}

Create 3-4 specific content suggestions for ONLY the gap stages as JSON:
{
${gapStages.map(stage => `  "${stage}": [
    {"title": "Content Title", "description": "Brief description", "type": "Content Type"}
  ]`).join(',\n')}
}

Focus on high-impact content that addresses the specific purpose of each stage. Make titles actionable and descriptions compelling.

Return ONLY valid JSON, no extra text.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a content marketing strategist focused on filling content gaps. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      try {
        const suggestions = JSON.parse(content);
        return suggestions;
      } catch (parseError) {
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from API');
        }
      }
    } catch (error) {
      console.error('Error generating gap suggestions:', error);
      throw error;
    }
  }

  async makeAIRequest(prompt, systemRole = 'business expert') {

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert ${systemRole}. Always respond with valid JSON format when requested.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', content);
        throw new Error('AI response was not in the expected format');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}

export default new AIService();

