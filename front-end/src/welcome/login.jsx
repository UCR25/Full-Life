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
          <div className="back-button" onClick={() => navigate(-1)}>
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
                console.log(credentialResponse.credential);
                const userProfile = jwtDecode(credentialResponse.credential);
                console.log(userProfile);
                
                saveUserProfile(userProfile);
                localStorage.setItem('user', JSON.stringify(userProfile));
                navigate('/user-home');
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