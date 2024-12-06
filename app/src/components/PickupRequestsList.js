import React, { useState, useEffect } from 'react';
import { Autocomplete, DistanceMatrixService } from '@react-google-maps/api';

function PickupRequestsList({ pickupRequests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [typedAddress, setTypedAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState('');
  const [driverAutocomplete, setDriverAutocomplete] = useState(null);

  // Travel times: { [requestId]: number (seconds) }
  const [travelTimesById, setTravelTimesById] = useState({});

  // Calculation states
  const [calculating, setCalculating] = useState(false);
  const [firstMatrixDone, setFirstMatrixDone] = useState(false);
  const [driverToPickupResults, setDriverToPickupResults] = useState(null);

  const pickupAddresses = pickupRequests.map(r => r.pickupAddress);
  const dropoffAddresses = pickupRequests.map(r => r.address);

  const handleItemClick = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const handleDriverPlaceChanged = () => {
    if (driverAutocomplete) {
      const place = driverAutocomplete.getPlace();
      if (place && place.formatted_address) {
        setTypedAddress(place.formatted_address);
      }
    }
  };

  const handleConfirmAddress = () => {
    if (!typedAddress) {
      alert("Please select your address from suggestions.");
      return;
    }
    setFinalAddress(typedAddress);
    setShowAddressModal(false);

    if (pickupRequests.length > 0) {
      setCalculating(true);
      setFirstMatrixDone(false);
      setDriverToPickupResults(null);
    }
  };

  const shouldRunFirstMatrix = finalAddress && calculating && !firstMatrixDone && pickupRequests.length > 0;
  const shouldRunSecondMatrix = finalAddress && calculating && firstMatrixDone && driverToPickupResults && pickupRequests.length > 0;

  const handleFirstMatrix = (response, status) => {
    if (status === 'OK' && response && response.rows.length > 0 && response.rows[0].elements.length === pickupRequests.length) {
      const elements = response.rows[0].elements; 
      const durations = elements.map(e => (e.status === 'OK' ? e.duration.value : null));
      setDriverToPickupResults(durations);
      setFirstMatrixDone(true);
    } else {
      alert("Error calculating driver->pickup times. Check addresses or try again.");
      setCalculating(false);
    }
  };

  const handleSecondMatrix = (response, status) => {
    if (status === 'OK' && response && response.rows.length === pickupRequests.length) {
      let newTimes = {};
      for (let i = 0; i < pickupRequests.length; i++) {
        const row = response.rows[i];
        if (row && row.elements && row.elements.length === pickupRequests.length) {
          const element = row.elements[i]; 
          if (element.status === 'OK' && driverToPickupResults[i] !== null) {
            const totalTime = driverToPickupResults[i] + element.duration.value;
            newTimes[pickupRequests[i]._id] = totalTime;
          } else {
            newTimes[pickupRequests[i]._id] = null;
          }
        } else {
          newTimes[pickupRequests[i]._id] = null;
        }
      }
      setTravelTimesById(newTimes);
    } else {
      alert("Error calculating pickup->dropoff times. Check addresses or try again.");
    }
    setCalculating(false);
  };

  const selectedTime = selectedRequest ? travelTimesById[selectedRequest._id] : null;

  return (
    <div>
      <h2>Pickup Requests</h2>
      {!finalAddress && (
        <button onClick={() => setShowAddressModal(true)} className="set-address-button">Set Address</button>
      )}
      {calculating && <p>Calculating travel times for all requests...</p>}

      <ul>
        {pickupRequests.map((request) => {
          const timeInSeconds = travelTimesById[request._id];
          const timeDisplay = timeInSeconds ? ` - ${Math.round(timeInSeconds / 60)} minutes` : '';
          return (
            <li
              key={request._id}
              data-urgency={request.urgency}
              onClick={() => handleItemClick(request)}
              style={{ cursor: 'pointer' }}
            >
              {request.requestedItem} - {request.foodBankName} - {request.committedQuantity} - {request.urgency} - {request.address}
              {timeDisplay}
            </li>
          );
        })}
      </ul>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Pickup Request Details</h3>
            <p><strong>Requested Item:</strong> {selectedRequest.requestedItem}</p>
            <p><strong>Food Bank Name:</strong> {selectedRequest.foodBankName}</p>
            <p><strong>Quantity:</strong> {selectedRequest.committedQuantity}</p>
            <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
            <p><strong>Pickup Address:</strong> {selectedRequest.pickupAddress}</p>
            <p><strong>Dropoff Address:</strong> {selectedRequest.address}</p>

            {selectedTime && (
              <p><strong>Travel Time:</strong> {Math.round(selectedTime / 60)} minutes</p>
            )}

            {/* Close the modal on Accept Delivery */}
            <button className="modal-commit-button" onClick={handleCloseDetailsModal}>
              Accept Delivery
            </button>

            <button onClick={handleCloseDetailsModal} className="modal-cancel-button">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enter Your Current Address</h3>
            <div className="commit-form">
              <Autocomplete
                onLoad={(ref) => setDriverAutocomplete(ref)}
                onPlaceChanged={handleDriverPlaceChanged}
                fields={['formatted_address', 'address_components', 'geometry']}
              >
                <input
                  type="text"
                  placeholder="Your Current Address"
                  value={typedAddress}
                  onChange={(e) => setTypedAddress(e.target.value)}
                  className="commit-form-input"
                />
              </Autocomplete>

              <button onClick={handleConfirmAddress} className="modal-confirm-button">
                Confirm Address
              </button>
            </div>
            <button onClick={() => setShowAddressModal(false)} className="modal-cancel-button">
              Close
            </button>
          </div>
        </div>
      )}

      {shouldRunFirstMatrix && (
        <DistanceMatrixService
          options={{
            origins: [finalAddress],
            destinations: pickupAddresses,
            travelMode: 'DRIVING',
          }}
          callback={handleFirstMatrix}
        />
      )}

      {shouldRunSecondMatrix && (
        <DistanceMatrixService
          options={{
            origins: pickupAddresses,
            destinations: dropoffAddresses,
            travelMode: 'DRIVING',
          }}
          callback={handleSecondMatrix}
        />
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

        .commit-form-input {
          display: block;
          width: 100%;
          padding: 0.75rem;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .set-address-button {
          background-color: #28a745;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .set-address-button:hover {
          background-color: #218838;
        }
      `}</style>
    </div>
  );
}

export default PickupRequestsList;
