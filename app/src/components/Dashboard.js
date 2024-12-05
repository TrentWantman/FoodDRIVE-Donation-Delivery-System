import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './DonorDashboard.css';
import './DriverDashboard.css';
import './FoodBankDashboard.css';
import { getDonationRequests } from "../api";
import FoodBankDashboard from './FoodBankDashboard';
import DonationRequestList from './DonationRequestList';
import Logo from './Logo';

function Dashboard() {
	const [accountType, setAccountType] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getCurrentUser();
				setAccountType(res.data.accountType);
			} catch (err) {
				console.error(err);
				navigate('/');
			}
		};

		fetchUser();
	}, [navigate]);

	if (!accountType) {
		return <div>Loading...</div>;
	}

	if (accountType === 'driver') {
		return <DriverDashboard />;
	} else if (accountType === 'food bank') {
		return <FoodBankDashboard />;
	} else if (accountType === 'donor') {
		return <DonorDashboard />;
	} else {
		return <div>Invalid account type</div>;
	}
}

function DriverDashboard() {
	return (
		<div className="driver-dashboard-container">
			<Logo />
			<h2>Driver Dashboard</h2>
			<p>Welcome to your dashboard.</p>
			<div className="available-deliveries">
				<h3>Available Deliveries:</h3>
				<p>No deliveries near you</p>
			</div>
		</div>
	);
}

function DonorDashboard() {
	const [donationItems, setDonationItems] = useState([]);
	const [itemName, setItemName] = useState('');
	const [itemQuantity, setItemQuantity] = useState('');
	const [itemWeight, setItemWeight] = useState('');
	const [expirationDate, setExpirationDate] = useState('');
	const [image, setImage] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [donationRequests, setDonationRequests] = useState([]);

	const handleAddDonation = (e) => {
		e.preventDefault();
		if (itemName.trim() && itemQuantity && itemWeight) {
			const newItem = {
				name: itemName,
				quantity: itemQuantity,
				weight: itemWeight,
				expirationDate: expirationDate || 'N/A',
				image: image,
			};
			setDonationItems([...donationItems, newItem]);
			// Reset form fields
			setItemName('');
			setItemQuantity('');
			setItemWeight('');
			setExpirationDate('');
			setImage(null);
			setShowForm(false);
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file)); // For previewing the image; in a real app, you'd upload it
		}
	};

	useEffect(() => {
		async function fetchAndSortRequests() {
			const requests = await getDonationRequests({});

			// Filter for only high urgency requests
			const highUrgencyRequests = requests.filter(request => request.urgency === 'High');
			setDonationRequests(highUrgencyRequests);
		}

		fetchAndSortRequests();
	}, []);

	return (
		<div className="donor-dashboard">
			<Logo />
			<h2>Donor Dashboard</h2>
			<p>Welcome to your dashboard.</p>

			<button onClick={() => setShowForm(!showForm)}>
				{showForm ? 'Cancel' : 'Add Donation Item'}
			</button>

			{showForm && (
				<form onSubmit={handleAddDonation}>
					<input
						type="text"
						value={itemName}
						onChange={(e) => setItemName(e.target.value)}
						placeholder="Item Name"
						required
					/>
					<input
						type="number"
						value={itemQuantity}
						onChange={(e) => setItemQuantity(e.target.value)}
						placeholder="Item Quantity"
						required
					/>
					<input
						type="number"
						value={itemWeight}
						onChange={(e) => setItemWeight(e.target.value)}
						placeholder="Item Weight (oz)"
						required
					/>
					<input
						type="text"
						value={expirationDate}
						onChange={(e) => setExpirationDate(e.target.value)}
						placeholder="Expiration Date (MM/DD/YYY, N/A if not listed)"
					/>
					<input
						type="file"
						onChange={handleImageChange}
						accept="image/*"
						required
					/>
					{image && <img src={image} alt="Item preview" style={{ width: '100px', height: '100px' }} />}
					<button type="submit">Submit</button>
				</form>
			)}

			<div className="donation-items-box">
				<h3>Your Donation Items:</h3>
				{donationItems.length === 0 ? (
					<p>No items listed for donation</p>
				) : (
						<ul>
							{donationItems.map((item, index) => (
								<li key={index}>
									{item.name} - Quantity: {item.quantity}, Weight: {item.weight} oz, Expiration
                              Date: {item.expirationDate}
									{item.image && <img src={item.image} alt="Item" style={{ width: '50px', height: '50px' }} />}
								</li>
							))}
						</ul>
					)}
			</div>

			{/* Food Bank Requests Section */}
			<Link to="/donation-search">
				<button className="home-button">See food bank requests</button>
			</Link>
		</div>
	);
}

export default Dashboard;
