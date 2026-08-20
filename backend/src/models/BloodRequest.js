const mongoose = require('mongoose');

// Auto-calculate expiry based on urgency
const expiryMap = {
  critical: 6 * 60 * 60 * 1000,   // 6 hours
  urgent:   24 * 60 * 60 * 1000,  // 24 hours
  planned:  7 * 24 * 60 * 60 * 1000, // 7 days
};

const matchedDonorSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['notified', 'accepted', 'declined'],
      default: 'notified',
    },
    respondedAt: { type: Date, default: null },
  },
  { _id: false }
);

const bloodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Units needed is required'],
      min: [1, 'Minimum 1 unit required'],
      max: [20, 'Maximum 20 units'],
    },
    unitsFulfilled: { type: Number, default: 0 },
    urgency: {
      type: String,
      enum: ['critical', 'urgent', 'planned'],
      default: 'urgent',
    },
    hospital: {
      name: { type: String, required: true, trim: true },
      address: { type: String, trim: true, default: '' },
      contact: { type: String, trim: true, default: '' },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    description: { type: String, trim: true, default: '' },
    requiredDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired', 'cancelled'],
      default: 'open',
    },
    matchedDonors: [matchedDonorSchema],
    expiresAt: { type: Date },

    // ── Admin verification ────────────────────────────────────────────────────
    adminVerified: { type: Boolean, default: false },
    adminVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    adminNote: { type: String, default: '' },
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

// ── 2dsphere index on hospital location ───────────────────────────────────────
bloodRequestSchema.index({ 'hospital.location': '2dsphere' });
bloodRequestSchema.index({ status: 1, bloodGroup: 1 });
bloodRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// ── Auto-set expiresAt before save ───────────────────────────────────────────
bloodRequestSchema.pre('save', function (next) {
  if (this.isNew && !this.expiresAt) {
    const ttl = expiryMap[this.urgency] || expiryMap.urgent;
    this.expiresAt = new Date(Date.now() + ttl);
  }
  next();
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
