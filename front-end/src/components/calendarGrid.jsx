import React, { useState, useEffect } from 'react';
import './calendarGrid.css';
import { onDateChange$ } from './calenderHeader.jsx';
import { getUserSpecificKey } from '../utils/userUtils';

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarGrid = () => {
  const [date, setDate] = useState(onDateChange$.value);
  const [calendarEvents, setCalendarEvents] = useState({});
  const [todoTasks, setTodoTasks] = useState([]);

  useEffect(() => {
    const sub = onDateChange$.subscribe(setDate);
    return () => sub.unsubscribe();
  }, []);

  // Load calendar events from localStorage on component mount
  useEffect(() => {
    const calendarKey = getUserSpecificKey('calendarEvents');
    const savedEvents = localStorage.getItem(calendarKey);
    if (savedEvents) {
      setCalendarEvents(JSON.parse(savedEvents));
    }
    
    // Load todo tasks from localStorage
    const todoKey = getUserSpecificKey('todoTasks');
    const savedTasks = localStorage.getItem(todoKey);
    if (savedTasks) {
      setTodoTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Watch for changes in todo tasks
  useEffect(() => {
    const handleStorageChange = () => {
      const todoKey = getUserSpecificKey('todoTasks');
      const savedTasks = localStorage.getItem(todoKey);
      if (savedTasks) {
        setTodoTasks(JSON.parse(savedTasks));
      }
    };

    // Set up interval to check localStorage every second
    const intervalId = setInterval(handleStorageChange, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Save calendar events to localStorage whenever they change
  useEffect(() => {
    const calendarKey = getUserSpecificKey('calendarEvents');
    localStorage.setItem(calendarKey, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayIndex = firstDayOfMonth.getDay();

  // Handle drop event
  const handleDrop = (e, day) => {
    e.preventDefault();
    
    try {
      // Get the event data that was set in the drag start event
      const eventData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Create a date string for the dropped day in YYYY-MM-DD format without timezone issues
      const formattedDay = String(day).padStart(2, '0');
      const formattedMonth = String(month + 1).padStart(2, '0');
      const dateString = `${year}-${formattedMonth}-${formattedDay}`;
      
      // Create a new calendar event
      const calendarEvent = {
        ...eventData,
        calendarDate: dateString,
        originalId: eventData.id,
        id: `cal-${Date.now()}-${eventData.id}` // Create a new unique ID for the calendar event
      };
      
      // Add the event to the calendar events state
      setCalendarEvents(prev => {
        // Create a new object to avoid mutating state
        const newEvents = { ...prev };
        
        // Initialize the array for this date if it doesn't exist
        if (!newEvents[dateString]) {
          newEvents[dateString] = [];
        }
        
        // Add the event to the array for this date
        newEvents[dateString] = [...newEvents[dateString], calendarEvent];
        
        return newEvents;
      });
      
      console.log(`Event ${eventData.title} added to ${dateString}`);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Handle drag over event (needed to allow drops)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

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

  // Add day boxes with drop functionality
  for (let day = 1; day <= daysInMonth; day++) {
    // Create a date string for this day in YYYY-MM-DD format without timezone issues
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    
    // Get events for this day
    const dayEvents = calendarEvents[dateString] || [];
    
    // Get tasks for this day - using only the exact date string match to avoid duplication
    const dayTasks = todoTasks.filter(task => {
      // Only use the exact string match to prevent timezone issues
      return task.date === dateString;
    });

    boxes.push(
      <div 
        className="day-box" 
        key={day}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, day)}
      >
        <div className="day-number">{day}</div>
        
        {/* Render events for this day */}
        <div className="day-events">
          {/* Render tasks first */}
          {dayTasks.map(task => (
            <div 
              key={`task-${task.id}`} 
              className="calendar-event task-event"
              style={{ backgroundColor: task.completed ? 'rgba(76, 175, 80, 0.7)' : 'rgba(33, 150, 243, 0.7)' }}
              title={`${task.text} - ${task.time ? formatTime(task.time) : 'No time set'}`}
            >
              <div className="event-title">{task.text}</div>
              {task.time && <div className="event-time">{formatTime(task.time)}</div>}
            </div>
          ))}
          
          {/* Then render events */}
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className="calendar-event"
              style={{ backgroundColor: getEventColor(event.category) }}
              title={`${event.title} - ${event.time ? formatTime(event.time) : ''}`}
            >
              <div className="event-title">{event.title}</div>
              {event.time && <div className="event-time">{formatTime(event.time)}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Helper function to get a color based on event category
  function getEventColor(category) {
    const colors = {
      'Outdoors': 'rgba(76, 175, 80, 0.7)',  // Green
      'Food': 'rgba(255, 152, 0, 0.7)',       // Orange
      'Reading': 'rgba(33, 150, 243, 0.7)',   // Blue
      'Hiking': 'rgba(121, 85, 72, 0.7)',     // Brown
      'Cooking': 'rgba(244, 67, 54, 0.7)',    // Red
      'Photography': 'rgba(156, 39, 176, 0.7)', // Purple
      'Entertainment': 'rgba(233, 30, 99, 0.7)' // Pink
    };
    
    return colors[category] || 'rgba(158, 158, 158, 0.7)'; // Default gray
  }
  
  // Format time to 12-hour format with AM/PM
  function formatTime(timeString) {
    if (!timeString) return '';
    
    try {
      // Check if the time already includes AM/PM
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString; // Already in the correct format
      }
      
      // Parse the time string (HH:MM format)
      const [hours, minutes] = timeString.split(':');
      
      if (!hours || isNaN(parseInt(hours)) || !minutes || isNaN(parseInt(minutes))) {
        return timeString; // Return original if parsing fails
      }
      
      const hoursNum = parseInt(hours);
      const minutesNum = parseInt(minutes);
      
      // Convert to 12-hour format
      const period = hoursNum >= 12 ? 'PM' : 'AM';
      const hours12 = hoursNum % 12 || 12; // Convert 0 to 12 for midnight
      
      // Return formatted time
      return `${hours12}:${minutesNum.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString; // Return original on error
    }
  }

  return (
    <div className="calendar-grid">{boxes}</div>
  );
};

export default CalendarGrid