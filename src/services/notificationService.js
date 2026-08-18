import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, where, writeBatch, serverTimestamp, getDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { db, auth, app } from "../config/firebase";

// Helper to initialize messaging safely (browser check)
let messagingInstance = null;
const getMessagingSafely = async () => {
  if (messagingInstance) return messagingInstance;
  try {
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    }
  } catch (err) {
    console.warn('[NotificationService] Firebase Messaging is not supported in this environment.', err);
  }
  return null;
};

export const notificationService = {
  // ─── Browser & FCM Token Management ──────────────────────────────────────

  /**
   * Request Notification permission from the browser.
   */
  requestNotificationPermission: async () => {
    if (!('Notification' in window)) {
      console.warn('[NotificationService] Web Notifications not supported in this browser.');
      return 'denied';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.error('[NotificationService] Error requesting notification permission:', err);
      return 'denied';
    }
  },

  /**
   * Get FCM registration token for current device/browser.
   */
  getFCMToken: async () => {
    try {
      const messaging = await getMessagingSafely();
      if (!messaging) return null;

      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });
      return token;
    } catch (err) {
      console.warn('[NotificationService] Could not retrieve FCM token:', err);
      return null;
    }
  },

  /**
   * Save donor's FCM token in Firestore under user document.
   */
  saveDonorFCMToken: async (donorId, fcmToken) => {
    if (!donorId || !fcmToken) return;
    try {
      const userRef = doc(db, "users", donorId);
      await setDoc(userRef, { fcmToken, tokenUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      console.error('[NotificationService] Failed to save FCM token in Firestore:', err);
    }
  },

  /**
   * Listen for incoming FCM foreground messages.
   */
  onForegroundMessage: async (callback) => {
    const messaging = await getMessagingSafely();
    if (!messaging) return () => {};
    return onMessage(messaging, (payload) => {
      if (callback) callback(payload);
    });
  },

  // ─── Emergency Request Alerts ──────────────────────────────────────────────

  /**
   * Send emergency notifications to matched donors for a Critical/Emergency request.
   * Prevents duplicate notifications using composite key (requestId + '_' + donorId).
   *
   * @param {object} request Blood request object
   * @param {Array<object>} matchedDonors Output array from findMatchingDonors()
   * @returns {Promise<{ sentCount: number, skippedCount: number }>}
   */
  sendEmergencyNotification: async (request, matchedDonors = []) => {
    if (!request || !matchedDonors.length) {
      return { sentCount: 0, skippedCount: 0 };
    }

    const priority = request.priority || request.urgency || 'High';
    const isCritical = priority.toLowerCase() === 'critical' || priority.toLowerCase() === 'emergency';

    if (!isCritical) {
      console.info('[NotificationService] Non-critical request. Emergency FCM alert skipped.');
      return { sentCount: 0, skippedCount: 0 };
    }

    let sentCount = 0;
    let skippedCount = 0;

    for (const donorMatch of matchedDonors) {
      const donorId = donorMatch.donorId || donorMatch.id;
      if (!donorId) continue;

      const notifId = `emerg_${request.id}_${donorId}`;
      const notifRef = doc(db, "notifications", notifId);

      try {
        // Prevent duplicate notification check
        const existing = await getDoc(notifRef);
        if (existing.exists()) {
          skippedCount++;
          continue;
        }

        const title = `🚨 ${request.bloodGroup} Blood Needed`;
        const distanceText = donorMatch.distanceKm != null ? `${donorMatch.distanceKm} km` : 'nearby';
        const durationText = donorMatch.durationMinutes != null ? ` (~${donorMatch.durationMinutes} min)` : '';
        const body = `Hospital: ${request.hospitalName || 'AIIMS'}\nDistance: ${distanceText}${durationText}`;

        const notifData = {
          id: notifId,
          userId: donorId,
          type: "emergency",
          title,
          message: body,
          requestId: request.id,
          hospitalName: request.hospitalName || "AIIMS",
          bloodGroup: request.bloodGroup,
          unitsRequired: request.unitsRequired || request.units || 1,
          priority: request.priority || "Critical",
          distanceKm: donorMatch.distanceKm,
          durationMinutes: donorMatch.durationMinutes,
          timestamp: serverTimestamp(),
          read: false,
          notificationSent: true,
          responseStatus: "pending",
          data: {
            bloodGroup: request.bloodGroup,
            hospitalName: request.hospitalName || "AIIMS",
            distance: distanceText,
            requestId: request.id,
            priority: request.priority || "Critical",
          }
        };

        await setDoc(notifRef, notifData, { merge: true });
        sentCount++;

        // Dispatch local event for active browser session foreground UI
        window.dispatchEvent(
          new CustomEvent("redconnect_emergency_alert", { detail: notifData })
        );

        // Standard web browser desktop notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(title, {
              body,
              icon: '/favicon.ico',
              tag: notifId,
              data: notifData,
            });
          } catch (e) {
            // Mobile browser fallback
          }
        }
      } catch (err) {
        console.error(`[NotificationService] Error sending notification to donor ${donorId}:`, err);
      }
    }

    return { sentCount, skippedCount };
  },

  /**
   * Handle donor response to an emergency request (Accept / Dismiss).
   */
  respondToEmergencyRequest: async (requestId, donorId, responseStatus) => {
    try {
      const notifId = `emerg_${requestId}_${donorId}`;
      const notifRef = doc(db, "notifications", notifId);
      
      await updateDoc(notifRef, {
        responseStatus,
        read: true,
        respondedAt: serverTimestamp(),
      });

      // Log response in donorResponses for Hospital Dashboard visibility
      if (responseStatus === 'accepted') {
        const responseRef = doc(db, "donorResponses", `${requestId}_${donorId}`);
        await setDoc(responseRef, {
          requestId,
          donorId,
          status: 'Accepted',
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      return true;
    } catch (err) {
      console.error('[NotificationService] Error recording donor response:', err);
      throw err;
    }
  },

  // ─── Existing Firestore Notification Methods ──────────────────────────────

  getNotifications: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      result.sort((a, b) => {
        const aTime = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
        const bTime = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
        return bTime - aTime;
      });
      
      return result;
    } catch (error) {
      console.error("Error getting notifications:", error);
      return [];
    }
  },

  markAsRead: async (id) => {
    try {
      const notifRef = doc(db, "notifications", id);
      await updateDoc(notifRef, { read: true });
      return await notificationService.getNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        where("read", "==", false)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((document) => {
        const notifRef = doc(db, "notifications", document.id);
        batch.update(notifRef, { read: true });
      });
      
      await batch.commit();
      return await notificationService.getNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      return await notificationService.getNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
};
