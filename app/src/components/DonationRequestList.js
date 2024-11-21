import React from 'react';

function DonationRequestList(params) {
	return (
		<div>
			<h2>Donation Requests</h2>
			<ul>
				{params.requests.map((request) => (
					<li
						key={request._id}
						data-urgency={request.urgency}
					>
						{request.requestedItem} - {request.foodBankName} - {request.quantity} - {request.urgency} - {request.address}
					</li>
				))}
			</ul>
		</div>
	);
}

export default DonationRequestList;
