import React, { useState } from 'react';
import { commitDonation } from '../api';
import { Autocomplete } from '@react-google-maps/api';

function DonationRequestList({ requests, userType }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCommitForm, setShowCommitForm] = useState(false);

  // Separate states for typed and final
  const [typedAddress, setTypedAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState('');

  const [commitQuantity, setCommitQuantity] = useState('');
  
  let pickupAutocomplete = null;

  const handleItemClick = (request) => {
    setSelectedRequest(request);
    setShowCommitForm(false);
    setTypedAddress('');
    setFinalAddress('');
    setCommitQuantity('');
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
    setShowCommitForm(false);
    setTypedAddress('');
    setFinalAddress('');
    setCommitQuantity('');
  };

  const handleShowCommitForm = () => {
    setShowCommitForm(true);
  };

  const handleCommitDonation = async () => {
    // Use finalAddress if it exists, otherwise typedAddress
    const addressToUse = finalAddress || typedAddress;

    if (!addressToUse || !commitQuantity) {
      alert("Please fill in both Pickup Address and Quantity.");
      return;
    }

    try {
      await commitDonation(selectedRequest._id, addressToUse, commitQuantity);
      alert("Pickup request created successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Error committing donation:", error);
      alert("Error committing donation. Please try again.");
    }
  };

  const handlePickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      if (place && place.formatted_address) {
        const fullAddress = place.formatted_address.replace(/, USA$/, '');
        // Update both typed and final addresses to the fully selected address
        setTypedAddress(fullAddress);
        setFinalAddress(fullAddress);
      }
    }
  };

  return (
    <div>
      <h2>Donation Requests</h2>
      <ul>
        {requests.map((request) => (
          <li
            key={request._id}
            data-urgency={request.urgency}
            onClick={() => handleItemClick(request)}
            style={{ cursor: 'pointer' }}
          >
            {request.requestedItem} - {request.foodBankName} - {request.quantity} - {request.urgency} - {request.address}
          </li>
        ))}
      </ul>

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request Details</h3>
            <p><strong>Requested Item:</strong> {selectedRequest.requestedItem}</p>
            <p><strong>Food Bank Name:</strong> {selectedRequest.foodBankName}</p>
            <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
            <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
            <p><strong>Address:</strong> {selectedRequest.address}</p>

            {userType === 'donor' && !showCommitForm && (
              <button onClick={handleShowCommitForm} className="modal-commit-button">
                Commit Donation
              </button>
            )}

            {userType === 'donor' && showCommitForm && (
              <div className="commit-form">
				<input
                  type="number"
                  placeholder="Quantity"
                  value={commitQuantity}
                  onChange={(e) => setCommitQuantity(e.target.value)}
                  className="commit-form-input"
                />
				
                <div className="autocomplete-container">
                  <Autocomplete
                    onLoad={(ref) => (pickupAutocomplete = ref)}
                    onPlaceChanged={handlePickupPlaceChanged}
                    fields={['formatted_address', 'address_components', 'geometry']}
                  >
                    <input
                      type="text"
                      placeholder="Pickup Address"
                      value={typedAddress}
                      onChange={(e) => setTypedAddress(e.target.value)}
                      className="commit-form-input"
                    />
                  </Autocomplete>
                </div>

                <button onClick={handleCommitDonation} className="modal-confirm-button">
                  Submit
                </button>
              </div>
            )}

            <button onClick={handleCloseModal} className="modal-cancel-button">
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          background-color: #fff;
          border-radius: 8px;
          padding: 1rem;
          width: 90%;
          max-width: 500px;
          text-align: left;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          box-sizing: border-box;
          overflow: hidden;
        }

        .modal-content h3 {
          margin-top: 0;
        }

        .modal-commit-button, .modal-confirm-button, .modal-cancel-button {
          margin-top: 0.5rem;
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          color: #fff;
        }

        .modal-commit-button {
          background-color: #007bff;
        }

        .modal-commit-button:hover {
          background-color: #0056b3;
        }

        .modal-confirm-button {
          background-color: #28a745;
        }

        .modal-confirm-button:hover {
          background-color: #218838;
        }

        .modal-cancel-button {
          background-color: #ccc;
          color: #000;
        }

        .modal-cancel-button:hover {
          background-color: #bbb;
        }

        .commit-form {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          box-sizing: border-box;
        }

        .autocomplete-container {
          width: 100%;
          box-sizing: border-box;
        }

        .commit-form-input {
          display: block;
          width: 100%;
          padding: 0.75rem;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .commit-form-input[type=number]::-webkit-inner-spin-button,
        .commit-form-input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .commit-form-input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

export default DonationRequestList;
