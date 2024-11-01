const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  accountType: { type: String, enum: ['driver', 'food bank', 'donor'], required: true },
  profileInfo: { type: mongoose.Schema.Types.Mixed }, // Additional fields per account type
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);