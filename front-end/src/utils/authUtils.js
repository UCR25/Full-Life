import { googleLogout } from '@react-oauth/google';

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null && user !== undefined;
};

export const logoutUser = () => {
  googleLogout();
  
  // Clear all user data from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('redirectToUserHome');
  
  // Clear any user-specific data
  const userKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('todoTasks_') || key.includes('calendarEvents_'))) {
      userKeys.push(key);
    }
  }
  
  // Remove all user-specific keys
  userKeys.forEach(key => localStorage.removeItem(key));
  return true;
};

export const redirectToLogin = (navigate, message) => {
  if (message) {
    sessionStorage.setItem('loginMessage', message);
  }
  navigate('/login');
};
