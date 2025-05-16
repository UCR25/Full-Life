import { useState } from "react"

export function useFormStepper(steps) {
  const [current, setCurrent] = useState(0)

  function next() {
    setCurrent(i => (
        i >= steps.length - 1 
        ? i 
        : i + 1
    ))
  }

  function back() {
    setCurrent(i => (
        i <= 0 
        ? i 
        : i - 1
    ))
  }

  function goTo(index) {
    if (index >= 0 && index < steps.length) {
      setCurrent(index)
    }
  }

  return {
    current,
    step: steps[current],
    steps,
    isFirstStep: current === 0,
    isLastStep: current === steps.length - 1,
    goTo,
    next,
    back,
  }
}
