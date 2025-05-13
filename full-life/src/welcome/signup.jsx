import React, { useState , useNavigate} from 'react';
import { GoogleLogin, googleLogout} from '@react-oauth/google';
import './signup.css';
import logo  from '../assets/logov3.png';
import FocusBubble from './focusBubble';

const Signup = () => {
    const [displayName, setDisplayName] = useState("");
    const [ZIP, setZIP] = useState("");
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
    <section className="body">
        <section className="title-panel flex padding4">
            {/* Back Button*/}
            <div className="logo-wrapper flex">
                <img src={logo} alt="Full-Life Logo" className="logo" />
                <FocusBubble className="focus-bubble"/>
            </div>
            <h1 className="text-xl font-bold">Welcome👋</h1>
            <h2 className="text-lg accent">Ready to lead a Full-Life?</h2>
        </section>
        <section className="form-panel">
            <div className="form-wrapper">
                <h2 className="text-md font-regular form-prompt"></h2>
                <form onSubmit={handleSubmit}>
                    <input></input>
                    {/* Next button */}
                </form>
            </div>
        </section>
    </section>
    )
}

export default Signup
