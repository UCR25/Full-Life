import React from "react";
import "./UserHomePage.css";
import HomeNavbar from "../components/home_navbar";
import TodoList from "../components/todo_list";
import Calendar from "../components/calendar";
import EventList from "../components/event_list";

const UserHomePage = () => {
    return (
        <div>
            <HomeNavbar />
            <TodoList />
            <Calendar />
            <EventList />
        </div>
    );
}

export default UserHomePage