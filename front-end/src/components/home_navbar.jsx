// src/components/home_navbar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home_navbar.css";

const HomeNavbar = ({ toggleProfile }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    toggleProfile();
  };

  // guard in case there's no user yet
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    // clicking anywhere outside the menu will close it
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

                <Link to="/settings" className="dropdown-item">
                  <span className="dropdown-icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  <span>Settings &amp; Privacy</span>
                  <span className="dropdown-arrow">›</span>
                </Link>

                <Link to="/support" className="dropdown-item">
                  <span className="dropdown-icon">
                    <i className="fas fa-question-circle"></i>
                  </span>
                  <span>Help &amp; Support</span>
                  <span className="dropdown-arrow">›</span>
                </Link>

                <Link to="/login" className="dropdown-item">
                  <span className="dropdown-icon">
                    <i className="fas fa-sign-out-alt"></i>
                  </span>
                  <span>Logout</span>
                  <span className="dropdown-arrow">›</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HomeNavbar;
