// src/utils/userUtils.js

/**
 * Gets the current logged in user's ID
 * @returns {string|null} The user ID or null if no user is logged in
 */
export function getCurrentUserId() {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    // The backend stores the ID as user_id
    return user.user_id || user.userId || user.id || user.sub || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

/**
 * Creates a user-specific storage key
 * @param {string} baseKey - The base key name
 * @returns {string} A user-specific key or the base key if no user is logged in
 */
export function getUserSpecificKey(baseKey) {
  const userId = getCurrentUserId();
  return userId ? `${baseKey}_${userId}` : baseKey;
}
