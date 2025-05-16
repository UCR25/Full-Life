import React, { useEffect, useRef } from 'react';
import './Stars.css';

const Stars = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    const createStars = () => {
      const starsContainer = starsRef.current;
      if (!starsContainer) return;

      starsContainer.innerHTML = '';
      
      // Create regular stars
      const numStars = 50;
      for (let i = 0; i < numStars; i++) {
        // a div element created for each star
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        const size = 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        star.style.animationDelay = `${Math.random() * 2}s`;
        
        // newly created div appended to starsContainer
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  return <div ref={starsRef} className="stars"></div>;
};

export default Stars