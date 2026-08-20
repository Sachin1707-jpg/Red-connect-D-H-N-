const { getFirebaseAdmin } = require('../config/firebase');
const { getTwilioClient } = require('../config/twilio');

/**
 * Send FCM push notification to a single donor.
 */
const sendPushNotification = async ({ fcmToken, title, body, data = {} }) => {
  const admin = getFirebaseAdmin();

  if (!admin || !fcmToken) {
    // Stub: log instead of sending
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
 * Send SMS via Twilio (critical urgency only).
 */
const sendSms = async ({ to, message }) => {
  const client = getTwilioClient();
  const fromPhone = process.env.TWILIO_PHONE;

  if (!client || !fromPhone) {
    console.log(`[SMS STUB] → ${to}: "${message}"`);
    return { success: true, stub: true };
  }

  try {
    const msg = await client.messages.create({ body: message, from: fromPhone, to });
    console.log(`[SMS] Sent to ${to} | SID: ${msg.sid}`);
    return { success: true, sid: msg.sid };
  } catch (err) {
    console.error(`[SMS] Failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Notify a single donor about a blood request.
 * Sends FCM push always; SMS only for critical urgency.
 */
const notifyDonor = async ({ donor, request, urgency }) => {
  const title = `🚨 Urgent Blood Request — ${request.bloodGroup}`;
  const body = `${request.unitsNeeded} unit(s) needed at ${request.hospital.name}. Patient: ${request.patientName}`;

  // FCM Push
  await sendPushNotification({
    fcmToken: donor.fcmToken,
    title,
    body,
    data: { requestId: String(request._id), bloodGroup: request.bloodGroup, urgency },
  });

  // SMS — only for critical
  if (urgency === 'critical' && donor.phone) {
    await sendSms({
      to: donor.phone,
      message: `RedConnect ALERT: ${title}. ${body}. Open the app to respond.`,
    });
  }
};

/**
 * Notify multiple donors from a batch job (called by queue worker or inline).
 */
const notifyDonors = async ({ donors, request }) => {
  const promises = donors.map((donor) =>
    notifyDonor({ donor, request, urgency: request.urgency }).catch((err) =>
      console.error(`[Notify] Failed for donor ${donor._id}:`, err.message)
    )
  );
  await Promise.allSettled(promises);
  console.log(`[Notify] Dispatched notifications to ${donors.length} donor(s)`);
};

module.exports = { sendPushNotification, sendSms, notifyDonor, notifyDonors };
