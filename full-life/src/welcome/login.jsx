import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import idkLogo from '../assets/calendar1.png';
import Stars from './Stars';

const Login = () => {
  const navigate = useNavigate()

  function handleLogin() {
    googleLogout()
  }

  return (
    <div className="login-container">
      <Stars />
      <div className="login-card">
        <div className="login-left">
          <h1>Full-Life</h1>
          <img className='logo' src={idkLogo} alt='Project Logo' />
          <p>Live life to the fullest</p>
        </div>
        
        <div className="login-right">
          
          <h1>Welcome Back 👋</h1>
          <p>Sign in with your Google account</p>
          
          <div className="google-btn-container">
            <GoogleLogin 
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse.credential);
                console.log(jwtDecode(credentialResponse.credential));
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