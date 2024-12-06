import React, { useState } from 'react';

function PickupRequestsList({ pickupRequests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleItemClick = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div>
      <h2>Pickup Requests</h2>
      <ul>
        {pickupRequests.map((request) => (
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
            <h3>Pickup Request Details</h3>
            <p><strong>Requested Item:</strong> {selectedRequest.requestedItem}</p>
            <p><strong>Food Bank Name:</strong> {selectedRequest.foodBankName}</p>
            <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
            <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
            <p><strong>Address:</strong> {selectedRequest.address}</p>

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

        .modal-cancel-button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
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

export default PickupRequestsList;
