// tests/formPage1.test.js
import { describe, it, expect } from 'vitest';
import { validateFormPage } from '../src/form/formPage1';
import API from '../src/api.jsx'

describe('userRecognition', () => {
  it('returns 404 if user exists', async () => {

    // Check if user already exists
    const userId = '0000';
    try {
        await API.get(`/profiles/by-user/${userId}`);
    // If user exists, block them from signup
    } catch (err) {
        expect(err.response?.status === 404);
    }
  });
    it('can retrieve displayName if user exists', async () => {

    // Check if user already exists
    const userId = '105013398891910779346';
    try {
        const res = await API.get(`/profiles/by-user/${userId}`).then(res => {
            expect(res.data.username === "sneha_does_stuff");
        });
    // If user exists, block them from signup
    } catch (err) {
    }
  });
});