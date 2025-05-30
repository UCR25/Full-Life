// src/pages/Login.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { MdArrowBackIosNew } from "react-icons/md";
import idkLogo from "../assets/calendar1.png";
import Stars from "./Stars";
import API from "../api.jsx";
import { clearUserProfile } from "../utils/storage";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Clears session/token and only our 'user' key
  const resetSession = () => {
    googleLogout();
    clearUserProfile();
    localStorage.removeItem("user");
  };

  return (
    <div className="login-container">
      <Stars />
      <div className="login-card">
        <div className="login-left">
          <div className="back-button" onClick={() => navigate("/")}>
            <MdArrowBackIosNew size={18} />
            <span>BACK</span>
          </div>
          <h1>Full-Life</h1>
          <img className="loginLogo" src={idkLogo} alt="Project Logo" />
          <p>Live life to the fullest</p>
        </div>

        <div className="login-right">
          <h1>Welcome Back 👋</h1>
          <p>Sign in with your Google account</p>

          {error && <p className="error-text">{error}</p>}

          <div className="google-btn-container">
            <GoogleLogin
              onClick={resetSession}
              onSuccess={async ({ credential }) => {
                setError("");
                resetSession();

                // dynamic-import jwt-decode so Vite/Rollup won't choke
                let jwtDecode;
                try {
                  const mod = await import("jwt-decode");
                  jwtDecode = mod.default ?? mod.jwtDecode ?? mod;
                } catch {
                  setError("Could not load token decoder.");
                  return;
                }

                let googleProfile;
                try {
                  googleProfile = jwtDecode(credential);
                } catch {
                  setError("Failed to parse auth token.");
                  return;
                }

                const userId = googleProfile.sub;

                // 1) Check in our DB
                API.get(`/profiles/by-user/${userId}`)
                  .then((res) => {
                    // 2a) Found → persist & navigate
                    const backendProfile = res.data;
                    localStorage.setItem("user", JSON.stringify(backendProfile));
                    navigate("/user-home");
                  })
                  .catch((err) => {
                    if (err.response?.status === 404) {
                      setError(
                        "No account found for this Google user. Please sign up first."
                      );
                    } else {
                      setError("Server error—please try again later.");
                    }
                    // clean up any leftover
                    resetSession();
                  });
              }}
              onError={() => {
                setError("Google sign-in failed. Please try again.");
              }}
              auto_select
              useOneTap
              type="standard"
              theme="filled_black"
              text="signin_with"
              shape="rectangular"
              size="large"
            />
          </div>

          <p className="register-link">
            Don’t have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
