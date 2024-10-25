// backend/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./authMiddleware');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

let requests_collection;
let users_collection;

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db('db');
    requests_collection = database.collection('requests');
    users_collection = database.collection('users');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

connectDB();

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

// User Registration
app.post(
  '/api/auth/register',
  [
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
    body('accountType').isIn(['driver', 'food bank', 'donor']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, accountType } = req.body;

    try {
      // Check if user exists
      const existingUser = await users_collection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user object
      const newUser = {
        username,
        password: hashedPassword,
        accountType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Insert user into database
      const result = await users_collection.insertOne(newUser);

      // Generate JWT token
      const payload = { userId: result.insertedId, accountType: newUser.accountType };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).send('Server Error');
    }
  }
);

// User Login
app.post(
  '/api/auth/login',
  [body('username').notEmpty(), body('password').exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user exists
      const user = await users_collection.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Generate JWT token
      const payload = { userId: user._id, accountType: user.accountType };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server Error');
    }
  }
);

// Get Current User Info
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    const user = await users_collection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } } // Exclude password
    );
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).send('Server Error');
  }
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
