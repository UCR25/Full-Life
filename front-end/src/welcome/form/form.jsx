import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useFormStepper } from './useFormStepper.jsx';
import * as FormPage1 from './formPage1.jsx';
import * as FormPage2 from './formPage2.jsx';
import * as FormPage3 from './formPage3.jsx';
import API from "../../api.jsx";
import './form.css';

export default function Form({ googleCredential, displayName }) {
  const [error, setError] = useState("");
  const [data, setData] = useState({
    displayName: displayName || "",
    googleCredential: googleCredential || null,
    hobbies: []
  });

  // Sync incoming props to internal state
  useEffect(() => {
    setData(prev => ({
      ...prev,
      displayName: displayName || "",
      googleCredential: googleCredential || null
    }));
  }, [displayName, googleCredential]);

  const navigate = useNavigate();

 function navigateToUserHome() {
    navigate("/user-home");
  }


  function updateFields(fields) {
    setData(prev => ({ ...prev, ...fields }));
  }

  const formSteps = [
    {
      Component: FormPage1.default,
      validate: FormPage1.validateFormPage
    },
    {
      Component: FormPage2.default,
      validate: FormPage2.validateFormPage
    },
    {
      Component: FormPage3.default,
      validate: FormPage3.validateFormPage
    }
  ];

  const {
    current,
    step,
    isFirstStep,
    isLastStep,
    back,
    next
  } = useFormStepper(formSteps.map(s => s.Component));

  const currentValidate = formSteps[current].validate;
  const canContinue = currentValidate ? currentValidate(data) : true;

  async function onSubmit(e) {
    e.preventDefault();
    if (!canContinue) return;

    if (!isLastStep) {
      next();
      return;
    }

    const credential = data.googleCredential?.credential;
    if (!credential) {
      alert("Missing Google credentials.");
      return;
    }

    let jwtDecode;
    try {
      const mod = await import("jwt-decode");
      jwtDecode = mod.default ?? mod.jwtDecode ?? mod;
    } catch {
      setError("Server error-- please try again later.");
      return;
    }

    let googleProfile;
    try {
      googleProfile = jwtDecode(credential);
    } catch {
      setError("Server error-- please try again later.");
      return;
    }

    const userId = googleProfile.sub || googleProfile.id;

    const payload = {
      user_id: userId,
      username: data.displayName,
      email: googleProfile.email,
      hobbies: data.hobbies,
      picture: googleProfile.picture,
    };

    try {
      await API.post("/profiles", payload);
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(payload));
      
      // Store a flag in localStorage to indicate we need to redirect after reload
      localStorage.setItem("redirectToUserHome", "true");
      
      // Navigate to the root page first, which should properly handle the redirect
      window.location.href = "/";
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to create account. Try again later.");
    }
  }

  const StepComponent = formSteps[current].Component;

  return (
    <form onSubmit={onSubmit}>
      <StepComponent {...data} updateFields={updateFields} />
      {error && (
        <p className="error-message" style={{ color: "rgba(255, 0, 0, 1)", margin: "1rem auto", textAlign: "center" }}>
          {error}
        </p>
      )}
      <div className="form-nav">
        {!isFirstStep && (
          <button type="button" onClick={back}>
            Back
          </button>
        )}
        <button type="submit" disabled={!canContinue}>
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </form>
  );
}
