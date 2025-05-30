import React, { useState, useEffect } from "react";
import "./UserHomePage.css";
import HomeNavbar from "../components/home_navbar";
import TodoList from "../components/todo_list";
import Calendar from "../components/calendar";
import EventList from "../components/event_list";
import SimpleProfile from "../components/navbar_info/SimpleProfile";

const UserHomePage = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [profileText, setProfileText] = useState("");
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Toggle profile visibility
    const toggleProfile = () => {
        const next = !showProfile;
        setShowProfile(next);

        if (next) {
            if (user) {
                // Use the profile data from localStorage
                const displayName = user.username || user.name || 'Unknown';
                const email = user.email || 'No email available';
                const hobbies = user.hobbies && user.hobbies.length > 0 
                    ? user.hobbies.join(", ") 
                    : 'No hobbies listed';
                
                setProfileText(
                    `Name: ${displayName}\n` +
                    `Email: ${email}\n` +
                    `Hobbies: ${hobbies}`
                );
            } else {
                setProfileText("No profile data found. Please log in again.");
            }
        }
    };

    return (
        <div className="user-home-container">
            {/* Only show navbar when not showing profile */}
            {!showProfile && <HomeNavbar toggleProfile={toggleProfile} />}
            
            {/* Show profile or main content based on state */}
            {showProfile ? (
                <SimpleProfile goBack={() => setShowProfile(false)} profileText={profileText} />
            ) : (
                <div className="main-content">
                    <TodoList />
                    <Calendar />
                    <EventList />
                </div>
            )}
        </div>
    );
};

export default UserHomePage;