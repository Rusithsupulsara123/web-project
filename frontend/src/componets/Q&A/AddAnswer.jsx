import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { jwtDecode } from 'jwt-decode';

const AddAnswer = ({ questionId, onAnswerAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        throw new Error('Please sign in to add an answer');
      }

      const decoded = jwtDecode(jwt);
      const userEmail = decoded.email;

      const response = await axios.post(
        `${API_BASE_URL}/api/answers`,
        {
          content,
          questionId,
          userEmail
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setContent('');
      if (onAnswerAdded) {
        onAnswerAdded(response.data);
      }
    } catch (error) {
      console.error('Error adding answer:', error);
      alert(error.response?.data?.message || 'Error adding answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start space-x-3">
          <FaUserCircle className="text-2xl text-gray-500 dark:text-gray-400" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer..."
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-200"
            rows="3"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAnswer; 