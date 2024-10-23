import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [accountType, setAccountType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const res = await getCurrentUser(token);
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
    <div>
      <h2>Driver Dashboard</h2>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

function FoodBankDashboard() {
  return (
    <div>
      <h2>Food Bank Dashboard</h2>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

function DonorDashboard() {
  return (
    <div>
      <h2>Donor Dashboard</h2>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

export default Dashboard;
