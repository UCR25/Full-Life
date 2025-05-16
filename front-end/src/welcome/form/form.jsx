import { useState } from 'react'
import { useFormStepper } from './useFormStepper'
import { FormPage1 } from './formPage1'

const INITIAL_DATA = {
  displayName: "",
  zip: ""
}

export default function Form() {
  const [data, setData] = useState(INITIAL_DATA)

  function updateFields(fields) {
    setData(prev => {
      return { ...prev, ...fields }
    })
  }

  const {
    steps,
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    back,
    next,
  } = useFormStepper([
    <FormPage1 {...data} updateFields={updateFields}/>
  ])

  function onSubmit(e) {
    e.preventDefault()
    if (!isLastStep) return next()
    alert("Successful Account Creation")
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {step}
        <div>
          {!isFirstStep && (
            <button type="button" onClick={back}>
              Back
            </button>
          )}
          <button type="submit">{isLastStep ? "Finish" : "Next"}</button>
        </div>
      </form>
    </div>
  )
}
