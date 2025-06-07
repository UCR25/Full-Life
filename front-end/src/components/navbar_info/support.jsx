import React from 'react';
import './support.css';

const Support = ({ onClose }) => {
  return (
    <div className="support-container">
      <div className="support-content">
        <div className="support-card">
          <div className="back-arrow" onClick={onClose}>
            <i className="fas fa-arrow-left"></i> Back
          </div>
        
          <div className="support-header">
            <div className="support-icon">
              <i className="fas fa-question-circle"></i>
            </div>
            <h1>Help & Support</h1>
          </div>
        
          <div className="support-description">
            <p>If you need help with Full-Life or have any questions, please feel free to reach out to one of our developers:</p>
          </div>
        
          <div className="developers-list">
            {/* First row: Sneha and Matthew */}
            <div className="developer-card">
              <h3>Sneha Gurung</h3>
              <p><i className="fas fa-envelope"></i> sguru004@ucr.edu</p>
              <p><i className="fas fa-code"></i> Frontend Developer</p>
            </div>
          
            <div className="developer-card">
              <h3>Matthew Bradwers</h3>
              <p><i className="fas fa-envelope"></i> mbraw003@ucr.edu</p>
              <p><i className="fas fa-code"></i> Backend Developer</p>
            </div>
          
            {/* Second row: Oscar and Terek */}
            <div className="developer-card">
              <h3>Oscar La</h3>
              <p><i className="fas fa-envelope"></i> ola002@ucr.edu</p>
              <p><i className="fas fa-code"></i> Backend Developer</p>
            </div>
          
            <div className="developer-card">
              <h3>Terek Johnson</h3>
              <p><i className="fas fa-envelope"></i> tjohn108@ucr.edu</p>
              <p><i className="fas fa-code"></i> Frontend Developer</p>
            </div>
          </div>
        
          <div className="support-footer">
            <p>Our team is dedicated to making Full-Life the best experience possible for you. We appreciate your feedback and support!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
