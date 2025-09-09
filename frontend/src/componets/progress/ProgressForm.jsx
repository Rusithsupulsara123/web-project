import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProgressForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    skill: '',
    progress: '',
    challenges: '',
    nextSteps: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        title: '',
        skill: '',
        progress: '',
        challenges: '',
        nextSteps: ''
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl mx-auto border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-3 transition-colors duration-200"
        >
          <ArrowBackIcon />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Progress Update' : 'Create Progress Update'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Enter a title for your progress update"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">Skill:</label>
          <input
            type="text"
            name="skill"
            value={formData.skill}
            onChange={handleChange}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200 dark:bg-gray-700 dark:text-white"
            required
            placeholder="What skill are you working on?"
          />
        </div>

        <div className="flex justify-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 text-center pt-2">Progress:</label>
          <textarea
            name="progress"
            value={formData.progress}
            onChange={handleChange}
            rows="3"
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Describe your progress..."
          />
        </div>

        <div className="flex justify-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 text-center pt-2">Challenges:</label>
          <textarea
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            rows="2"
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200 dark:bg-gray-700 dark:text-white"
            placeholder="What challenges did you encounter?"
          />
        </div>

        <div className="flex justify-center gap-4">
          <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 text-center pt-2">Next Steps:</label>
          <textarea
            name="nextSteps"
            value={formData.nextSteps}
            onChange={handleChange}
            rows="2"
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors duration-200 dark:bg-gray-700 dark:text-white"
            placeholder="What are your next goals?"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.1)] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2"
          >
            {isEditing ? 'Update Progress' : 'Create Progress Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgressForm; 