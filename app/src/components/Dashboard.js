import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './DonorDashboard.css';

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
  const [donationItems, setDonationItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddDonation = (e) => {
    e.preventDefault();
    if (itemName.trim() && itemQuantity && itemWeight) {
      const newItem = {
        name: itemName,
        quantity: itemQuantity,
        weight: itemWeight,
        expirationDate: expirationDate || 'N/A',
        image: image, // In a real application, you'd handle image uploads differently
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

  return (
      <div className="donor-dashboard">
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

        <h3>Your Donation Items:</h3>
        <ul>
          {donationItems.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity}, Weight: {item.weight} oz, Expiration Date: {item.expirationDate}
                {item.image && <img src={item.image} alt="Item" style={{ width: '50px', height: '50px' }} />}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default Dashboard;
