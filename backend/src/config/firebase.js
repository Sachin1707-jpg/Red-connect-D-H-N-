let firebaseAdmin = null;

const getFirebaseAdmin = () => {
  if (firebaseAdmin) return firebaseAdmin;

  const configStr = process.env.FIREBASE_CONFIG;
  if (!configStr) {
    console.warn('[Firebase] FIREBASE_CONFIG not set — FCM push notifications disabled (console.log stub active).');
    return null;
  }

  try {
    const admin = require('firebase-admin');
    const serviceAccount = JSON.parse(configStr);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    firebaseAdmin = admin;
    console.log('[Firebase] Admin SDK initialized');
    return firebaseAdmin;
  } catch (err) {
    console.warn('[Firebase] Init failed:', err.message);
    return null;
  }
};

module.exports = { getFirebaseAdmin };
