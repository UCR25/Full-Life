import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Landing from './welcome/landing.jsx';
import Login from './welcome/login.jsx';
import Signup from './welcome/signup.jsx';
import UserHomePage from './homepage/UserHomePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { isAuthenticated } from './utils/authUtils';

function RedirectHandler({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const shouldRedirect = localStorage.getItem('redirectToUserHome');
    if (shouldRedirect === 'true' && isAuthenticated()) {
      localStorage.removeItem('redirectToUserHome');
      navigate('/user-home');
    } else if (shouldRedirect === 'true' && !isAuthenticated()) {
      localStorage.removeItem('redirectToUserHome');
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
          <Route path="/user-home" element={
            <ProtectedRoute>
              <UserHomePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RedirectHandler>
    </Router>
  );
}