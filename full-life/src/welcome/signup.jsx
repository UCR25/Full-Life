import React, { useState , useNavigate} from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout} from '@react-oauth/google';
import './signup.css';
import logo  from '../assets/logov3.png';

const Signup = () => {
    const [displayName, setDisplayName] = useState("");
    const [ZIP, setZIP] = useState("");
    const [errors, setErrors] = useState({
        displayName: "",
        zipCode: "",
        google: ""
      });
    const [googleCredential, setGoogleCredential] = useState(null);
    
    const handleLogout = () => {
        googleLogout();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = { displayName: "", zipCode: "", google: "" };
      
        if (!displayName.trim()) newErrors.displayName = "Display name is required.";
        if (!ZIP.trim()) newErrors.zipCode = "ZIP code is required.";
        if (!googleCredential) newErrors.google = "You must login with your Google Account to sign up.";
      
        setErrors(newErrors);
      
        if (Object.values(newErrors).every(err => err === "")) {
          
        }
      };
  return (
        <div className="background">
            <div className="textPanel">
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="floating-dot"></div>
                <div className="logo-container">
                    <div className="orb-wrapper">
                        <div className="orb-circle clockwise" style={{ transform: "rotate(0deg) translateX(40px)", animation: "rotate-clockwise 12s linear infinite" }}></div>
                        <div className="orb-circle counterclockwise" style={{ transform: "rotate(0deg) translateX(60px)", animation: "rotate-counterclockwise 20s linear infinite" }}></div>
                        <div className="orb-circle clockwise" />
                        <div className="orb-circle counterclockwise" />
                    </div>
                    <img src={logo} alt="Full-Life Logo" className="logo" />
                    </div>
                <h1>Welcome👋</h1>
                <h3>Ready to lead a Full-Life?</h3>
            </div>
            <div className="formPanel">
                <h2>Get Started!</h2>
                <form onSubmit={handleSubmit}>
                    <p>Display Name</p>
                    <input
                        type="text"
                        placeholder="Enter display name"
                        value={displayName}
                        onChange={(e)=>setDisplayName(e.target.value)}
                        required={true}
                        className="signup-field"
                    ></input>
                    {errors.displayName && <div className="errorMessage">{errors.displayName}</div>}
                    <p>ZIP Code</p>
                    <input
                        type="number"
                        placeholder="Enter ZIP Code"
                        value={ZIP}
                        onChange={(e)=>setZIP(e.target.value)}
                        required={true}
                        className="signup-field"
                        /*pattern prop can be used w/ regex to test if form is right */
                    ></input>
                    {errors.zipCode && <div className="errorMessage">{errors.zipCode}</div>}
                    <div className="google-login-wrapper">
                    {googleCredential 
                    ? <p>You are logged in with Google!</p>
                    : <GoogleLogin 
                        onSuccess={(credentialResponse) => setGoogleCredential(credentialResponse)}
                        onError={() => console.log("Login failed!")}
                        shape="pill"
                        cancel_on_tap_outside={true}
                        />
                    }
                    </div>
                    {errors.google && <div className="errorMessage">{errors.google}</div>}
                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={!(
                            displayName.trim() && 
                            ZIP.trim() && 
                            googleCredential
                        )}>
                        Create Account
                        </button>
                    {/*<div className="errorMessage submitButton"/>*/}
                </form>
            </div>
        </div>
  )
}

export default Signup
