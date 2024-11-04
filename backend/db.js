const { MongoClient, ObjectId } = require('mongodb');

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

async function getUser(query, withPassword = false) {
	return await users_collection.findOne(query, { projection: { password: withPassword } });
}

async function getUserByUsername(username, withPassword = false) {
	return await getUser({ username }, withPassword);
}

async function getUserByUserId(userId, withPassword = false) {
	return await getUser({ _id: new ObjectId(userId) }, withPassword);
}

async function addUser(username, passwordHash, accountType) {
	const now = new Date();
	return await users_collection.insertOne({
		username,
		password: passwordHash,
		accountType,
		createdAt: now,
		updatedAt: now,
	}).insertedId;
}

async function addDonationRequest(foodBankName, requestedItem, quantity, urgency, userId) {
	return await requests_collection.insertOne({
		foodBankName,
		requestedItem,
		quantity,
		urgency,
		userId
	});
}

async function getDonationRequests(query, limit = 25) {
	const requests_cursor = requests_collection.find(query, { limit });

	let requests = [];
	for await (const request of requests_cursor) {
		requests.push(request);
	}

	return requests;
}

async function getDonationRequestsByUser(userId) {
	return await getDonationRequests({ userId });
}

module.exports = { getUserByUsername, getUserByUserId, addUser, addDonationRequest, getDonationRequests, getDonationRequestsByUser };

