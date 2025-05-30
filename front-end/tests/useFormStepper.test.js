// tests/useFormStepper.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useFormStepper } from '../src/welcome/form/useFormStepper.jsx';

describe('useFormStepper', () => {
  const steps = ['a', 'b', 'c'];

  it('initializes with first step', () => {
    const { result } = renderHook(() => useFormStepper(steps));
    expect(result.current.current).toBe(0);
    expect(result.current.step).toBe('a');
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
  });

  it('navigates next and back correctly', () => {
    const { result } = renderHook(() => useFormStepper(steps));

    act(() => result.current.next());
    expect(result.current.current).toBe(1);

    act(() => result.current.back());
    expect(result.current.current).toBe(0);
  });

  it('does not go beyond bounds', () => {
    const { result } = renderHook(() => useFormStepper(steps));

    act(() => result.current.back()); // already at 0
    expect(result.current.current).toBe(0);

    act(() => result.current.goTo(5)); // invalid
    expect(result.current.current).toBe(0);

    act(() => result.current.goTo(2));
    expect(result.current.current).toBe(2);

    act(() => result.current.next()); // max step
    expect(result.current.current).toBe(2);
  });
});
