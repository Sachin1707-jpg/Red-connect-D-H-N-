const { getFirebaseAdmin } = require('../config/firebase');
const { getTwilioClient } = require('../config/twilio');

/**
 * Normalizes phone numbers to E.164 format (specifically for Indian numbers +91).
 */
const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  // Strip all spaces, dashes, parentheses
  let cleaned = String(phone).trim().replace(/[\s\-\(\)]/g, '');
  if (!cleaned) return null;

  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // 10-digit Indian number without country code (e.g., 9711684719)
  if (/^\d{10}$/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // 12-digit Indian number with 91 prefix but no + (e.g., 919711684719)
  if (/^91\d{10}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  // 11-digit starting with 0 (e.g., 09711684719)
  if (/^0\d{10}$/.test(cleaned)) {
    return `+91${cleaned.slice(1)}`;
  }

  return `+${cleaned}`;
};

/**
 * Send FCM push notification to a single donor.
 */
const sendPushNotification = async ({ fcmToken, title, body, data = {} }) => {
  const admin = getFirebaseAdmin();

  if (!admin || !fcmToken) {
    console.log(`[FCM STUB] Push → "${title}" | "${body}" | token: ${fcmToken || 'none'}`);
    return { success: true, stub: true };
  }

  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high' },
      apns: { headers: { 'apns-priority': '10' } },
    };
    const response = await admin.messaging().send(message);
    console.log(`[FCM] Sent to ${fcmToken.slice(0, 20)}... → ${response}`);
    return { success: true, response };
  } catch (err) {
    console.error('[FCM] Send failed:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * General SMS sender helper via Twilio.
 */
const sendSms = async ({ to, message }) => {
  const client = getTwilioClient();
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE;

  const normalizedTo = normalizePhoneNumber(to);

  if (!client || !fromPhone) {
    console.log(`[SMS STUB] → ${normalizedTo || to}: "${message}"`);
    return { success: true, stub: true };
  }

  try {
    const msg = await client.messages.create({
      body: message,
      from: fromPhone,
      to: normalizedTo,
    });
    console.log(`[SMS] Sent to ${normalizedTo} | SID: ${msg.sid}`);
    return { success: true, sid: msg.sid };
  } catch (err) {
    console.error(`[SMS] Failed to ${normalizedTo || to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Send professional emergency blood alert SMS via Twilio.
 */
const sendBloodEmergencySMS = async ({
  donorPhone,
  donorName = 'Valued Donor',
  bloodGroup = 'O+',
  unitsRequired = 1,
  hospitalName = 'AIIMS New Delhi',
  hospitalLocation = 'Ansari Nagar, New Delhi',
  hospitalContact = '+91-11-26588500',
  mapsUrl = 'https://maps.google.com/?q=28.5672,77.2100',
}) => {
  const client = getTwilioClient();
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE;

  const normalizedPhone = normalizePhoneNumber(donorPhone);

  if (!normalizedPhone) {
    console.error('[SMS] Invalid donor phone number provided:', donorPhone);
    return {
      success: false,
      error: 'Invalid or missing donor phone number',
      errorMessage: 'Invalid or missing donor phone number',
    };
  }

  if (!client || !fromPhone) {
    console.warn('[SMS] Twilio client or TWILIO_PHONE_NUMBER missing in environment.');
    return {
      success: false,
      error: 'Twilio configuration is missing on server',
      errorMessage: 'Twilio configuration is missing on server',
    };
  }

  // Standard GSM-7 single segment format (no emojis, under 160 chars)
  const cleanDonorName = donorName ? donorName.split(' ')[0] : 'Donor';
  const cleanContact = String(hospitalContact).replace(/[^0-9+]/g, '');

  const smsText = `REDCONNECT: Hi ${cleanDonorName}, urgent ${bloodGroup} blood needed at ${hospitalName}.
Map: https://maps.google.com/?q=28.5659,77.2111
Call: ${cleanContact || hospitalContact}`;

  try {
    console.log(`[Twilio SMS] Sending SMS via Twilio from ${fromPhone} to ${normalizedPhone}...`);
    const message = await client.messages.create({
      body: smsText,
      from: fromPhone,
      to: normalizedPhone,
    });

    console.log(`[Twilio SMS] API Response Received | SID: ${message.sid} | Status: ${message.status} | ErrorCode: ${message.errorCode || 'None'}`);

    return {
      success: true,
      sid: message.sid,
      status: message.status,
      errorCode: message.errorCode || null,
      errorMessage: message.errorMessage || null,
    };
  } catch (err) {
    console.error(`[Twilio SMS Error] Failed sending to ${normalizedPhone} | Code: ${err.code} | Message: ${err.message}`);
    return {
      success: false,
      error: err.message,
      errorCode: err.code || null,
      errorMessage: err.message,
      status: err.status || 400,
    };
  }
};

/**
 * Notify a single donor about a blood request.
 */
const notifyDonor = async ({ donor, request, urgency }) => {
  const title = `🚨 Urgent Blood Request — ${request.bloodGroup}`;
  const body = `${request.unitsNeeded || request.unitsRequired || 1} unit(s) needed at ${request.hospital?.name || request.hospitalName}. Patient: ${request.patientName}`;

  // FCM Push
  await sendPushNotification({
    fcmToken: donor.fcmToken,
    title,
    body,
    data: { requestId: String(request._id || request.id), bloodGroup: request.bloodGroup, urgency },
  });

  // SMS — for critical / urgent requests
  if (donor.phone) {
    await sendBloodEmergencySMS({
      donorPhone: donor.phone,
      donorName: donor.name,
      bloodGroup: request.bloodGroup,
      unitsRequired: request.unitsNeeded || request.unitsRequired || 1,
      hospitalName: request.hospital?.name || request.hospitalName || 'AIIMS',
      hospitalLocation: request.hospital?.address || request.location || 'Metropolis',
      hospitalContact: request.hospital?.contact || request.hospitalContact || '+91-11-26588500',
      requestId: request.id || String(request._id),
    });
  }
};

/**
 * Notify multiple donors from a batch job.
 */
const notifyDonors = async ({ donors, request }) => {
  const promises = donors.map((donor) =>
    notifyDonor({ donor, request, urgency: request.urgency }).catch((err) =>
      console.error(`[Notify] Failed for donor ${donor._id || donor.id}:`, err.message)
    )
  );
  await Promise.allSettled(promises);
  console.log(`[Notify] Dispatched notifications to ${donors.length} donor(s)`);
};

module.exports = {
  normalizePhoneNumber,
  sendPushNotification,
  sendSms,
  sendBloodEmergencySMS,
  notifyDonor,
  notifyDonors,
};

