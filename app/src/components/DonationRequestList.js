import React, { useState } from 'react';
import { commitDonation } from '../api';
import { Autocomplete } from '@react-google-maps/api';

function DonationRequestList({ requests, userType }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleItemClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseAll = () => {
    setSelectedRequest(null);
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

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
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

            {userType === 'donor' && (
              <button onClick={handleShowQuantityModal} className="modal-commit-button">
                Commit Donation
              </button>
            )}
            <button onClick={handleCloseAll} className="modal-cancel-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quantity Modal */}
      {showQuantityModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Commit Donation - Quantity</h3>
            <input
              type="number"
              placeholder="Quantity"
              value={commitQuantity}
              onChange={(e) => setCommitQuantity(e.target.value)}
              className="commit-form-input"
            />
            <button onClick={handleQuantitySubmit} className="modal-confirm-button">
              Next
            </button>
            <button onClick={handleCloseAll} className="modal-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Pickup Address</h3>
            <div className="autocomplete-container">
              <Autocomplete
                onLoad={(ref) => (pickupAutocomplete = ref)}
                onPlaceChanged={handlePickupPlaceChanged}
                fields={['formatted_address', 'address_components', 'geometry']}
              >
                <input
                  type="text"
                  placeholder="Enter Pickup Address"
                  value={typedAddress}
                  onChange={(e) => setTypedAddress(e.target.value)}
                  className="commit-form-input"
                />
              </Autocomplete>
            </div>

            <button onClick={handleAddressConfirm} className="modal-confirm-button">
              Confirm
            </button>
            <button onClick={handleCloseAll} className="modal-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Thank You</h3>
            <p>Your donation has been committed successfully!</p>
            <button onClick={handleCloseThankYouModal} className="modal-cancel-button">
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
      `}</style>
    </div>
  );
}

export default DonationRequestList;
