// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

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

export const commitDonation = async (id, pickupAddress, quantity) => {
	try {
	  await axios.post(`${API_URL}/api/donations/commit`, { id, pickupAddress, quantity }, { withCredentials: true });
	} catch (error) {
	  console.error("Error committing donation:", error);
	  throw error;
	}
  };

  export const getPickupRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/pickupRequests`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching pickup requests:", error);
        return [];
    }
};
