import React from 'react';
import './SimpleProfile.css';

const SimpleProfile = ({ goBack, profile, error }) => {
  // If we passed in an error message, show that
  if (error) {
    return (
      <div className="simple-profile-container">
        <div className="simple-profile-card">
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  // If profile hasn’t loaded yet, show a spinner/text
  if (!profile) {
    return (
      <div className="simple-profile-container">
        <div className="simple-profile-card">
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  const { username, email, hobbies = [], picture } = profile;

  return (
    <div className="simple-profile-container">
      <div className="simple-profile-card">
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>

        <div className="simple-profile-header">
          {picture ? (
            <img
              src={picture}
              alt={username}
              className="simple-profile-image"
            />
          ) : (
            <div className="simple-profile-image-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
          <h1 className="simple-profile-name">{username}</h1>
        </div>

        <div className="simple-profile-info">
          <div className="simple-info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{email}</span>
          </div>

          <div className="simple-info-item">
            <span className="info-label">Hobbies:</span>
            <div className="simple-hobbies-list">
              {hobbies.length > 0 ? (
                hobbies.map((h, i) => (
                  <span key={i} className="simple-hobby-tag">
                    {h}
                  </span>
                ))
              ) : (
                <span className="simple-hobby-tag">No hobbies listed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfile;