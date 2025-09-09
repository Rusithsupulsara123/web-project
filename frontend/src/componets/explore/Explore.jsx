import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; 

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const jwt = localStorage.getItem('jwt');

  const fetchUsers = async () => {
    try {
      const response = query
        ? await axios.get(`${API_BASE_URL}/api/users/search?query=${query}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          })
        : await axios.get(`${API_BASE_URL}/api/users/allprofiles`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });

      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  return (
    <div className="p-4 dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Explore Users</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name..."
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
      />

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 cursor-pointer dark:border-gray-700"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <div className="text-gray-500 dark:text-gray-400 text-5xl mr-6">
            {user.profilepic ? (
              <img
               src={user.profilepic}
               alt="Profile"
               className="w-16 h-16 rounded-full object-cover"
              />
              ) : (
             <FaUserCircle />
            )}
            </div>
            <div>
              <h3 className="text-xl font-semibold dark:text-white">{user.fullName}</h3>
              <p className="text-gray-600 dark:text-gray-300">Email: {user.email}</p>
              <p className="text-gray-600 dark:text-gray-300">
                About: {user.bio ? user.bio : 'No description'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
