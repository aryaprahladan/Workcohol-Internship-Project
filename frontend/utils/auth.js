import jwtDecode from 'jwt-decode';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('token') !== null;
};

export const getUserType = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.user_type;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};