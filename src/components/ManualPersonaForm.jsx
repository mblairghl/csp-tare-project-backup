import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const ManualPersonaForm = ({ isOpen, onClose, onSave, editingPersona }) => {
  const [formData, setFormData] = useState({
    name: '',
    summary: '',
    demographics: {
      age_range: '',
      occupation: '',
      income_level: '',
      location: ''
    },
    pain_points: [''],
    goals: [''],
    challenges: [''],
    platforms_active_on: [''],
    problem_that_bothers_most: '',
    pains_that_irritate: [''],
    primary_goal_to_achieve: '',
    benefits_they_crave: [''],
    current_status_quo_solution: '',
    context_about_other_solutions: '',
    triggering_event: '',
    barriers_that_slow_them_down: [''],
    advisors_who_impact_decisions: [''],
    tools_currently_used: [''],
    communities_they_know_about: [''],
    content_they_consume: [''],
    influencers_they_follow: [''],
    communication_style: '',
    additional_notes: ''
  });

  // Load editing data when editingPersona changes
  React.useEffect(() => {
    if (editingPersona) {
      setFormData({
        name: editingPersona.name || '',
        summary: editingPersona.summary || '',
        demographics: {
          age_range: editingPersona.demographics?.age_range || '',
          occupation: editingPersona.demographics?.occupation || '',
          income_level: editingPersona.demographics?.income_level || '',
          location: editingPersona.demographics?.location || ''
        },
        pain_points: editingPersona.pain_points?.length ? editingPersona.pain_points : [''],
        goals: editingPersona.goals?.length ? editingPersona.goals : [''],
        challenges: editingPersona.challenges?.length ? editingPersona.challenges : [''],
        platforms_active_on: editingPersona.platforms_active_on?.length ? editingPersona.platforms_active_on : [''],
        problem_that_bothers_most: editingPersona.problem_that_bothers_most || '',
        pains_that_irritate: editingPersona.pains_that_irritate?.length ? editingPersona.pains_that_irritate : [''],
        primary_goal_to_achieve: editingPersona.primary_goal_to_achieve || '',
        benefits_they_crave: editingPersona.benefits_they_crave?.length ? editingPersona.benefits_they_crave : [''],
        current_status_quo_solution: editingPersona.current_status_quo_solution || '',
        context_about_other_solutions: editingPersona.context_about_other_solutions || '',
        triggering_event: editingPersona.triggering_event || '',
        barriers_that_slow_them_down: editingPersona.barriers_that_slow_them_down?.length ? editingPersona.barriers_that_slow_them_down : [''],
        advisors_who_impact_decisions: editingPersona.advisors_who_impact_decisions?.length ? editingPersona.advisors_who_impact_decisions : [''],
        tools_currently_used: editingPersona.tools_currently_used?.length ? editingPersona.tools_currently_used : [''],
        communities_they_know_about: editingPersona.communities_they_know_about?.length ? editingPersona.communities_they_know_about : [''],
        content_they_consume: editingPersona.content_they_consume?.length ? editingPersona.content_they_consume : [''],
        influencers_they_follow: editingPersona.influencers_they_follow?.length ? editingPersona.influencers_they_follow : [''],
        communication_style: editingPersona.communication_style || '',
        additional_notes: editingPersona.additional_notes || ''
      });
    } else {
      // Reset form for new persona
      setFormData({
        name: '',
        summary: '',
        demographics: {
          age_range: '',
          occupation: '',
          income_level: '',
          location: ''
        },
        pain_points: [''],
        goals: [''],
        challenges: [''],
        platforms_active_on: [''],
        problem_that_bothers_most: '',
        pains_that_irritate: [''],
        primary_goal_to_achieve: '',
        benefits_they_crave: [''],
        current_status_quo_solution: '',
        context_about_other_solutions: '',
        triggering_event: '',
        barriers_that_slow_them_down: [''],
        advisors_who_impact_decisions: [''],
        tools_currently_used: [''],
        communities_they_know_about: [''],
        content_they_consume: [''],
        influencers_they_follow: [''],
        communication_style: '',
        additional_notes: ''
      });
    }
  }, [editingPersona]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up empty array items
    const cleanedData = {
      ...formData,
      id: `persona_manual_${Date.now()}`,
      pain_points: formData.pain_points.filter(item => item.trim()),
      goals: formData.goals.filter(item => item.trim()),
      challenges: formData.challenges.filter(item => item.trim()),
      platforms_active_on: formData.platforms_active_on.filter(item => item.trim()),
      pains_that_irritate: formData.pains_that_irritate.filter(item => item.trim()),
      benefits_they_crave: formData.benefits_they_crave.filter(item => item.trim()),
      barriers_that_slow_them_down: formData.barriers_that_slow_them_down.filter(item => item.trim()),
      advisors_who_impact_decisions: formData.advisors_who_impact_decisions.filter(item => item.trim()),
      tools_currently_used: formData.tools_currently_used.filter(item => item.trim()),
      communities_they_know_about: formData.communities_they_know_about.filter(item => item.trim()),
      content_they_consume: formData.content_they_consume.filter(item => item.trim()),
      influencers_they_follow: formData.influencers_they_follow.filter(item => item.trim())
    };

    onSave(cleanedData);
    onClose();
  };

  const ArrayInput = ({ field, label, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {formData[field].map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeArrayItem(field, index)}
            className="p-2 text-red-500 hover:text-red-700"
            disabled={formData[field].length === 1}
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add {label.toLowerCase()}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingPersona ? 'Edit Persona' : 'Create Manual Persona'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Persona Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Sarah the Struggling Entrepreneur"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Style</label>
              <input
                type="text"
                value={formData.communication_style}
                onChange={(e) => handleInputChange('communication_style', e.target.value)}
                placeholder="e.g., Direct, data-driven, prefers email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Brief 2-3 sentence summary of this persona"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Demographics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                <input
                  type="text"
                  value={formData.demographics.age_range}
                  onChange={(e) => handleInputChange('demographics.age_range', e.target.value)}
                  placeholder="e.g., 35-45 years old"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                <input
                  type="text"
                  value={formData.demographics.occupation}
                  onChange={(e) => handleInputChange('demographics.occupation', e.target.value)}
                  placeholder="e.g., Small Business Owner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Level</label>
                <input
                  type="text"
                  value={formData.demographics.income_level}
                  onChange={(e) => handleInputChange('demographics.income_level', e.target.value)}
                  placeholder="e.g., $75K-$150K annually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.demographics.location}
                  onChange={(e) => handleInputChange('demographics.location', e.target.value)}
                  placeholder="e.g., Urban areas, US/Canada"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Key Problems and Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biggest Problem</label>
              <textarea
                value={formData.problem_that_bothers_most}
                onChange={(e) => handleInputChange('problem_that_bothers_most', e.target.value)}
                placeholder="The single biggest problem keeping them up at night"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
              <textarea
                value={formData.primary_goal_to_achieve}
                onChange={(e) => handleInputChange('primary_goal_to_achieve', e.target.value)}
                placeholder="Their #1 most important goal"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Current Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Solution</label>
              <textarea
                value={formData.current_status_quo_solution}
                onChange={(e) => handleInputChange('current_status_quo_solution', e.target.value)}
                placeholder="What they're doing now to solve their problems"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Triggering Event</label>
              <textarea
                value={formData.triggering_event}
                onChange={(e) => handleInputChange('triggering_event', e.target.value)}
                placeholder="What event would make them seek a solution immediately"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Array Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArrayInput 
              field="pain_points" 
              label="Pain Points" 
              placeholder="Specific pain point"
            />
            <ArrayInput 
              field="goals" 
              label="Goals" 
              placeholder="Primary goal"
            />
            <ArrayInput 
              field="benefits_they_crave" 
              label="Benefits They Crave" 
              placeholder="Benefit they desperately want"
            />
            <ArrayInput 
              field="platforms_active_on" 
              label="Active Platforms" 
              placeholder="Platform name"
            />
            <ArrayInput 
              field="tools_currently_used" 
              label="Tools Currently Used" 
              placeholder="Tool or software name"
            />
            <ArrayInput 
              field="influencers_they_follow" 
              label="Influencers They Follow" 
              placeholder="Type of influencer or thought leader"
            />
          </div>

          {/* Additional Notes Section */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-3">📝 Additional Notes</h4>
            <p className="text-yellow-700 text-sm mb-3">
              Add any specific details, insights, or characteristics that weren't covered above but are important for this persona.
            </p>
            <textarea
              value={formData.additional_notes || ''}
              onChange={(e) => handleInputChange('additional_notes', e.target.value)}
              placeholder="e.g., Prefers video content over text, active in Facebook groups, responds well to case studies, has budget constraints in Q4..."
              rows={4}
              className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors hover:opacity-90"
              style={{ backgroundColor: '#fbae42' }}
            >
              Save Persona
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPersonaForm;

