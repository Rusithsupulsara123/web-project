import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import AddAnswer from './AddAnswer';
import { jwtDecode } from 'jwt-decode';

const QuestionCard = ({ question, isGeneral = false, onEdit, onDelete }) => {
  const [answers, setAnswers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [answerUserInfo, setAnswerUserInfo] = useState({});
  const jwt = localStorage.getItem('jwt');

  useEffect(() => {
    const checkOwnership = () => {
      if (!jwt) return;
      try {
        const decoded = jwtDecode(jwt);
        setIsOwner(decoded.email === question.userEmail);
      } catch (error) {
        console.error('Error checking ownership:', error);
      }
    };
    checkOwnership();
  }, [jwt, question.userEmail]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!question.userEmail) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/users/search?query=${question.userEmail}`,
          {
            headers: { Authorization: `Bearer ${jwt}` }
          }
        );
        if (response.data && response.data.length > 0) {
          setUserInfo(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [question.userEmail, jwt]);

  const fetchAnswers = async () => {
    if (isGeneral) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/answers/question/${question.id}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setAnswers(res.data);
      // Fetch user info for each answer
      const userInfoPromises = res.data.map(async (answer) => {
        if (!answer.userEmail) return;
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/users/search?query=${answer.userEmail}`,
            {
              headers: { Authorization: `Bearer ${jwt}` }
            }
          );
          if (response.data && response.data.length > 0) {
            return { [answer.id]: response.data[0] };
          }
        } catch (error) {
          console.error('Error fetching answer user info:', error);
        }
        return null;
      });

      const userInfoResults = await Promise.all(userInfoPromises);
      const userInfoMap = userInfoResults.reduce((acc, curr) => {
        if (curr) {
          return { ...acc, ...curr };
        }
        return acc;
      }, {});
      setAnswerUserInfo(userInfoMap);
    } catch (err) {
      console.error('Error fetching answers:', err.message);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [question.id, isGeneral]);

  const handleAnswerAdded = (newAnswer) => {
    setAnswers([...answers, newAnswer]);
    // Fetch user info for the new answer
    if (newAnswer.userEmail) {
      axios.get(
        `${API_BASE_URL}/api/users/search?query=${newAnswer.userEmail}`,
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      ).then(response => {
        if (response.data && response.data.length > 0) {
          setAnswerUserInfo(prev => ({
            ...prev,
            [newAnswer.id]: response.data[0]
          }));
        }
      }).catch(error => {
        console.error('Error fetching new answer user info:', error);
      });
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit && question.id) {
      onEdit(question);
    } else {
      console.error('Question ID is missing');
      alert('Error: Question ID is missing. Cannot edit this question.');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/questions/${question.id}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        if (onDelete) onDelete(question.id);
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question. Please try again.');
      }
    }
    setShowMenu(false);
  };

  const displayName = userInfo?.fullName || question.userEmail || 'Anonymous User';
  const profilePic = userInfo?.profilepic;

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 rounded mb-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {profilePic ? (
            <img
              src={profilePic}
              alt="User"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          ) : (
            <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-400 mr-3" />
          )}
          <div>
            <p className="font-semibold dark:text-white">{displayName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(question.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {isOwner && !isGeneral && (
          <div className="relative">
            <button
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <MoreVertIcon className="text-gray-500 dark:text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Edit Question
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Delete Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold dark:text-white">{question.title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{question.description}</p>

      {!isGeneral && (
        <div className="mt-3 dark:bg-gray-800">
          <p className="font-semibold mb-2 dark:text-white">Answers ({answers.length}):</p>
          {answers.length > 0 ? (
            answers.map((a) => {
              const answerUser = answerUserInfo[a.id];
              const answerDisplayName = answerUser?.fullName || a.userEmail || 'Anonymous';
              const answerProfilePic = answerUser?.profilepic;
              
              return (
                <div key={a.id} className="pl-4 border-l border-gray-200 dark:border-gray-700 mb-3">
                  <div className="flex items-center mb-1">
                    {answerProfilePic ? (
                      <img
                        src={answerProfilePic}
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2 object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-xl text-gray-500 dark:text-gray-400 mr-2" />
                    )}
                    <span className="text-sm font-medium dark:text-white">{answerDisplayName}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{a.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No answers yet. Be the first to answer!</p>
          )}
          
          <div className="dark:bg-gray-800">
            <AddAnswer questionId={question.id} onAnswerAdded={handleAnswerAdded} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
