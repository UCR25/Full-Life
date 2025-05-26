import React, { useState } from "react";
import "./UserHomePage.css";
import HomeNavbar from "../components/home_navbar";
import TodoList from "../components/todo_list";
import Calendar from "../components/calendar";
import EventList from "../components/event_list";
import SimpleProfile from "../components/navbar_info/SimpleProfile";

export default function UserHomePage() {
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);

  const toggleProfile = () => {
    const next = !showProfile;

    if (next) {
      // pull fresh user object every time
      const stored = localStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      console.log("📦 loaded from localStorage:", parsed);
      setProfile(parsed);
    }

    setShowProfile(next);
  };

  return (
    <div className="user-home-container">
      <HomeNavbar toggleProfile={toggleProfile} />

      {showProfile ? (
        <SimpleProfile
          goBack={toggleProfile}
          profile={profile}
          error={!profile && "No profile data found. Please log in again."}
        />
      ) : (
        <div className="main-content">
          <TodoList />
          <Calendar />
          <EventList />
        </div>
      )}
    </div>
  );
}