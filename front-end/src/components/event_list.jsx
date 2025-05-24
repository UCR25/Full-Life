import React, { useState, useEffect } from 'react';
import './event_list.css';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar } from 'react-icons/fa';

const EventList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userHobbies, setUserHobbies] = useState(['Reading', 'Hiking', 'Cooking', 'Photography']);
    const [filteredEvents, setFilteredEvents] = useState([]);
    
    const eventsData = [
        {
            id: 1,
            title: 'Beach Day',
            location: 'Santa Monica Beach',
            date: '2025-05-25',
            time: '10:00 AM',
            distance: '2.5 miles',
            category: 'Outdoors',
            tags: ['Beach', 'Swimming', 'Sunbathing']
        },
        {
            id: 2,
            title: 'Ice Cream Social',
            location: 'Sweet Treats Parlor',
            date: '2025-05-24',
            time: '3:00 PM',
            distance: '1.2 miles',
            category: 'Food',
            tags: ['Ice Cream', 'Social', 'Dessert']
        },
        {
            id: 3,
            title: 'Book Club Meeting',
            location: 'City Library',
            date: '2025-05-26',
            time: '6:30 PM',
            distance: '3.0 miles',
            category: 'Reading',
            tags: ['Books', 'Discussion', 'Reading']
        },
        {
            id: 4,
            title: 'Mountain Trail Hike',
            location: 'Eagle Rock Trail',
            date: '2025-05-27',
            time: '8:00 AM',
            distance: '5.5 miles',
            category: 'Hiking',
            tags: ['Hiking', 'Nature', 'Exercise']
        },
        {
            id: 5,
            title: 'Cooking Class: Italian Pasta',
            location: 'Culinary Institute',
            date: '2025-05-28',
            time: '5:00 PM',
            distance: '2.8 miles',
            category: 'Cooking',
            tags: ['Cooking', 'Italian', 'Food']
        },
        {
            id: 6,
            title: 'Photography Workshop',
            location: 'Art Center',
            date: '2025-05-29',
            time: '4:00 PM',
            distance: '3.2 miles',
            category: 'Photography',
            tags: ['Photography', 'Art', 'Workshop']
        },
        {
            id: 7,
            title: 'Farmers Market',
            location: 'Downtown Square',
            date: '2025-05-30',
            time: '9:00 AM',
            distance: '1.8 miles',
            category: 'Food',
            tags: ['Shopping', 'Food', 'Local']
        },
        {
            id: 8,
            title: 'Live Music in the Park',
            location: 'Central Park',
            date: '2025-05-31',
            time: '7:00 PM',
            distance: '2.1 miles',
            category: 'Entertainment',
            tags: ['Music', 'Outdoors', 'Entertainment']
        }
    ];

    // Load user hobbies from localStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            // Get hobbies from user data
            // Hobbies are harded for now
        }
        
        setFilteredEvents(eventsData); // show all events at first
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value; // grabs whatever user typed into the search bar
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setFilteredEvents(eventsData);
        } else {
            // events will appear given title, location, category, or tags
            const filtered = eventsData.filter(event => 
                event.title.toLowerCase().includes(value.toLowerCase()) ||
                event.location.toLowerCase().includes(value.toLowerCase()) ||
                event.category.toLowerCase().includes(value.toLowerCase()) ||
                event.tags.some(tag => tag.toLowerCase().includes(value.toLowerCase()))
            );
            setFilteredEvents(filtered);
        }
    };

    // Filter events by tag (clicking on tag buttons)
    const filterByTag = (tag) => {
        if (tag === 'all') {
            setFilteredEvents(eventsData);
            return;
        }
        
        const filtered = eventsData.filter(event => 
            event.category.toLowerCase() === tag.toLowerCase() ||
            event.tags.some(eventTag => eventTag.toLowerCase() === tag.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

    return (
        <div className="right-panel">
            <h2 className="event-list-title">Nearby Events/Places</h2>
            
            {/* Prompt bar */}
            <div className="prompt-container">
                <textarea 
                    className="prompt-input" 
                    placeholder="Ask me anything..." 
                    rows="3"
                ></textarea>
                <button className="prompt-submit-btn">
                    <FaSearch />
                </button>
            </div>
            
            {/* Filter tags */}
            <div className="event-tags-container">
                <button className="event-tag" onClick={() => filterByTag('all')}>All</button>
                {userHobbies.map((hobby, index) => (
                    <button 
                        key={index} 
                        className="event-tag" 
                        onClick={() => filterByTag(hobby)}
                    >
                        {hobby}
                    </button>
                ))}
                <button className="event-tag" onClick={() => filterByTag('nearby')}>Nearby</button>
            </div>
            
            {/* Events list */}
            <div className="events-list">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div 
                            key={event.id} 
                            className="event-card"
                            draggable="true"
                            onDragStart={(e) => {
                                // Set the data to be transferred
                                e.dataTransfer.setData('application/json', JSON.stringify(event));
                                e.currentTarget.classList.add('dragging');
                            }}
                            onDragEnd={(e) => {
                                e.currentTarget.classList.remove('dragging');
                            }}
                        >
                            <div className="event-header">
                                <h3 className="event-title">{event.title}</h3>
                                <span className="event-distance">
                                    <FaMapMarkerAlt /> {event.distance}
                                </span>
                            </div>
                            <div className="event-details">
                                <p className="event-location">
                                    <FaMapMarkerAlt /> {event.location}
                                </p>
                                <p className="event-date">
                                    <FaCalendarAlt /> {event.date} at {event.time}
                                </p>
                            </div>
                            <div className="event-tags">
                                {event.tags.map((tag, idx) => (
                                    <span key={idx} className="event-tag-pill">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-events">
                        <p>No events found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventList