import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AddQuestion = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setTopic(initialData.topic || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !topic.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        throw new Error('Please sign in to add a question');
      }

      const decoded = jwtDecode(jwt);
      const userEmail = decoded.email;

      const questionData = {
        title,
        description,
        topic,
        userEmail
      };

      // Include ID if we're editing
      if (initialData && initialData.id) {
        questionData.id = initialData.id;
      }

      if (onSubmit) {
        await onSubmit(questionData);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setError(error.response?.data?.message || 'Error submitting question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        {initialData ? 'Edit Question' : 'Ask a Question'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter the topic of your question"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your question title"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your question description"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            rows="4"
            required
          />
        </div>
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
