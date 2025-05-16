import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_navbar.css";

const HomeNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="navbar-container">
      <nav className="home-navbar">
        <div className="nav-left">
          <Link to="/home" className="nav-title">Full-Life</Link>
        </div>
        <div className="nav-center">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/calendar" className="nav-link">Calendar</Link>
          <Link to="/events" className="nav-link">Events</Link>
        </div>
        <div className="nav-right">
          <div className="user-profile" onClick={toggleDropdown}>
            <div className="profile-icon">
              <i className="fas fa-user"></i>
            </div>
          </div>
        </div>
      </nav>
      
      {dropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="dropdown-avatar-icon">
              <i className="fas fa-user"></i>
            </div>
            <span className="dropdown-username">
              {user?.name || user?.given_name || 'Guest'}
            </span>
          </div>
          <div className="dropdown-divider"></div>
          <Link to="/profile" className="dropdown-item">
            <span className="dropdown-icon"><i className="fas fa-user-edit"></i></span>
            <span>View Profile</span>
            <span className="dropdown-arrow">›</span>
          </Link>
          <Link to="/settings" className="dropdown-item">
            <span className="dropdown-icon"><i className="fas fa-cog"></i></span>
            <span>Settings & Privacy</span>
            <span className="dropdown-arrow">›</span>
          </Link>
          <Link to="/support" className="dropdown-item">
            <span className="dropdown-icon"><i className="fas fa-question-circle"></i></span>
            <span>Help & Support</span>
            <span className="dropdown-arrow">›</span>
          </Link>
          <Link to="/login" className="dropdown-item">
            <span className="dropdown-icon"><i className="fas fa-sign-out-alt"></i></span>
            <span>Logout</span>
            <span className="dropdown-arrow">›</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeNavbar;