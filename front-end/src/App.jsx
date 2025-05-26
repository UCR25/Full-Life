// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './welcome/landing';
import Login from './welcome/login';
import Signup from './welcome/signup';
import UserHomePage from './homepage/UserHomePage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected / after-login */}
        <Route path="/user-home" element={<UserHomePage />} />

        {/* Fallback if you like */}
        <Route path="*" element={<p>404: Not Found</p>} />
      </Routes>
    </Router>
  );
}
