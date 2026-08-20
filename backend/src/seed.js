require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const BloodRequest = require('./models/BloodRequest');

const seedData = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('\n❌ [Seed Error] Cannot seed database because MongoDB is not connected.');
      console.error('👉 Please update MONGO_URI in backend/.env with your MongoDB Atlas URI.');
      process.exit(1);
    }

    console.log('[Seed] Cleaning database...');
    await User.deleteMany({});
    await BloodRequest.deleteMany({});

    console.log('[Seed] Inserting sample users...');

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@redconnect.org',
      password: 'adminpassword123',
      phone: '+155500000',
      role: 'admin',
      verified: true,
    });

    const donor1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      password: 'password123',
      phone: '+15550147',
      role: 'donor',
      bloodGroup: 'O-',
      isAvailable: true,
      city: 'Metropolis',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] },
      verified: true,
      livesSaved: 24,
      donationCount: 8,
      rewardPoints: 850,
    });

    const donor2 = await User.create({
      name: 'Alex Vance',
      email: 'alex.v@example.com',
      password: 'password123',
      phone: '+15550011',
      role: 'donor',
      bloodGroup: 'O-',
      isAvailable: true,
      city: 'Metropolis',
      location: { type: 'Point', coordinates: [77.2180, 28.6200] },
      verified: true,
    });

    const hospitalUser = await User.create({
      name: 'Metro General Trauma Center',
      email: 'emergency@citygeneral.org',
      password: 'hospital123',
      phone: '+15550199',
      role: 'hospital',
      licenseNumber: 'HOSP-99201-AX',
      city: 'Metropolis',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] },
      verified: true,
    });

    console.log('[Seed] Inserting sample blood requests...');

    await BloodRequest.create({
      requesterId: hospitalUser._id,
      patientName: 'Robert Chen (ICU Ward Bed 12)',
      bloodGroup: 'O-',
      unitsNeeded: 3,
      urgency: 'critical',
      hospital: {
        name: 'Metro General Trauma Center',
        address: '450 Health Ave, Metropolis',
        contact: '+1-555-8832',
        location: { type: 'Point', coordinates: [77.2090, 28.6139] },
      },
      description: 'Urgent O-Negative blood required for acute trauma surgery.',
      status: 'open',
      matchedDonors: [
        { donorId: donor1._id, status: 'accepted' },
        { donorId: donor2._id, status: 'notified' },
      ],
    });

    console.log('[Seed] Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error:', err);
    process.exit(1);
  }
};

seedData();
