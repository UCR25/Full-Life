import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIosNew } from 'react-icons/md';
import idkLogo from '../assets/calendar1.png';
import Stars from './Stars';
import { saveUserProfile, clearUserProfile } from '../utils/storage';
import API from '../api.jsx';

const Login = () => {
  const navigate = useNavigate()

  function handleLogin() {
    googleLogout();
    clearUserProfile();
  }

  return (
    <div className="login-container">
      <Stars />
      <div className="login-card">
        <div className="login-left">
          <div className="back-button" onClick={() => navigate('/')}>
            <MdArrowBackIosNew size={18} />
            <span>BACK</span>
          </div>
          <h1>Full-Life</h1>
          <img className='loginLogo' src={idkLogo} alt='Project Logo' />
          <p1>Live life to the fullest</p1>
        </div>
        
        <div className="login-right">
          
          <h1>Welcome Back 👋</h1>
          <p>Sign in with your Google account</p>
          
          <div className="google-btn-container">
            <GoogleLogin 
              onSuccess={(credentialResponse) => {
                const googleProfile = jwtDecode(credentialResponse.credential);
                
                // Get the user ID from Google Auth (sub field)
                const userId = googleProfile.sub;
                
                // Try to fetch the user profile from the backend
                API.get(`/profiles/by-user/${userId}`)
                  .then(res => {
                    // Backend profile found - combine with Google profile data
                    const combinedProfile = {
                      ...googleProfile,
                      username: res.data.username,
                      hobbies: res.data.hobbies,
                      user_id: userId
                    };
                    
                    // Save the combined profile to localStorage
                    saveUserProfile(combinedProfile);
                    localStorage.setItem('user', JSON.stringify(combinedProfile));
                    navigate('/user-home');
                  })
                  .catch(error => {
                    // If profile not found, just use Google profile data
                    const basicProfile = {
                      ...googleProfile,
                      username: googleProfile.name,
                      hobbies: [],
                      user_id: userId
                    };
                    saveUserProfile(basicProfile);
                    localStorage.setItem('user', JSON.stringify(basicProfile));
                    navigate('/user-home');
                  });
              }}
              onError={() => { console.log('Login Failed'); }}
              auto_select={true} // allows users to stay logged in

              useOneTap
              type="standard"
              theme="filled_black"
              text="signin_with"
              shape="rectangular"
              size="large"
            />
          </div>
          
          <p className="register-link">
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login