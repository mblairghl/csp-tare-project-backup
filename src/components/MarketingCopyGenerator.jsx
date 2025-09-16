import React, { useContext, useState } from 'react';
import { FunnelContext } from '../context/FunnelContext';
import { FileText, Copy, Download } from 'lucide-react';

const MarketingCopyGenerator = () => {
  const { 
    funnelContent, 
    marketingCopy, 
    setMarketingCopy,
    personas,
    getTotalContentCount
  } = useContext(FunnelContext);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copyType, setCopyType] = useState('tare');

  // Generate TARE framework copy
  const generateTARECopy = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const primaryPersona = personas[0] || { name: 'Your Ideal Client' };
      const contentCount = getTotalContentCount();
      
      const tareFramework = `
# TARE Framework Marketing Copy

## T - TRUST (Building Credibility)
Based on your ${contentCount} content assets, here's how to establish trust:

**Trust-Building Headlines:**
• "Proven strategies that have helped [specific number] clients achieve [specific result]"
• "The same system I used to [your transformation story]"
• "Why [industry experts/publications] recommend this approach"

**Social Proof Integration:**
• Feature your best case studies from the "Trust the Process" content
• Include testimonials that address common objections
• Showcase credentials and recognition

## A - AUTHORITY (Demonstrating Expertise)
Your authority positioning based on content audit:

**Authority Statements:**
• "After [X years] of [specific experience], I've discovered..."
• "The methodology that [specific achievement/recognition]"
• "What most [industry] experts get wrong about [topic]"

**Content Authority Hooks:**
• Reference your most valuable content pieces
• Position yourself as the guide who's "been there, done that"
• Share contrarian viewpoints that differentiate you

## R - RESULTS (Promising Outcomes)
Results-focused messaging for ${primaryPersona.name}:

**Outcome Promises:**
• "Transform from [current state] to [desired state] in [timeframe]"
• "The exact blueprint to [specific result] without [common pain point]"
• "How to [achieve goal] even if [common obstacle]"

**Results Proof:**
• Specific metrics and transformations
• Before/after scenarios
• Timeline expectations

## E - EXCLUSIVITY (Creating Urgency)
Exclusivity and scarcity elements:

**Exclusive Positioning:**
• "Limited to [number] clients per [timeframe]"
• "By invitation only" or "Application required"
• "Not for everyone - only for [specific criteria]"

**Urgency Drivers:**
• Time-sensitive bonuses
• Limited availability
• Seasonal relevance
• Market timing

---

## Content Integration Strategy

Based on your funnel mapping:

**Discover Stage Content:** Use for awareness and problem agitation
**Resonate Stage Content:** Build emotional connection and shared values
**Envision Stage Content:** Paint the picture of transformation
**Trust Stage Content:** Provide proof and credibility
**Authority Stage Content:** Position for the sale and next steps

## Next Steps:
1. Customize this framework with your specific details
2. A/B test different variations
3. Integrate with your content calendar
4. Track conversion metrics

*Generated based on your Step 2 content audit and persona data.*
      `;
      
      setMarketingCopy(tareFramework.trim());
    } catch (error) {
      console.error('Error generating copy:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(marketingCopy);
    // Could add a toast notification here
  };

  const downloadCopy = () => {
    const element = document.createElement('a');
    const file = new Blob([marketingCopy], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'marketing-copy-tare-framework.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing Copy & TARE Framework</h3>
        <p className="text-gray-600">Generate persuasive marketing copy based on your content audit and persona data.</p>
      </div>

      {/* Copy Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Copy Framework</label>
        <select
          value={copyType}
          onChange={(e) => setCopyType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="tare">TARE Framework (Trust, Authority, Results, Exclusivity)</option>
          <option value="pain-agitation">Pain Agitation Solution</option>
          <option value="before-after">Before & After Bridge</option>
        </select>
      </div>

      {/* Generate Button */}
      <div className="mb-6">
        <button
          onClick={generateTARECopy}
          disabled={isGenerating || getTotalContentCount() === 0}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
            isGenerating || getTotalContentCount() === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>
            {isGenerating 
              ? 'Generating Copy...' 
              : getTotalContentCount() === 0 
                ? 'Add Content First' 
                : 'Generate Marketing Copy'
            }
          </span>
        </button>
      </div>

      {/* Generated Copy Display */}
      {marketingCopy && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-gray-900">Generated Copy</h4>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadCopy}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {marketingCopy}
            </pre>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!marketingCopy && getTotalContentCount() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Ready to generate copy!</strong> You have {getTotalContentCount()} content pieces mapped to your funnel. 
            Click "Generate Marketing Copy" to create TARE framework messaging based on your content audit.
          </p>
        </div>
      )}

      {getTotalContentCount() === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>Add content first:</strong> Go back to the Content Library step and add some content assets 
            to generate personalized marketing copy.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketingCopyGenerator;

