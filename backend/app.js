// backend/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./authMiddleware');
const { getUser, getUserByUserId, getDonationRequests, createPickupRequest, getPickupRequests} = require('./db');


const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,            //access-control-allow-credentials:true
	optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

// Simple route to test the server
app.get('/', (req, res) => {
	res.send('FoodDRIVE API is running!');
});

// Endpoint to commit a donation: creates a new pickup request
app.post('/api/donations/commit', auth, async (req, res) => {
	const { id, pickupAddress, quantity } = req.body;

	if (!id || !pickupAddress || !quantity) {
		return res.status(400).json({ error: 'Missing id, pickupAddress, or quantity' });
	}

	try {
		const insertedId = await createPickupRequest(id, pickupAddress, quantity);
		res.json({ message: 'Pickup request created successfully', pickupRequestId: insertedId });
	} catch (error) {
		console.error('Error creating pickup request:', error);
		if (error.message === "Original request not found") {
			return res.status(404).json({ error: 'Original request not found' });
		}
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/api/pickupRequests', auth, async (req, res) => {
    try {
        // You can add query filters if needed, for now just return all
        const requests = await getPickupRequests({});
        res.json(requests);
    } catch (error) {
        console.error('Error fetching pickup requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get donation requests
app.get('/api/donations', auth, async (req, res) => {
	// Get a cursor of the first 25 matching requests
	const query = { $or: [{ requestedItem: { "$regex": req.query.q || "", "$options": "i" } }, { foodBankName: { "$regex": req.query.q || "", "$options": "i" } }], ...(req.query.urgency) && { urgency: req.query.urgency } };

	// Return the requests we got
	res.json(await getDonationRequests(query));
});

// Update User Info
app.put('/api/auth/user', auth, async (req, res) => {
	const { username, password } = req.body;

	// Build updated fields
	let updatedFields = {};
	if (username) updatedFields.username = username;
	if (password) updatedFields.password = await bcrypt.hash(password, 10);
	updatedFields.updatedAt = new Date();

	try {
		// Update user in database
		const result = await users_collection.updateOne(
			{ _id: new ObjectId(req.user.userId) },
			{ $set: updatedFields }
		);

		if (result.matchedCount === 0) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json({ msg: 'User updated successfully' });
	} catch (err) {
		console.error('Error updating user data:', err);
		res.status(500).send('Server Error');
	}
});

// Protected Route Example
app.get('/api/protected', auth, (req, res) => {
	res.json({
		msg: `Welcome, user ${req.user.userId}!`,
		accountType: req.user.accountType,
	});
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
