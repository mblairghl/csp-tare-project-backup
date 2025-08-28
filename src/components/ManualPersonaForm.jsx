import React, { useState } from 'react';
import { X } from 'lucide-react';

const ManualPersonaForm = ({ isOpen, onClose, onSave, editingPersona }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    summary: '',
    keyBehaviors: '',
    platformPreferences: '',
    motivations: '',
    frustrations: '',
    favoriteBrands: '',
    buyingTriggers: '',
    contentResonance: '',
    unmetNeeds: '',
    details: ''
  });

  // Load editing data when editingPersona changes
  React.useEffect(() => {
    if (editingPersona) {
      setFormData({
        title: editingPersona.title || '',
        description: editingPersona.description || '',
        summary: editingPersona.summary || '',
        keyBehaviors: editingPersona.keyBehaviors || '',
        platformPreferences: editingPersona.platformPreferences || '',
        motivations: editingPersona.motivations || '',
        frustrations: editingPersona.frustrations || '',
        favoriteBrands: editingPersona.favoriteBrands || '',
        buyingTriggers: editingPersona.buyingTriggers || '',
        contentResonance: editingPersona.contentResonance || '',
        unmetNeeds: editingPersona.unmetNeeds || '',
        details: editingPersona.details || ''
      });
    } else {
      // Reset form for new persona
      setFormData({
        title: '',
        description: '',
        summary: '',
        keyBehaviors: '',
        platformPreferences: '',
        motivations: '',
        frustrations: '',
        favoriteBrands: '',
        buyingTriggers: '',
        contentResonance: '',
        unmetNeeds: '',
        details: ''
      });
    }
  }, [editingPersona]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const personaData = {
      ...formData,
      id: editingPersona?.id || `persona_manual_${Date.now()}`,
      type: 'Demographics',
      source: 'manual'
    };

    onSave(personaData);
    onClose();
  };

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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Persona Information</h3>
            <p className="text-blue-800 text-sm mb-2">
              Fill out the same fields that AI personas include to create a comprehensive client profile.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
              <p className="text-yellow-800 text-sm">
                💡 <strong>Already have a persona document?</strong> You can upload your existing Word doc, Google doc, PDF, or other persona documentation using the upload button at the bottom instead of typing everything manually.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Persona Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Sarah the Struggling Entrepreneur"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brief Description *</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Overwhelmed business owner seeking growth"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
            />
          </div>

          {/* AI Persona Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Key Behaviors</label>
              <textarea
                value={formData.keyBehaviors}
                onChange={(e) => handleInputChange('keyBehaviors', e.target.value)}
                placeholder="How they behave online, their habits, decision-making patterns..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📱 Platform Preferences</label>
              <textarea
                value={formData.platformPreferences}
                onChange={(e) => handleInputChange('platformPreferences', e.target.value)}
                placeholder="LinkedIn, Twitter, Facebook, industry forums, etc..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💭 Motivations</label>
              <textarea
                value={formData.motivations}
                onChange={(e) => handleInputChange('motivations', e.target.value)}
                placeholder="What drives them, their core desires and aspirations..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">😤 Frustrations</label>
              <textarea
                value={formData.frustrations}
                onChange={(e) => handleInputChange('frustrations', e.target.value)}
                placeholder="'I wish someone would just...' statements, pain points..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🛍️ Favorite Brands</label>
              <textarea
                value={formData.favoriteBrands}
                onChange={(e) => handleInputChange('favoriteBrands', e.target.value)}
                placeholder="Tools, services, and brands they trust and use..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Buying Triggers</label>
              <textarea
                value={formData.buyingTriggers}
                onChange={(e) => handleInputChange('buyingTriggers', e.target.value)}
                placeholder="What makes them purchase, urgency factors, decision triggers..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📈 Content Resonance</label>
              <textarea
                value={formData.contentResonance}
                onChange={(e) => handleInputChange('contentResonance', e.target.value)}
                placeholder="What type of content they engage with, messaging that works..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Unmet Needs & Opportunities</label>
              <textarea
                value={formData.unmetNeeds}
                onChange={(e) => handleInputChange('unmetNeeds', e.target.value)}
                placeholder="5 unmet needs or desires you could build solutions for..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📝 Additional Details</label>
            <textarea
              value={formData.details}
              onChange={(e) => handleInputChange('details', e.target.value)}
              placeholder="Any additional information about this persona..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e9246]"
            />
          </div>

          {/* Form Actions */}
          <div className="space-y-4 pt-6 border-t">
            {/* Document Upload Option */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📄 Upload Existing Document</h4>
              <p className="text-gray-600 text-sm mb-3">
                Have a persona document already? Upload your Word doc, PDF, Google doc, or any other persona documentation instead of filling out the form manually.
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.rtf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // For now, just show the filename - you can implement actual file processing later
                    alert(`File "${file.name}" selected. File processing will be implemented to extract persona data automatically.`);
                  }
                }}
                className="hidden"
                id="persona-document-upload"
              />
              <label
                htmlFor="persona-document-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#d7df21] text-black rounded-md hover:bg-[#c5cd1e] cursor-pointer transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Document
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, Word (.doc/.docx), Text (.txt), RTF
              </p>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-[#fbae42] text-white rounded-md hover:bg-[#e09d3a] transition-colors"
              >
                {editingPersona ? 'Update Persona' : 'Create Persona'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualPersonaForm;

