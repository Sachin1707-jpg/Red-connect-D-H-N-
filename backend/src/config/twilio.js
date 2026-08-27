let twilioClient = null;

const getTwilioClient = () => {
  if (twilioClient) return twilioClient;

  const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;

  if (!sid || !token) {
    console.warn('[Twilio] Credentials not set — SMS notifications disabled (console.log stub active).');
    return null;
  }

  try {
    const twilio = require('twilio');
    twilioClient = twilio(sid, token);
    console.log('[Twilio] Client initialized successfully');
    return twilioClient;
  } catch (err) {
    console.warn('[Twilio] Init failed:', err.message);
    return null;
  }
};

module.exports = { getTwilioClient };

