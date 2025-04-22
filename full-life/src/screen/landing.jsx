import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

const Landing = () => {
  return (
    <div className='background'>
      <div className="planet-arc top-right" />
      <div className="planet-arc bottom-left" />

      <div className='navbar'>
        <div className="title">Full-Life</div>
        <div className='user-account'>
          <button 
            type="submit" 
            className="navsign-button"
          >
            Signup
          </button>
          <button 
            type="submit" 
            className="navlogin-button"
          >
            Log In
          </button>
        </div>
        
      </div>

      <div className='intro-message'>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <h1>Welcome to Full-Life</h1>
        <p>Manage Your Task Efficiently</p>
        <button 
          type="submit" 
          className="login-button"
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default Landing
