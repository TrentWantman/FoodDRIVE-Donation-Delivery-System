import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const login = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials);
};

export const getCurrentUser = async (token) => {
  return await axios.get(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};