import React, { useState, useEffect } from 'react';
import './event_list.css';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaSpinner } from 'react-icons/fa';
import { getUserSpecificKey } from '../utils/userUtils';

const EventList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userHobbies, setUserHobbies] = useState(['Reading', 'Hiking', 'Cooking', 'Photography']);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState('');
    
    useEffect(() => {
        // Load user hobbies from localStorage if available
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const userProfile = JSON.parse(userData);
                if (userProfile.hobbies && Array.isArray(userProfile.hobbies)) {
                    setUserHobbies(userProfile.hobbies);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
        
        fetchEvents('fun events this weekend');
    }, []);
    
    // Function to fetch events from the backend API only
    const fetchEvents = async (userPrompt) => {
        setLoading(true);
        setError(null);
        console.log('Fetching events from API for:', userPrompt);
        
        try {
            let userId = '1';
            let lat = 34.0549;
            let lon = -118.2437;
            
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const userProfile = JSON.parse(userData);
                    if (userProfile.id || userProfile.userId || userProfile.sub || userProfile._id) {
                        userId = userProfile.id || userProfile.userId || userProfile.sub || userProfile._id;
                    }
                    
                    if (userProfile.latitude && userProfile.longitude) {
                        lat = userProfile.latitude;
                        lon = userProfile.longitude;
                    }
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                }
            }
            
            const requestBody = {
                user_ID: userId,
                lat: lat,
                lon: lon,
                prompt: userPrompt,
                user_date_time: new Date().toISOString()
            };
            
            console.log('Sending request to backend:', requestBody);
            
            // Make the API request
            const response = await fetch('http://localhost:8000/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('API response:', data);
            
            if (data.event_lists && data.event_lists.length > 0) {
                const apiEvents = [];
                let eventId = 1;
                
                data.event_lists.forEach(eventList => {
                    if (eventList.events && Array.isArray(eventList.events)) {
                        eventList.events.forEach(event => {
                            // Convert the API event format to our app's format
                            const eventDate = event.startTime ? new Date(event.startTime) : new Date();
                            const formattedDate = eventDate.toISOString().split('T')[0];
                            const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            // Check for duplicate events (same name and location)
                            const isDuplicate = apiEvents.some(e => 
                                e.title === (event.name || 'Untitled Event') && 
                                e.location === (event.address || 'No location')
                            );
                            
                            if (!isDuplicate) {
                                apiEvents.push({
                                    id: event._id || eventId++,
                                    title: event.name || 'Untitled Event',
                                    location: event.address || 'No location',
                                    date: formattedDate,
                                    time: formattedTime,
                                    distance: event.distance || Math.floor(Math.random() * 10) + 0.5 + ' miles',
                                    category: event.categories && event.categories.length > 0 ? event.categories[0] : 'General',
                                    tags: event.categories || ['Event'],
                                    description: event.description || '',
                                    isHighlighted: true,
                                    relevanceScore: 1
                                });
                            }
                        });
                    }
                });
                
                console.log('Processed events from API:', apiEvents);
                
                if (apiEvents.length > 0) {
                    setEvents(apiEvents);
                    setFilteredEvents(apiEvents);
                } else {
                    // No events found
                    setEvents([]);
                    setFilteredEvents([]);
                }
            } else {
                // No event lists in response
                setEvents([]);
                setFilteredEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
            setFilteredEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === '') {
            setFilteredEvents(events);
        } else {
            const searchTerms = value.toLowerCase().split(' ').filter(term => term.length > 0);
            
            const filtered = events.filter(event => {
                return searchTerms.some(term => 
                    event.title.toLowerCase().includes(term) ||
                    event.location.toLowerCase().includes(term) ||
                    event.category.toLowerCase().includes(term) ||
                    event.tags.some(tag => tag.toLowerCase().includes(term)) ||
                    (event.description && event.description.toLowerCase().includes(term))
                );
            });
            
            setFilteredEvents(filtered);
        }
    };
    
    // Handle prompt input change
    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };
    
    // Handle prompt submission
    const handlePromptSubmit = () => {
        if (prompt.trim()) {
            console.log('Submitting prompt:', prompt.trim());
            fetchEvents(prompt.trim());
        } else {
            console.log('Empty prompt, fetching default events');
            fetchEvents('fun events this weekend');
        }
    };
    
    // Handle Enter key in prompt input
    const handlePromptKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            handlePromptSubmit();
        }
    };

    const filterByTag = (tag) => {
        if (tag === 'all') {
            setFilteredEvents(events);
            return;
        }
        
        const filtered = events.filter(event => 
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
                    value={prompt}
                    onChange={handlePromptChange}
                    onKeyDown={handlePromptKeyDown}
                ></textarea>
                <button 
                    className="prompt-submit-btn" 
                    onClick={handlePromptSubmit}
                    disabled={loading}
                >
                    {loading ? <FaSpinner className="spinner" /> : <FaSearch />}
                </button>
            </div>
            
            {/* Error message */}
            {error && (
                <div className="error-message">
                    <p>Error: {error}</p>
                </div>
            )}
            
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
                {filteredEvents.length === 0 ? (
                    <div className="no-events">
                        <p>No events found matching your search.</p>
                    </div>
                ) : (
                    filteredEvents.map(event => (
                        <div 
                            key={event.id} 
                            className={`event-card ${event.isHighlighted ? 'event-card-highlighted' : ''}`}
                            draggable
                            onDragStart={(e) => {
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
                                {event.description && (
                                    <p className="event-description">{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</p>
                                )}
                            </div>
                            <div className="event-tags">
                                {event.tags.map((tag, idx) => (
                                    <span key={idx} className="event-tag-pill">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default EventList