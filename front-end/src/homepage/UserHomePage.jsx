import React, { useState } from "react";
import "./UserHomePage.css";
import HomeNavbar from "../components/home_navbar";
import TodoList from "../components/todo_list";
import Calendar from "../components/calendar";
import EventList from "../components/event_list";
import SimpleProfile from "../components/navbar_info/SimpleProfile";

const UserHomePage = () => {
    const [showProfile, setShowProfile] = useState(false);

    // Toggle profile visibility
    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className="user-home-container">
            {/* <HomeNavbar toggleProfile={toggleProfile} /> */}
            {!showProfile && <HomeNavbar toggleProfile={toggleProfile} />}
            
            {/* Show profile or main content based on state */}
            {showProfile ? (
                <SimpleProfile goBack={() => setShowProfile(false)} />
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

export default UserHomePage