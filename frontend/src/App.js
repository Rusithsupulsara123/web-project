import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './Store/Auth/Action';
import Homepage from './componets/home/home';
import Authentication from './componets/authentication/Authentication';
import { ThemeProvider } from './config/ThemeContext';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector(store => store);

  // Handle OAuth2 redirect and token extraction from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem("jwt", token);
      dispatch(getUserProfile(token));
      navigate("/home");
      window.history.replaceState({}, document.title, "/home");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");

    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt));
      navigate("/home");
    }
  }, [dispatch, auth.user, navigate]);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/*" element={auth.user ? <Homepage /> : <Authentication />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
