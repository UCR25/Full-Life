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
          <Link to="/signup">
            <button 
              type="submit" 
              className="navsign-button"
            >
              Signup
            </button>
          </Link>
          <Link to="/login">
            <button 
              type="submit" 
              className="navlogin-button"
            >
              Log In
            </button>
          </Link>
        </div>
        
      </div>

      <div className='intro-message'>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <div className="floating-dot"></div>
        <h1>Welcome to Full-Life</h1>
        <p>Live life to the fullest with Full-Life.<br/>Browse a selection of catered activities within your<br/>local area and effortlessly add them to your calendar<br/>across all your platforms.</p>
        <Link to="/login">
          <button 
            type="submit" 
            className="login-button"
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Landing
