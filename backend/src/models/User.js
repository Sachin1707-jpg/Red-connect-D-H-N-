const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['donor', 'hospital', 'ngo', 'admin'],
      default: 'donor',
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      default: null,
    },

    // ── Geo Location ──────────────────────────────────────────────────────────
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
    city: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },

    // ── Availability & Donation ───────────────────────────────────────────────
    isAvailable: { type: Boolean, default: true },
    lastDonationDate: { type: Date, default: null },
    donationCount: { type: Number, default: 0 },
    livesSaved: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },

    // ── Profile extras ────────────────────────────────────────────────────────
    avatar: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    dob: { type: Date, default: null },
    weight: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    medicalHistory: { type: String, default: '' },

    // ── Hospital / NGO specific ───────────────────────────────────────────────
    organizationName: { type: String, default: '' },
    licenseNumber: { type: String, default: '' },
    registrationNumber: { type: String, default: '' },
    operatingHours: { type: String, default: '' },
    website: { type: String, default: '' },

    // ── FCM Push Token ────────────────────────────────────────────────────────
    fcmToken: { type: String, default: null },

    // ── Verification ─────────────────────────────────────────────────────────
    verified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },

    // ── Refresh Token ─────────────────────────────────────────────────────────
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiry;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── 2dsphere index for geo queries ────────────────────────────────────────────
userSchema.index({ location: '2dsphere' });
userSchema.index({ bloodGroup: 1, isAvailable: 1 });

// ── Hash password before save ─────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: verify password ─────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: check donation eligibility (90-day gap) ─────────────────
userSchema.methods.isEligibleToDonate = function () {
  if (!this.lastDonationDate) return true;
  const daysSinceLast = (Date.now() - new Date(this.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceLast >= 90;
};

module.exports = mongoose.model('User', userSchema);
