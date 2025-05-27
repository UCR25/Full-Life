import React, { useState , useNavigate} from 'react';
import { GoogleLogin, googleLogout} from '@react-oauth/google';
import './signup.css';
import '../global.css';
import logo  from '../assets/logov3.png';
import FocusBubble from './focusBubble';
import Stars from './Stars';
import Form from './form/form';

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
    <div className="page">
        <Stars/>
        <section className="body">
            <section className="title-panel flex">
                {/* Back Button*/}
                <h1 className="padding4 pageTitle">Full-Life</h1>
                <div className="logo-wrapper flex">
                    <img src={logo} alt="Full-Life Logo" className="welcomeLogo" />
                    <FocusBubble className="focus-bubble"/>
                </div>
                <div className="title-text centering">
                    <h1 className="text-xl font-bold">Welcome👋</h1>
                    <h2 className="text-lg font-regular">Live life to the fullest.</h2>
                </div>
            </section>
            <section className="form-panel">
                <Form/>
            </section>
        </section>
    </div>
    )
}

export default Signup
