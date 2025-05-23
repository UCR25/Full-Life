import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SimpleProfile.css';

const SimpleProfile = ({ goBack }) => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setProfile(JSON.parse(userData));
    }
  }, []);

  // Hardcoded hobbies
  const hobbies = ['Reading', 'Hiking', 'Sleeping', 'Cooking'];

  if (!profile) {
    return (
      <div className="simple-profile-container">
        <div className="simple-profile-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="simple-profile-container">
      <div className="simple-profile-content">
        <div className="simple-profile-card">
          <div className="back-arrow" onClick={goBack}>
            <i className="fas fa-arrow-left"></i> Back
          </div>
          <div className="simple-profile-header">
            {profile.picture ? (
              <img src={profile.picture} alt="Profile" className="simple-profile-image" />
            ) : (
              <div className="simple-profile-image-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
            <h1>{profile.name || 'User'}</h1>
          </div>
          
          <div className="simple-profile-info">
            <div className="simple-info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile.email || 'Not available'}</span>
            </div>
            
            <div className="simple-info-item">
              <span className="info-label">Hobbies:</span>
              <div className="simple-hobbies-list">
                {hobbies.map((hobby, index) => (
                  <span key={index} className="simple-hobby-tag">{hobby}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfile;
