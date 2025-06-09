// tests/formPage1.test.js
import { describe, it, expect } from 'vitest';
import { validateFormPage } from '../src/form/formPage1';

describe('validateFormPage', () => {
  it('returns true when displayName is valid', () => {
    const data = { displayName: 'Alice' };
    expect(validateFormPage(data)).toBe(true);
  });

  it('returns false when displayName is empty', () => {
    const data = { displayName: '' };
    expect(validateFormPage(data)).toBe(false);
  });

  it('trims whitespace before validating', () => {
    const data = { displayName: '   ' };
    expect(validateFormPage(data)).toBe(false);
  });
});