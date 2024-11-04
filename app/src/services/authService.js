import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (userData) => {
	return await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
};

export const login = async (credentials) => {
	return await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
};

export const getCurrentUser = async () => {
	return await axios.get(`${API_URL}/user`, {
		withCredentials: true,
	});
};
