const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows SRV DNS resolution issues (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  let uri = process.env.MONGO_URI;

  if (!uri || uri.includes('xxxxx') || uri.includes('<username>')) {
    console.warn('\n====================================================================');
    console.warn('⚠️  [DB WARNING] Invalid or placeholder MONGO_URI detected in .env!');
    console.warn('   Please update backend/.env with a valid MongoDB Atlas URI:');
    console.warn('   e.g. MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/redconnect');
    console.warn('   Or for local MongoDB:');
    console.warn('   MONGO_URI=mongodb://127.0.0.1:27017/redconnect');
    console.warn('====================================================================\n');
    uri = 'mongodb://127.0.0.1:27017/redconnect';
    console.log('[DB] Attempting local MongoDB connection (mongodb://127.0.0.1:27017/redconnect)...');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      maxPoolSize: 10,
    });
    isConnected = true;
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] Connection failed (${uri}):`, err.message);
    console.warn('[DB] App running in offline mode. Configure a valid MONGO_URI in .env to connect database.');
  }
};

module.exports = connectDB;
