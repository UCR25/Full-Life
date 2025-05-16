// src/utils/storage.ts

// key for the saved, completed profile
const PROFILE_KEY = 'currentUserProfile';

export function saveUserProfile(profile: Record<string, any>) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadUserProfile(): Record<string, any> | null {
  const json = localStorage.getItem(PROFILE_KEY);
  return json ? JSON.parse(json) : null;
}

export function clearUserProfile() {
  localStorage.removeItem(PROFILE_KEY);
}
