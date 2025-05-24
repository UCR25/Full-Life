import { useState } from "react";
import { FormWrapper } from "./formWrapper.jsx";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

export default function FormPage1({ googleCredential, updateFields }) {
  const handleLogout = () => {
    googleLogout();
    updateFields({ googleCredential: null });
  };

  return (
    <FormWrapper title="Google Sign-in">
      <div className="input-group">
        <label>Sign into your Google Account below.</label>
        <div className="google-login-wrapper">
          {googleCredential ? (
            <>
              <p>You are logged in with Google!</p>
              <button onClick={handleLogout} style={{ background: "none", color: "rgb(0, 100, 203)" }}>Logout?</button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={(credentialResponse) =>
                updateFields({ googleCredential: credentialResponse })
              }
              onError={() => console.log("Login failed!")}
              shape="pill"
              cancel_on_tap_outside={true}
            />
          )}
        </div>
      </div>
    </FormWrapper>
  );
}
export function validateFormPage(data) {
  return !!data.googleCredential;
}