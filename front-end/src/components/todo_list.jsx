import React, { useState, useEffect } from 'react';
import './todo_list.css';
import { FaPlus, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { getUserSpecificKey } from '../utils/userUtils';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    
    // Load tasks from localStorage on component mount
    useEffect(() => {
        const storageKey = getUserSpecificKey('todoTasks');
        const savedTasks = localStorage.getItem(storageKey);
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);
    
    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        const storageKey = getUserSpecificKey('todoTasks');
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }, [tasks]);
    
    // Add a new task
    const addTask = () => {
        if (newTask.trim() === '') return;
        
        const task = {
            id: Date.now(),
            text: newTask,
            date: newDate || new Date().toISOString().split('T')[0], // Default to today if no date selected
            time: newTime,
            completed: false
        };
        
        setTasks([...tasks, task]);
        setNewTask('');
        setNewDate('');
        setNewTime('');
    };
    
    // Toggle task completion status
    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };
    
    // Delete a task
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };
    
    // Handle key press in input field
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        // Parse the date parts to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        
        // Create date with local timezone (months are 0-indexed in JS Date)
        const date = new Date(year, month - 1, day);
        
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };
    
    // Format time to 12-hour format with AM/PM
    const formatTime = (timeString) => {
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
    };
    
    return (
        <div className="left-panel">
            <h2 className="todo-title">My Tasks</h2>
            
            {/* Add new task form */}
            <div className="add-task-container">
                <div className="task-input-container">
                    <input 
                        type="text" 
                        className="task-input" 
                        placeholder="Add a new task..." 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
                
                <div className="task-details-container">
                    <div className="task-date-container">
                        <FaCalendarAlt className="date-icon" />
                        <input 
                            type="date" 
                            className="date-input" 
                            placeholder="Set date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="task-time-container">
                        <FaClock className="time-icon" />
                        <input 
                            type="time" 
                            className="time-input" 
                            placeholder="Set time (optional)"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                        />
                    </div>
                </div>
                
                <button className="add-task-btn" onClick={addTask}>
                    <FaPlus /> Add Task
                </button>
            </div>
            
            {/* Tasks list */}
            <div className="tasks-container">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div 
                            key={task.id} 
                            className={`task-item ${task.completed ? 'completed' : ''}`}
                        >
                            <div className="task-checkbox-container">
                                <input 
                                    type="checkbox" 
                                    className="task-checkbox" 
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)}
                                />
                                <span className="task-text">{task.text}</span>
                            </div>
                            
                            <div className="task-details">
                                {task.date && (
                                    <div className="task-date">
                                        <FaCalendarAlt /> {formatDate(task.date)}
                                    </div>
                                )}
                                
                                {task.time && (
                                    <div className="task-time">
                                        <FaClock /> {formatTime(task.time)}
                                    </div>
                                )}
                                
                                <button 
                                    className="delete-task-btn" 
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">
                        <p>No tasks yet. Add a task to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList