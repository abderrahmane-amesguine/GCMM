/**
 * Generate a unique session ID for the current browser tab
 * @returns {string} A unique session ID
 */
export const generateSessionId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Get the current session ID or create a new one
 * @returns {string} The current session ID
 */
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('ncsecmm_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('ncsecmm_session_id', sessionId);
  }
  return sessionId;
};
