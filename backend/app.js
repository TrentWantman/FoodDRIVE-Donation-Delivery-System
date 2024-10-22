// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require("mongodb");
const PORT = process.env.PORT || 5000;

// Connect to the MongoDB database and get the requests collection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@fooddrive-dev.bwsdh.mongodb.net/?retryWrites=true&w=majority&appName=fooddrive-dev`;
const client = new MongoClient(uri);
const database = client.db('db');
const requests_collection = database.collection('requests');

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for frontend-backend communication

// Simple route to test the server
app.get('/', (req, res) => {
	res.send('FoodDRIVE API is running!');
});

// Endpoint to get donation requests
app.get('/api/donations', async (req, res) => {
	// Get a cursor of the first 25 matching requests
	const query = { "$regex": req.query.q || "", "$options": "i" };
	const requests_cursor = requests_collection.find({ $or: [{ item: query }, { location: query }], ...(req.query.urgency) && { urgency: req.query.urgency } }, { limit: 25 });

	// Add the returned requests to an array as we get them
	let requests = []
	for await (const request of requests_cursor) {
		requests.push(request);
	}

	// Return the requests we got
	res.json(requests);
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
