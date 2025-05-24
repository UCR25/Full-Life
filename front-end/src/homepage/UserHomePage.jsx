// src/pages/UserHomePage.jsx

import React, { useState } from "react";
import API from "../api.jsx";
import "./UserHomePage.css";
import HomeNavbar from "../components/home_navbar";
import TodoList from "../components/todo_list";
import Calendar from "../components/calendar";
import EventList from "../components/event_list";

const TEST_USER_ID = "105013398891910779346";

export default function UserHomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const [profileText, setProfileText] = useState("");

  const toggleProfile = () => {
    const next = !showProfile;
    setShowProfile(next);

    if (next) {
      API.get(`/profiles/by-user/${TEST_USER_ID}`)
        .then((res) => {
          const p = res.data;
          setProfileText(
            `Name: ${p.username}\n` +
            `Email: ${p.email}\n` +
            `Hobbies: ${p.hobbies.join(", ")}`
          );
        })
        .catch(() => setProfileText("Failed to load profile."));
    }
  };

  return (
    <div className="user-home-container">
      <HomeNavbar toggleProfile={toggleProfile} />

      {showProfile && (
        <div className="profile-box">
          <button className="back-btn" onClick={toggleProfile}>
            ← Back
          </button>
          {/* Debug-friendly box to ensure visibility */}
          <pre
            style={{
              background: "yellow",
              color: "black",
              padding: "1rem",
              whiteSpace: "pre-wrap",
              border: "2px solid red",
              maxWidth: "400px",
              margin: "1rem auto",
            }}
          >
            {profileText}
          </pre>
        </div>
      )}

      {!showProfile && (
        <div className="main-content">
          <TodoList />
          <Calendar />
          <EventList />
        </div>
      )}
    </div>
  );
}
