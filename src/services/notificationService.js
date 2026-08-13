import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, writeBatch } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const notificationService = {
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
      
      // Sort client side for now
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
