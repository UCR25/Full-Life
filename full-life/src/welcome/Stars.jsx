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

      // Create shooting stars
      const numShootingStars = 3;
      for (let i = 0; i < numShootingStars; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        const startTop = Math.random() * 40;
        const startRight = Math.random() * 20;
        
        shootingStar.style.top = `${startTop}%`;
        shootingStar.style.right = `${startRight}%`;
        
        shootingStar.style.animationDelay = `${i * 3 + Math.random() * 2}s`;
        
        starsContainer.appendChild(shootingStar);
      }
    };

    createStars();
  }, []);

  return <div ref={starsRef} className="stars"></div>;
};

export default Stars
