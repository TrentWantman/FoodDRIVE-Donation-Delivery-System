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
    { id: 1, item: 'Canned Food', location: 'Wawa Cares', urgency: 'High', quantity: 50 },
    { id: 2, item: 'Blankets', location: 'Southern Baptists Food Bank', urgency: 'Medium', quantity: 30 },
    { id: 3, item: 'Clothing', location: 'Grannys Kitchen', urgency: 'Low', quantity: 100 },
    { id: 4, item: 'Hygiene Kits', location: 'Gainesville Outreach Kitchen', urgency: 'High', quantity: 75 },
    { id: 5, item: 'Bottled Water', location: 'UF Student Government', urgency: 'Medium', quantity: 200 },
    { id: 6, item: 'Canned Peas', location: 'Alachua County Food Service', urgency: 'High', quantity: 60 },
    { id: 7, item: 'Socks', location: 'Veteran Support Center', urgency: 'High', quantity: 150 },
    { id: 8, item: 'Towels', location: 'Local YMCA Shelter', urgency: 'Medium', quantity: 40 },
    { id: 9, item: 'Canned Beans', location: 'Grannys Kitchen', urgency: 'Low', quantity: 90 },
    { id: 10, item: 'Baby Formula', location: 'Women & Children Shelter', urgency: 'High', quantity: 20 },
    { id: 11, item: 'Soap', location: 'Gainesville Homeless Shelter', urgency: 'High', quantity: 100 },
    { id: 12, item: 'Toothbrushes', location: 'City Mission', urgency: 'Medium', quantity: 80 },
    { id: 13, item: 'Diapers', location: 'Family Assistance Center', urgency: 'High', quantity: 60 },
    { id: 14, item: 'Canned Corn', location: 'Wawa Cares', urgency: 'Medium', quantity: 150 },
    { id: 15, item: 'Jackets', location: 'Winter Haven Drive Shelter', urgency: 'High', quantity: 45 },
    { id: 16, item: 'Canned Soup', location: 'Alachua County Food Service', urgency: 'Low', quantity: 120 },
    { id: 17, item: 'Notebooks', location: 'UF Student Government', urgency: 'Low', quantity: 200 },
    { id: 18, item: 'Pasta', location: 'Gainesville Outreach Kitchen', urgency: 'Medium', quantity: 75 },
    { id: 19, item: 'Rice', location: 'Southern Baptists Food Bank', urgency: 'High', quantity: 100 },
    { id: 20, item: 'Toiletries', location: 'Gainesville Homeless Shelter', urgency: 'High', quantity: 150 },
    { id: 21, item: 'Canned Tomatoes', location: 'Grannys Kitchen', urgency: 'Medium', quantity: 80 },
    { id: 22, item: 'Deodorant', location: 'Local YMCA Shelter', urgency: 'Medium', quantity: 50 },
    { id: 23, item: 'Cereal', location: 'Family Assistance Center', urgency: 'Low', quantity: 120 },
    { id: 24, item: 'Books', location: 'Veteran Support Center', urgency: 'Low', quantity: 70 },
    { id: 25, item: 'Canned Chicken', location: 'Wawa Cares', urgency: 'High', quantity: 40 },
    { id: 26, item: 'Masks', location: 'UF Student Government', urgency: 'Medium', quantity: 150 },
    { id: 27, item: 'Hand Sanitizer', location: 'City Mission', urgency: 'High', quantity: 90 },
    { id: 28, item: 'Gloves', location: 'Winter Haven Drive Shelter', urgency: 'Medium', quantity: 60 },
    { id: 29, item: 'Baby Wipes', location: 'Women & Children Shelter', urgency: 'High', quantity: 55 },
    { id: 30, item: 'Canned Tuna', location: 'Alachua County Food Service', urgency: 'Medium', quantity: 100 },
    { id: 31, item: 'Shampoo', location: 'Gainesville Outreach Kitchen', urgency: 'High', quantity: 70 },
    { id: 32, item: 'Toothpaste', location: 'Southern Baptists Food Bank', urgency: 'Low', quantity: 150 },
    { id: 33, item: 'Fruits', location: 'Grannys Kitchen', urgency: 'High', quantity: 100 },
    { id: 34, item: 'Canned Vegetables', location: 'Local YMCA Shelter', urgency: 'Medium', quantity: 110 },
    { id: 35, item: 'Tissues', location: 'City Mission', urgency: 'Low', quantity: 50 },
    { id: 36, item: 'Cooking Oil', location: 'Gainesville Homeless Shelter', urgency: 'Medium', quantity: 40 },
    { id: 37, item: 'Canned Fish', location: 'Winter Haven Drive Shelter', urgency: 'High', quantity: 85 },
    { id: 38, item: 'Flashlights', location: 'Veteran Support Center', urgency: 'Low', quantity: 30 },
    { id: 39, item: 'Pillows', location: 'UF Student Government', urgency: 'High', quantity: 25 },
    { id: 40, item: 'Laundry Detergent', location: 'Gainesville Outreach Kitchen', urgency: 'Medium', quantity: 60 }
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
