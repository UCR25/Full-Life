import React from 'react';
import './calendar.css';
import CalendarGrid from './calendarGrid.jsx';
import CalendarHeader from './calenderHeader.jsx';

const Calendar = () => {

    const today = new Date();


    return (
        <div className="middle-panel">
            <CalendarHeader/>
            <CalendarGrid year={today.getFullYear()} month={today.getMonth()} />
        </div>
    );
}

export default Calendar; 