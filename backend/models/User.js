const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'donor',
  },
  phone: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  avatar: {
    type: String,
  },
  rewardPoints: {
    type: Number,
    default: 100,
  },
  totalDonations: {
    type: Number,
    default: 0,
  },
  livesSaved: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  // Dynamic extra fields can be added here or just accept any
}, {
  timestamps: true,
  strict: false // allow extra fields from registration like hospitalName, etc.
});

const User = mongoose.model('User', userSchema);

module.exports = User;
