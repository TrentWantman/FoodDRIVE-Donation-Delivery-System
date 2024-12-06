import React, { useEffect, useState } from 'react';
import { getPickupRequests } from '../api'; // You'll define this next
import PickupRequestsList from './PickupRequestsList';
import Logo from './Logo';

function DriverDashboard() {
  const [pickupRequests, setPickupRequests] = useState([]);

  useEffect(() => {
    async function loadPickupRequests() {
      const requests = await getPickupRequests();
      setPickupRequests(requests);
    }

    loadPickupRequests();
  }, []);

  return (
    <div className="driver-dashboard-container">
      <Logo />
      <h2>Driver Dashboard</h2>
      <p>Welcome to your dashboard.</p>
      <PickupRequestsList pickupRequests={pickupRequests} />
    </div>
  );
}

export default DriverDashboard;
