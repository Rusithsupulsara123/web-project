import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import QuestionCard from './QuestionCard';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import QuestionForm from './AddQuestion';
import { jwtDecode } from 'jwt-decode';

const QnAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const navigate = useNavigate();
  const { auth } = useSelector(store => store);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const jwt = localStorage.getItem('jwt');

  const showMessage = (message, type = 'success') => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
          showMessage('Please sign in to view questions', 'error');
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/questions`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setQuestions(res.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
        showMessage('Error fetching questions. Please try again.', 'error');
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(query.toLowerCase()) ||
    q.topic.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = async (newQuestion) => {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        showMessage('Please sign in to ask a question', 'error');
        return;
      }

      let userEmail;
      try {
        const decoded = jwtDecode(jwt);
        console.log('Decoded token:', decoded);
        userEmail = decoded.email;
        console.log('User Email:', userEmail);
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        showMessage('Invalid authentication token. Please log in again.', 'error');
        return;
      }

      if (!userEmail) {
        console.error('No email found in token');
        showMessage('User authentication error. Please try logging in again.', 'error');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/questions`,
        {
          ...newQuestion,
          userEmail: userEmail
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setQuestions([...questions, response.data]);
      setShowForm(false);
      showMessage('Question created successfully!');
    } catch (error) {
      console.error('Error creating question:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      showMessage(error.response?.data?.message || 'Error creating question. Please try again.', 'error');
    }
  };

  const handleUpdate = async (updatedQuestion) => {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        showMessage('Please sign in to update questions', 'error');
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/questions/${updatedQuestion.id}`,
        updatedQuestion,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setQuestions(questions.map(q => 
        q.id === updatedQuestion.id ? response.data : q
      ));
      setShowForm(false);
      setEditingQuestion(null);
      showMessage('Question updated successfully!');
    } catch (error) {
      console.error('Error updating question:', error);
      showMessage(error.response?.data?.message || 'Error updating question. Please try again.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        showMessage('Please sign in to delete questions', 'error');
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      setQuestions(questions.filter(q => q.id !== id));
      showMessage('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      showMessage(error.response?.data?.message || 'Error deleting question. Please try again.', 'error');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleAskQuestion = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      showMessage('Please sign in to ask a question', 'error');
      return;
    }
    setShowForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleQuestionSubmit = async (questionData) => {
    try {
      if (editingQuestion && editingQuestion.id) {
        // Update existing question
        const response = await axios.put(
          `${API_BASE_URL}/api/questions/${editingQuestion.id}`,
          {
            ...questionData,
            id: editingQuestion.id,
            topic: questionData.topic || editingQuestion.topic
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setQuestions(questions.map(q => 
          q.id === editingQuestion.id ? response.data : q
        ));
      } else {
        // Create new question
        const response = await axios.post(
          `${API_BASE_URL}/api/questions`,
          questionData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setQuestions([response.data, ...questions]);
      }
      setShowAddQuestion(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error submitting question:', error);
      alert(error.response?.data?.message || 'Error submitting question. Please try again.');
    }
  };

  const generalQuestions = [
    {
      id: 'gen-1',
      title: 'What is Skill Plus?',
      description: 'a platform designed to connect people through skills. Whether you want to share your expertise or learn something new, this app provides a space for users to ask questions, offer answers, and grow together.',
      createdAt: new Date().toISOString(),
      user: { fullName: 'System', profilepic: null },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-8 text-center dark:text-white">Q&A Section</h1>

      {/* General Questions */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">Frequently Asked Questions</h3>
        {generalQuestions.map((q) => (
          <QuestionCard key={q.id} question={q} isGeneral />
        ))}
      </div>

      {!showForm ? (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 mr-4">
              <SearchBar query={query} setQuery={setQuery} />
            </div>
            <button
              onClick={handleAskQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <span>Ask Question</span>
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={() => handleEdit(question)}
                onDelete={() => handleDelete(question.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <QuestionForm
          onSubmit={editingQuestion ? handleUpdate : handleCreate}
          initialData={editingQuestion}
          isEditing={!!editingQuestion}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default QnAPage;
