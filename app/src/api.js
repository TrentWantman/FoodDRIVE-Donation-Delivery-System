// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getDonationRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/donations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    return [];
  }
};
