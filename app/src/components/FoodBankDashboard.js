import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { postUserDontationReqeust, getUserDonationRequests } from '../api';
import DonationRequestList from './DonationRequestList';
import { Autocomplete } from '@react-google-maps/api';

function FoodBankDashboard() {
  const [formVisible, setFormVisible] = useState(false);
  const [donationRequests, setDonationRequests] = useState([]);
  const [address, setAddress] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    foodBankName: '',
    requestedItem: '',
    quantity: '',
    urgency: 'Low',
  });

  let autocomplete = null;

  const updateDonations = async () => {
    setDonationRequests(await getUserDonationRequests());
  };

  const toggleForm = () => setFormVisible(!formVisible);

  useEffect(() => {
    updateDonations();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!address) {
      setShowAddressModal(true);
    } else {
      submitFullRequest();
    }
  };

  const submitFullRequest = async () => {
    const fullData = { ...formData, address };
    await postUserDontationReqeust(fullData);
    setFormVisible(false);
    setAddress('');
    setFormData({
      foodBankName: '',
      requestedItem: '',
      quantity: '',
      urgency: 'Low',
    });
    await updateDonations();
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        const trimmedAddress = place.formatted_address.replace(/, USA$/, '');
        setAddress(trimmedAddress);
      }
    }
  };

  const handleAddressSubmit = () => {
    if (address) {
      setShowAddressModal(false);
      submitFullRequest();
    } else {
      alert('Please select an address from the suggestions.');
    }
  };

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
            value={formData.foodBankName}
            onChange={handleFormChange}
          />
          <input
            type="text"
            name="requestedItem"
            placeholder="Requested Item"
            required
            value={formData.requestedItem}
            onChange={handleFormChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            required
            value={formData.quantity}
            onChange={handleFormChange}
          />
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleFormChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input type="hidden" name="address" value={address} />
          <button type="submit">Submit Request</button>
        </form>
      )}

      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Please Enter Your Address</h3>
            <Autocomplete
              onLoad={(ref) => (autocomplete = ref)}
              onPlaceChanged={handlePlaceChanged}
              fields={['formatted_address', 'address_components', 'geometry']}
            >
              <input
                type="text"
                placeholder="Enter Address"
                className="address-input"
              />
            </Autocomplete>
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleAddressSubmit}
                className="modal-confirm-button"
              >
                Confirm Address
              </button>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="modal-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FoodBankDashboard;
