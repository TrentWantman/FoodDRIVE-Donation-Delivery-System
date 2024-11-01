import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import './DonorDashboard.css';
import './DriverDashboard.css';
import './FoodBankDashboard.css';
import { getDonationRequests } from "../api";
import Logo from './Logo';

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


function FoodBankDashboard() {
    const [formVisible, setFormVisible] = useState(false);
    const [donationRequest, setDonationRequest] = useState({
        foodBankName: '',
        requestedItem: '',
        quantity: '',
        urgency: 'low',
    });

    const [donationRequests, setDonationRequests] = useState([]); // State to hold donation requests

    const toggleForm = () => setFormVisible(!formVisible);

    const onChange = (e) => setDonationRequest({ ...donationRequest, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();

        if (donationRequest.foodBankName && donationRequest.requestedItem && donationRequest.quantity) {
            // Add the new request to the donation requests state
            setDonationRequests([...donationRequests, donationRequest]);

            // Reset form and hide it
            setDonationRequest({ foodBankName: '', requestedItem: '', quantity: '', urgency: 'low' });
            setFormVisible(false);
        }
    };

    return (
        <div className="food-bank-dashboard-container">
            <Logo />
            <h2>Food Bank Dashboard</h2>
            <p>Welcome to your dashboard.</p>
            <div className="donation-requests">
                <h3>Donation Requests:</h3>
                {donationRequests.length === 0 ? (
                    <p>No active donation requests at this time.</p>
                ) : (
                    <ul>
                        {donationRequests.map((request, index) => (
                            <li key={index}>
                                <strong>Food Bank:</strong> {request.foodBankName} <br />
                                <strong>Requested Item:</strong> {request.requestedItem} <br />
                                <strong>Quantity:</strong> {request.quantity} <br />
                                <strong>Urgency:</strong> {request.urgency}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button onClick={toggleForm} className="add-request-button">
                {formVisible ? 'Cancel' : 'Add Donation Request'}
            </button>

            {formVisible && (
                <form onSubmit={onSubmit} className="donation-request-form">
                    <input
                        type="text"
                        name="foodBankName"
                        placeholder="Food Bank Name"
                        value={donationRequest.foodBankName}
                        onChange={onChange}
                        required
                    />
                    <input
                        type="text"
                        name="requestedItem"
                        placeholder="Requested Item"
                        value={donationRequest.requestedItem}
                        onChange={onChange}
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={donationRequest.quantity}
                        onChange={onChange}
                        required
                    />
                    <select name="urgency" value={donationRequest.urgency} onChange={onChange}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button type="submit">Submit Request</button>
                </form>
            )}
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
            const requests = await getDonationRequests();

            // Filter for only high urgency requests
            const highUrgencyRequests = requests.filter(request => request.urgency === 'High');
            setDonationRequests(highUrgencyRequests);
        }

        fetchAndSortRequests();
    }, []);

  return (
      <div className="donor-dashboard">
          <Logo/>
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
                  {image && <img src={image} alt="Item preview" style={{width: '100px', height: '100px'}}/>}
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
                              {item.image && <img src={item.image} alt="Item" style={{width: '50px', height: '50px'}}/>}
                          </li>
                      ))}
                  </ul>
              )}
          </div>

          {/* Food Bank Requests Section */}
          <div className="food-bank-requests">
              <h3>High Urgency Food Bank Requests</h3>
              {donationRequests.length === 0 ? (
                  <p>No donation requests at the moment.</p>
              ) : (
                  <ul>
                      {donationRequests.map((request) => (
                          <li key={request.id}>
                              <strong>{request.item}</strong> - {request.quantity} needed
                              <br/>
                              Urgency: {request.urgency} - Location: {request.location}
                          </li>
                      ))}
                  </ul>
              )}
          </div>
          <Link to="/donation-search">
              <button className="home-button">See all food bank requests</button>
          </Link>
      </div>
  );
}

export default Dashboard;
