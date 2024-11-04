const { body, validationResult } = require('express-validator');
const auth = require('../authMiddleware');
const { addDonationRequest, getDonationRequestsByUser } = require('../db');

var router = require('express').Router();

router.post('/donationRequests', [
	body('foodBankName').notEmpty(),
	body('requestedItem').notEmpty(),
	body('quantity').notEmpty().isNumeric(),
	body('urgency').isIn(['Low', 'Medium', 'High'],),
	auth
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		await addDonationRequest(req.body.foodBankName, req.body.requestedItem, req.body.quantity, req.body.urgency, req.user.userId);
		res.json({});
	} catch (err) {
		console.error('Error during /donationReqeusts:', err);
		res.status(500).send('Server Error');
	}
});

router.get('/donationRequests', auth, async (req, res) => {
	res.json(await getDonationRequestsByUser(req.user.userId));
});

module.exports = router;
