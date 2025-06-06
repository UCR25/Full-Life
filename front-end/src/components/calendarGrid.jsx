import React, { useState, useEffect } from 'react';
import './calendarGrid.css';
import { onDateChange$ } from './calenderHeader.jsx';
import { getUserSpecificKey } from '../utils/userUtils';
import { FaTrash } from 'react-icons/fa';

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
        
        // Check if an event with the same original ID already exists on this date
        const eventExists = newEvents[dateString].some(event => 
          event.originalId === eventData.id && event.title === eventData.title
        );
        
        if (!eventExists) {
          // Only add the event if it doesn't already exist
          newEvents[dateString] = [...newEvents[dateString], calendarEvent];
          
          // Save to localStorage
          const storageKey = getUserSpecificKey('calendarEvents');
          localStorage.setItem(storageKey, JSON.stringify(newEvents));
          
          // Also add the event to the to-do list
          addEventToTodoList(eventData, dateString);
          
          console.log(`Event ${eventData.title} added to ${dateString}`);
        } else {
          console.log(`Event ${eventData.title} already exists on ${dateString}`);
        }
        
        return newEvents;
      });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  // Function to add an event to the to-do list
  const addEventToTodoList = (eventData, dateString) => {
    try {
      console.log('Adding event to todo list:', eventData);
      
      // Get the current to-do tasks from localStorage
      const todoKey = getUserSpecificKey('todoTasks');
      console.log('Todo key:', todoKey);
      
      const savedTasks = localStorage.getItem(todoKey);
      console.log('Saved tasks:', savedTasks);
      
      let todoTasks = savedTasks ? JSON.parse(savedTasks) : [];
      console.log('Parsed todo tasks:', todoTasks);
      
      // Create a new to-do task from the event data
      const todoTask = {
        id: `todo-${Date.now()}-${eventData.id}`,
        text: eventData.title || 'Untitled Event',
        date: dateString,
        time: eventData.time || '',
        completed: false,
        fromEvent: true,  // Mark that this task was created from an event
        category: eventData.category || '',
        location: eventData.location || '',
        eventId: eventData.id  // Reference to the original event
      };
      
      console.log('Created todo task:', todoTask);
      
      // Add the new task to the to-do list
      todoTasks = [...todoTasks, todoTask];
      
      // Save the updated to-do list back to localStorage
      localStorage.setItem(todoKey, JSON.stringify(todoTasks));
      console.log('Updated todo tasks in localStorage:', todoTasks);
      
      // Force a refresh of the todo list by dispatching a custom event
      window.dispatchEvent(new CustomEvent('todoListUpdated'));
      
      console.log(`Event "${todoTask.text}" added to to-do list for ${dateString}`);
    } catch (error) {
      console.error('Error adding event to todo list:', error);
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
    // Filter out tasks that were created from events to prevent duplication
    const dayTasks = todoTasks.filter(task => {
      // Only use the exact string match to prevent timezone issues
      // And exclude tasks that were created from events (they have fromEvent=true)
      return task.date === dateString && !task.fromEvent;
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
              draggable="true"
              data-id={event.id}
              data-date={dateString}
              onDragStart={(e) => {
                // Set the data to be transferred
                e.dataTransfer.setData('application/json', JSON.stringify({
                  ...event,
                  calendarDate: dateString
                }));
                e.currentTarget.classList.add('dragging');
              }}
              onDragEnd={(e) => {
                e.currentTarget.classList.remove('dragging');
              }}
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
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString; 
      }
      
      const [hours, minutes] = timeString.split(':');
      
      if (!hours || isNaN(parseInt(hours)) || !minutes || isNaN(parseInt(minutes))) {
        return timeString; 
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

  // Handle trash can drag over
  const handleTrashDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelector('.trash-can').classList.add('drag-over');
  };

  // Handle trash can drag leave
  const handleTrashDragLeave = () => {
    document.querySelector('.trash-can').classList.remove('drag-over');
  };

  // Handle drop on trash can
  const handleTrashDrop = (e) => {
    e.preventDefault();
    document.querySelector('.trash-can').classList.remove('drag-over');
    
    try {
      // Get the event data that was set in the drag start event
      const eventData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (eventData.calendarDate) {
        setCalendarEvents(prev => {
          const newEvents = { ...prev };
          
          // Filter out the event with the matching ID
          if (newEvents[eventData.calendarDate]) {
            newEvents[eventData.calendarDate] = newEvents[eventData.calendarDate].filter(
              event => event.id !== eventData.id
            );
            
            // If there are no more events for this date, remove the date entry
            if (newEvents[eventData.calendarDate].length === 0) {
              delete newEvents[eventData.calendarDate];
            }
          }
          
          return newEvents;
        });
        
        console.log(`Event ${eventData.title} removed from calendar`);
      }
    } catch (error) {
      console.error('Error handling trash drop:', error);
    }
  };

  // Make calendar events draggable
  const makeEventsDraggable = () => {
    const calendarEvents = document.querySelectorAll('.calendar-event');
    
    calendarEvents.forEach(event => {
      if (event.getAttribute('draggable') === 'true') return;
      
      event.setAttribute('draggable', 'true');
      
      event.addEventListener('dragstart', (e) => {
        const eventId = event.getAttribute('data-id');
        const eventDate = event.getAttribute('data-date');
        
        const eventData = calendarEvents[eventDate]?.find(ev => ev.id === eventId);
        
        if (eventData) {
          // Set the data to be transferred
          e.dataTransfer.setData('application/json', JSON.stringify(eventData));
          event.classList.add('dragging');
        }
      });
      
      // Add drag end event listener
      event.addEventListener('dragend', (e) => {
        event.classList.remove('dragging');
      });
    });
  };

  useEffect(() => {
    // Use setTimeout to ensure the DOM has been updated
    const timeoutId = setTimeout(() => {
      makeEventsDraggable();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [calendarEvents]);

  return (
    <div className="calendar-grid-container">
      <div className="trash-can-container">
        <div 
          className="trash-can" 
          onDragOver={handleTrashDragOver}
          onDragLeave={handleTrashDragLeave}
          onDrop={handleTrashDrop}
          title="Drag events here to delete"
        >
          <FaTrash />
        </div>
      </div>
      <div className="calendar-grid">{boxes}</div>
    </div>
  );
};

export default CalendarGrid
