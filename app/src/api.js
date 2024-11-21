// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


export const getDonationRequests = async (query, urgency) => {
	try {
		const response = await axios.get(`${API_URL}/api/donations`, { params: { q: query, ...(urgency !== "All") && { urgency: urgency } }, withCredentials: true });
		return response.data;
	} catch (error) {
		console.error("Error fetching donation requests:", error);
		return [];
	}
};

export const postUserDontationReqeust = async (request) => {
	try {
		await axios.post(`${API_URL}/api/user/donationRequests`, { ...request }, { withCredentials: true });
	} catch (error) {
		console.error("Error adding donation request:", error);
	}
};

export const getUserDonationRequests = async () => {
	try {
		const response =
			await axios.get(`${API_URL}/api/user/donationRequests`, { withCredentials: true });
		return response.data;
	} catch (error) {
		console.error("Error fetching donation requests:", error);
		return [];
	}
}
