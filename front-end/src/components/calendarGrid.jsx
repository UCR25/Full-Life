import React, { useState, useEffect} from 'react';
import './calendarGrid.css'; // You can style .calendar-grid and .day-box here
import { onDateChange$ } from './calenderHeader.jsx';

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = () => {
  const [date, setDate] = useState(onDateChange$.value);

  useEffect(() =>
  {
    const sub = onDateChange$.subscribe(setDate);
    return() => sub.unsubscribe();

  },[]);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayIndex = firstDayOfMonth.getDay();

  const boxes = [];

  // Add weekday headers
  weekdayNames.forEach((day, index) => {
    boxes.push(
      <div className="day-header" key={`header-${index}`}>
        {day}
      </div>
    );
  });

  // Add empty slots before first day
  for (let i = 0; i < startDayIndex; i++) {
    boxes.push(<div className="day-box empty" key={`empty-${i}`}></div>);
  }

  // Add day numbers
  for (let day = 1; day <= daysInMonth; day++) {
    boxes.push(
      <div className="day-box" key={day}>
        {day}
      </div>
    );
  }

  return <div className="calendar-grid">{boxes}</div>;
};

export default CalendarGrid;