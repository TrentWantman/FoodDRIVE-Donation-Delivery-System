// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Simple route to test the server
app.get('/', (req, res) => {
    res.send('FoodDRIVE API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
