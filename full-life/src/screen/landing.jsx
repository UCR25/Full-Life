import React, { useState } from 'react';
import './landing.css';

const Landing = () => {
  return (
    <>
      <div className='navbar'>
        <div className="title">Full-Life</div>
            <ul>
                {/* change these to buttons */}
                <li>Login</li>  
                <li>Sign Up</li>
            </ul>
      </div>

      <p>Welcome to Full-Life</p>
      <h1>Manage Your Task Efficiently</h1>
      {/* another button that allows login */}
    </>
  )
}

export default Landing
