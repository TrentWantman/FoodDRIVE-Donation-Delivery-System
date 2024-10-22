import React, { useEffect, useState } from 'react';
import { getDonationRequests } from '../api';
import './DonationSearch.css';


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
    <div>
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

      <ul>
        {donations.map((donation) => (
          <li
          key={donation.id}
          data-urgency={donation.urgency}
        >
          {donation.item} - {donation.location} - {donation.quantity} - {donation.urgency}
        </li>
        ))}
      </ul>
    </div>
  );
}

export default DonationSearch; // Ensure it's a default export
