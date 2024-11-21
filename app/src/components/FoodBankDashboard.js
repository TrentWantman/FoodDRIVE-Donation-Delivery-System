import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { postUserDontationReqeust, getUserDonationRequests } from '../api';
import DonationRequestList from './DonationRequestList';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function FoodBankDashboard() {
	const [formVisible, setFormVisible] = useState(false);
	const [donationRequests, setDonationRequests] = useState([]); // State to hold donation requests
	const [address, setAddress] = useState(''); // State to store the selected address
	let autocomplete = null; // Variable to hold autocomplete instance

	const updateDonations = async () => {
		setDonationRequests(await getUserDonationRequests());
	};

	const toggleForm = () => setFormVisible(!formVisible);

	const onSubmit = async (e) => {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target));
		console.log('Form Data Submitted:', formData);
		e.target.reset();
		setFormVisible(false);
		await postUserDontationReqeust(formData);
		await updateDonations();
	};

	const handlePlaceChanged = () => {
		if (autocomplete) {
			const place = autocomplete.getPlace();
			setAddress(place.formatted_address || '');
		}
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
				<LoadScript
					googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
					libraries={libraries}
				>
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
						<Autocomplete
							onLoad={(ref) => (autocomplete = ref)}
							onPlaceChanged={handlePlaceChanged}
						>
							<div style={{ width: '400%' }}>
								<input
									type="text"
									placeholder="Enter Address"
									name="address"
									required
									onChange={(e) => setAddress(e.target.value)}
									style={{ width: '100%' }} // Ensure the input takes full width of the container
								/>
							</div>
						</Autocomplete>
						<button type="submit">Submit Request</button>
					</form>
				</LoadScript>
			)}
		</div>
	);
}

export default FoodBankDashboard;
