const { body, validationResult } = require('express-validator');
const { getUserByUsername, getUserByUserId, addUser } = require('../db');
const auth = require('../authMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var router = require('express').Router();

// User Registration
router.post(
	'/register',
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
			const existingUser = await getUserByUsername(username);
			if (existingUser) {
				return res.status(400).json({ msg: 'Username already exists' });
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Insert user into database
			const insertedId = await addUser(username, hashedPassword, accountType);

			// Generate JWT token
			const payload = { userId: insertedId };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

			res.cookie('token', token);
			res.json({});
		} catch (err) {
			console.error('Error during registration:', err);
			res.status(500).send('Server Error');
		}
	}
);


// User Login
router.post(
	'/login',
	[body('username').notEmpty(), body('password').exists()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { username, password } = req.body;

		try {
			// Check if user exists
			const user = await getUserByUsername(username, true);
			if (!user) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}

			// Validate password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ msg: 'Invalid Credentials' });
			}

			// Generate JWT token
			const payload = { userId: user._id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

			res.cookie('token', token);
			res.json({});
		} catch (err) {
			console.error('Error during login:', err);
			res.status(500).send('Server Error');
		}
	}
);

// Get Current User Info
router.get('/user', auth, async (req, res) => {
	try {
		const user = await getUserByUserId(req.user.userId);
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		console.error('Error fetching user data:', err);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
