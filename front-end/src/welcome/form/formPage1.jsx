import { useState } from "react";
import { FormWrapper } from "./formWrapper.jsx";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api.jsx";
import "./formPage1.css";

export default function FormPage1({ googleCredential, updateFields }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogout = () => {
    googleLogout();
    updateFields({ googleCredential: null });
  };

  const resetSession = () => {
    updateFields({ googleCredential: null });
  };

  return (
    <div>
      <FormWrapper title="Google Sign-in">
        <div className="input-group">
          <label>Sign into your Google Account below.</label>
          <div className="google-login-wrapper">
            {googleCredential ? (
              <>
                <p>You are logged in with Google!</p>
                <button
                  onClick={handleLogout}
                  style={{ background: "none", color: "rgb(0, 100, 203)" }}
                >
                  Logout?
                </button>
              </>
            ) : (
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  setError("");
                  updateFields({ googleCredential: credentialResponse });

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
                    googleProfile = jwtDecode(credentialResponse.credential);
                  } catch {
                    setError("Failed to parse auth token.");
                    return;
                  }

                  const userId = googleProfile.sub;

                  // Check if user already exists
                  try {
                    await API.get(`/profiles/by-user/${userId}`);
                    // If user exists, block them from signup
                    setError(
                      "An account already exists for this Google user. Please log in instead."
                    );
                    resetSession();
                  } catch (err) {
                    if (err.response?.status === 404) {
                      // OK: no account exists yet
                    } else {
                      setError("Server error— please try again later.");
                      resetSession();
                    }
                  }
                }}
                onError={() => setError("Sign in failed!")}
                shape="pill"
                cancel_on_tap_outside
                useOneTap
              />
            )}
          </div>
          {error && (
            <p className="error-message" style={{ color: "rgba(255, 0, 0, 1)" }}>
              {error}
            </p>
          )}
        </div>
      </FormWrapper>

      <p className="login-link centering">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export function validateFormPage(data) {
  return !!data.googleCredential;
}
