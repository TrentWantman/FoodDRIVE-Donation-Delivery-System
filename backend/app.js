// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for frontend-backend communication

// Sample dataset for donation requests
const donationRequests = [
    { id: 1, item: 'Canned Food', location: 'Downtown', urgency: 'High' },
    { id: 2, item: 'Blankets', location: 'East Side', urgency: 'Medium' },
    { id: 3, item: 'Clothing', location: 'West Side', urgency: 'Low' },
    { id: 4, item: 'Hygiene Kits', location: 'North Side', urgency: 'High' },
    { id: 5, item: 'Bottled Water', location: 'Downtown', urgency: 'Medium' },
];

// Simple route to test the server
app.get('/', (req, res) => {
    res.send('FoodDRIVE API is running!');
});

// Endpoint to get donation requests
app.get('/api/donations', (req, res) => {
    res.json(donationRequests);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
