import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { postUserDontationReqeust, getUserDonationRequests } from '../api';
import DonationRequestList from './DonationRequestList';

function FoodBankDashboard() {
	const [formVisible, setFormVisible] = useState(false);
	const [donationRequests, setDonationRequests] = useState([]); // State to hold donation requests

	const updateDonations = async () => {
		setDonationRequests(await getUserDonationRequests());
	}

	const toggleForm = () => setFormVisible(!formVisible);

	const onSubmit = async (e) => {
		e.preventDefault();
		var formData = Object.fromEntries(new FormData(e.target));
		e.target.reset();
		setFormVisible(false);
		await postUserDontationReqeust(formData);
		await updateDonations();
	};

	useEffect(() => {
		updateDonations();
	}, []);

	return (
		<div className="food-bank-dashboard-container">
			<Logo />
			<h2>Food Bank Dashboard</h2>
			<p>Welcome to your dashboard.</p>
			<DonationRequestList requests={donationRequests} />

			<button onClick={toggleForm} className="add-request-button">
				{formVisible ? 'Cancel' : 'Add Donation Request'}
			</button>

			{formVisible && (
				<form onSubmit={onSubmit} className="donation-request-form">
					<input
						type="text"
						name="foodBankName"
						placeholder="Food Bank Name"
						required
					/>
					<input
						type="text"
						name="requestedItem"
						placeholder="Requested Item"
						required
					/>
					<input
						type="number"
						name="quantity"
						placeholder="Quantity"
						required
					/>
					<select name="urgency">
						<option value="Low">Low</option>
						<option value="Medium">Medium</option>
						<option value="High">High</option>
					</select>
					<button type="submit">Submit Request</button>
				</form>
			)}
		</div>
	);
}

export default FoodBankDashboard;
