import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

const Landing = () => {
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/hello')
      .then(res => res.json())
      .then(data => {
        setGreeting(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching greeting:', err);
        setGreeting('Sorry, could not connect to backend.');
        setLoading(false);
      });
  }, []);

  return (
    <div className='background'>
      <div className="planet-arc top-right" />
      <div className="planet-arc bottom-left" />

      <div className='navbar'>
        <div className="title">Full-Life</div>
        <div className='user-account'>
          <button type="submit" className="navsign-button">Signup</button>
          <button type="submit" className="navlogin-button">Log In</button>
        </div>
      </div>

      <div className='intro-message'>
        <div className="floating-dot" />
        <div className="floating-dot" />
        <div className="floating-dot" />
        <div className="floating-dot" />
        <div className="floating-dot" />

        <h1>Welcome to Full-Life</h1>
        <p>
          Live life to the fullest with Full-Life.<br/>
          Browse a selection of catered activities within your<br/>
          local area and effortlessly add them to your calendar<br/>
          across all your platforms.
        </p>

        {/* Backend greeting */}
        <div className='backend-greeting'>
          {loading ? 'Loading message...' : greeting}
        </div>

        <button type="submit" className="login-button">Login</button>
      </div>
    </div>
  );
}

export default Landing;
