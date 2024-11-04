// backend/authMiddleware.js

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
	// Get token from header
	const token = req.cookies['token'];
	if (!token) {
		return res.status(401).json({ msg: 'Token missing or malformed' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
}

module.exports = auth;
