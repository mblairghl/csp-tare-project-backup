import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PersonaCard = ({ persona, onAdd, onRemove, showAddButton = true, showRemoveButton = false, isSelected = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-gray-50 rounded-lg p-6 border transition-colors ${
      isSelected ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{persona.name}</h3>
          {persona.demographics && (
            <p className="text-sm text-gray-600 mt-1">
              {persona.demographics.occupation} • {persona.demographics.age_range} • {persona.demographics.income_level}
            </p>
          )}
          {persona.summary && (
            <p className="text-sm text-gray-500 mt-2">{persona.summary}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          {showAddButton && !isSelected && (
            <button
              onClick={() => onAdd(persona)}
              className="px-4 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#fbae42' }}
            >
              Add
            </button>
          )}
          {showRemoveButton && (
            <button
              onClick={() => onRemove(persona)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium transition-colors hover:bg-red-600"
            >
              Remove
            </button>
          )}
          {isSelected && (
            <span className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
              Added ✓
            </span>
          )}
        </div>
      </div>

      {/* Key Information - Always Visible */}
      <div className="space-y-3 mb-4">
        {/* Primary Problem */}
        {persona.problem_that_bothers_most && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Biggest Problem</h4>
            <p className="text-sm text-gray-600">{persona.problem_that_bothers_most}</p>
          </div>
        )}

        {/* Primary Goal */}
        {persona.primary_goal_to_achieve && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Primary Goal</h4>
            <p className="text-sm text-gray-600">{persona.primary_goal_to_achieve}</p>
          </div>
        )}

        {/* Communication Style */}
        {persona.communication_style && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Communication Style</h4>
            <p className="text-sm text-gray-600">{persona.communication_style}</p>
          </div>
        )}
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full py-2 text-sm text-gray-600 hover:text-gray-800 border-t border-gray-200"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Show Less Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Show More Details
          </>
        )}
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Pain Points */}
          {persona.pain_points && persona.pain_points.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pain Points</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {persona.pain_points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Goals */}
          {persona.goals && persona.goals.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Goals</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {persona.goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits They Crave */}
          {persona.benefits_they_crave && persona.benefits_they_crave.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Benefits They Crave</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {persona.benefits_they_crave.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Solution */}
          {persona.current_status_quo_solution && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Current Solution</h4>
              <p className="text-sm text-gray-600">{persona.current_status_quo_solution}</p>
            </div>
          )}

          {/* Triggering Event */}
          {persona.triggering_event && (
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Triggering Event</h4>
              <p className="text-sm text-gray-600">{persona.triggering_event}</p>
            </div>
          )}

          {/* Platforms */}
          {persona.platforms_active_on && persona.platforms_active_on.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Active Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {persona.platforms_active_on.map((platform, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools Currently Used */}
          {persona.tools_currently_used && persona.tools_currently_used.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tools Currently Used</h4>
              <div className="flex flex-wrap gap-2">
                {persona.tools_currently_used.map((tool, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Influencers They Follow */}
          {persona.influencers_they_follow && persona.influencers_they_follow.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Influencers They Follow</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {persona.influencers_they_follow.map((influencer, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span>{influencer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonaCard;

