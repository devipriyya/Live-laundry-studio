/**
 * Authentication helper functions
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user role
 * @returns {string|null} User role or null if not authenticated
 */
export const getUserRole = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    return user.role || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user has required role
 * @param {string|string[]} requiredRole - Required role(s)
 * @returns {boolean} True if user has required role
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  return hasRole('admin');
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Set authentication data
 * @param {string} token - JWT token
 * @param {object} user - User object
 */
export const setAuth = (token, user) => {
  if (token) {
    localStorage.setItem('token', token);
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export default {
  isAuthenticated,
  getUserRole,
  hasRole,
  isAdmin,
  clearAuth,
  setAuth
};