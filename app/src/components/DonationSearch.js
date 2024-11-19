import React, { useEffect, useState } from 'react';
import { getDonationRequests } from '../api';
import { Link } from 'react-router-dom';
import './DonationSearch.css';
import Logo from "./Logo";
import DonationRequestList from './DonationRequestList';


function DonationSearch() {
	const [donations, setDonations] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [urgency, setUrgency] = useState('All');

	useEffect(() => {
		getDonationRequests(searchTerm, urgency).then((data) => {
			setDonations(data);
		});
	}, [searchTerm, urgency]);

  return (
    <div className='container'>
      <Link to="/dashboard">
        <Logo />
      </Link>
      <h2>Donation Requests</h2>
      <input
        type="text"
        placeholder="Search by item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
        <option value="All">All</option>
        <option value="High">High Urgency</option>
        <option value="Medium">Medium Urgency</option>
        <option value="Low">Low Urgency</option>
      </select>

			<DonationRequestList requests={donations} />
		</div>
	);
}

export default DonationSearch; // Ensure it's a default export
