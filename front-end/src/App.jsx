// src/App.jsx

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Landing from './welcome/landing.jsx';
import Login from './welcome/login.jsx';
import Signup from './welcome/signup.jsx';
import UserHomePage from './homepage/UserHomePage.jsx';

// Wrapper component to handle redirects
function RedirectHandler({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if we need to redirect to user home
    const shouldRedirect = localStorage.getItem('redirectToUserHome');
    if (shouldRedirect === 'true') {
      // Clear the redirect flag
      localStorage.removeItem('redirectToUserHome');
      // Redirect to user home
      navigate('/user-home');
    }
  }, [navigate]);
  
  return children;
}

export default function App() {
  return (
    <Router>
      <RedirectHandler>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-home" element={<UserHomePage />} />
          {/* Add a catch-all route that redirects to the landing page */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </RedirectHandler>
    </Router>
  );
}