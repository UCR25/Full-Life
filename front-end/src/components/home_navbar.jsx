import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home_navbar.css";
import { logoutUser } from "../utils/authUtils";

const HomeNavbar = ({ toggleProfile, toggleSupport }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    toggleProfile();
  };
  
  const handleViewSupport = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    toggleSupport();
  };
  
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(false);
    
    // Use the logoutUser utility to clear all user data
    logoutUser();
    // Navigate to login page
    navigate('/login');
  };

  // guard in case there's no user yet
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <div className="navbar-container" onClick={() => setDropdownOpen(false)}>
        <nav className="home-navbar">
          <div className="nav-left">
            <span className="nav-title" onClick={() => window.location.reload()}>
              Full-Life
            </span>
          </div>

          <div className="nav-center">
            <span className="nav-link">Dashboard</span>
            <span className="nav-link">Calendar</span>
            <span className="nav-link">Events</span>
          </div>

        <div className="nav-right">
          <div className="user-profile" onClick={toggleDropdown}>
            <div className="profile-icon">
              <i className="fas fa-user"></i>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">
                  <div className="dropdown-avatar-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="dropdown-username">
                    {user?.username || user?.name || "Guest"}
                  </span>
                </div>

                <div className="dropdown-divider"></div>

                {/* VIEW PROFILE */}
                <div className="dropdown-item" onClick={handleViewProfile}>
                  <span className="dropdown-icon">
                    <i className="fas fa-user-edit"></i>
                  </span>
                  <span>View Profile</span>
                  <span className="dropdown-arrow">›</span>
                </div>

                <div onClick={handleViewSupport} className="dropdown-item">
                  <span className="dropdown-icon">
                    <i className="fas fa-question-circle"></i>
                  </span>
                  <span>Help &amp; Support</span>
                  <span className="dropdown-arrow">›</span>
                </div>

                <div onClick={handleLogout} className="dropdown-item">
                  <span className="dropdown-icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  <span>Logout</span>
                  <span className="dropdown-arrow">›</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      </div>
    </>
  );
};

export default HomeNavbar;
