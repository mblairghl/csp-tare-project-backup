import React, { useState } from 'react';
import { X } from 'lucide-react';

const ContentAssetModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'Article',
    name: '',
    description: '',
    notes: ''
  });

  const contentTypes = [
    'Article',
    'Blog Post',
    'Video',
    'Podcast',
    'Webinar',
    'Case Study',
    'White Paper',
    'eBook',
    'Infographic',
    'Social Media Post',
    'Email',
    'Landing Page',
    'Sales Page',
    'Lead Magnet',
    'Course Module',
    'Workshop',
    'Template',
    'Checklist',
    'Guide',
    'Report'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Content Name is required');
      return;
    }
    
    const newAsset = {
      id: Date.now(),
      title: formData.name,
      type: formData.type,
      description: formData.description || `${formData.type} content`,
      notes: formData.notes
    };
    
    onSave(newAsset);
    setFormData({ type: 'Article', name: '', description: '', notes: '' });
    onClose();
  };

  const handleCancel = () => {
    setFormData({ type: 'Article', name: '', description: '', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add New Content Item</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                required
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                placeholder="Enter content name..."
                required
              />
            </div>

            {/* Content Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 resize-none"
                placeholder="Describe your content..."
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 resize-none"
                placeholder="Additional notes..."
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentAssetModal;

