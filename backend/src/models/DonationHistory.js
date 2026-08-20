const mongoose = require('mongoose');

const donationHistorySchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsGiven: {
      type: Number,
      default: 1,
      min: 1,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pointsAwarded: {
      type: Number,
      default: 100,
    },
    certificateUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

donationHistorySchema.index({ donorId: 1, donatedAt: -1 });

module.exports = mongoose.model('DonationHistory', donationHistorySchema);
