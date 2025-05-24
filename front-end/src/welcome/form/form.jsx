import { useState } from 'react';
import { useFormStepper } from './useFormStepper.jsx';
import * as FormPage1 from './formPage1.jsx';
import * as FormPage2 from './formPage2.jsx';
import * as FormPage3 from './formPage3.jsx';
import './form.css';

const INITIAL_DATA = {
  displayName: "",
  googleCredential: null,
  hobbies: []
};

export default function Form() {
  const [data, setData] = useState(INITIAL_DATA);

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
  const canContinue = currentValidate 
  ? currentValidate(data) 
  : true;

  function onSubmit(e) {
    e.preventDefault();
    if (!canContinue) return;
    if (!isLastStep) return next();

    alert("Successful Account Creation");
  }

  const StepComponent = formSteps[current].Component;

  return (
    <form onSubmit={onSubmit}>
      <StepComponent {...data} updateFields={updateFields} />
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
