import { useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useFormStepper } from './useFormStepper.jsx';
import * as FormPage1 from './formPage1.jsx';
import * as FormPage2 from './formPage2.jsx';
import * as FormPage3 from './formPage3.jsx';
import API from "../../api.jsx"
import './form.css';

const INITIAL_DATA = {
  displayName: "",
  googleCredential: null,
  hobbies: []
};

export default function Form() {
  const [error, setError] = useState("");
  const [data, setData] = useState(INITIAL_DATA);
  const navigate = useNavigate();

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
    if (!isLastStep) return next();

    // Final step logic
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

    // 1a-1b
    const userId = googleProfile.sub;
    console.log("User:", userId);

    // 2
    const payload = {
      user_id: userId,
      username: googleProfile.name,
      email: googleProfile.email,
      hobbies: data.hobbies,
      picture: googleProfile.picture,
    };
    // 3-4
    try {
      await API.post("/profiles", payload);
      localStorage.setItem("user", JSON.stringify(payload));
      navigate("/user-home");
    } catch (err) {
      setError("Failed to create account. Try again later.");
    }
  }

  const StepComponent = formSteps[current].Component;

  return (
    <form onSubmit={onSubmit}>
      <StepComponent {...data} updateFields={updateFields} />
      {error && <p className="error-message" style={{color:"rgba(255, 0, 0, 1)", margin: "1rem auto", textAlign: "center"}}>{error}</p>}
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
