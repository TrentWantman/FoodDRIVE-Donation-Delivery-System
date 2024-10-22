import React, { useEffect, useState } from 'react';
import { getDonationRequests } from '../api';
import './DonationSearch.css';


function DonationSearch() {
  const [donations, setDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getDonationRequests().then((data) => {
      setDonations(data);
    });
  }, []);

  const filteredDonations = donations.filter((donation) => {
    return (
      (filter === 'All' || donation.urgency === filter) &&
      donation.item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h2>Donation Requests</h2>
      <input
        type="text"
        placeholder="Search by item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="High">High Urgency</option>
        <option value="Medium">Medium Urgency</option>
        <option value="Low">Low Urgency</option>
      </select>

      <ul>
        {filteredDonations.map((donation) => (
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
