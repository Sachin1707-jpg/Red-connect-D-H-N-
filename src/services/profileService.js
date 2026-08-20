import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { api } from "./api";

export const profileService = {
  getProfile: async () => {
    try {
      const token = localStorage.getItem('redconnect_token');
      if (token) {
        try {
          const res = await api.get('/donors/me');
          if (res.data && res.data.success && res.data.data) {
            const userData = res.data.data;
            localStorage.setItem('redconnect_user', JSON.stringify(userData));
            return userData;
          }
        } catch (apiErr) {
          console.warn('[profileService] Express GET /donors/me fallback:', apiErr.message);
        }
      }

      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = { id: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() };
          localStorage.setItem('redconnect_user', JSON.stringify(userData));
          return userData;
        }
      }

      const stored = localStorage.getItem('redconnect_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error getting profile:", error);
      const stored = localStorage.getItem('redconnect_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      let updatedUser = null;
      const token = localStorage.getItem('redconnect_token');
      
      if (token) {
        try {
          const res = await api.patch('/donors/me', profileData);
          if (res.data && res.data.success && res.data.data) {
            updatedUser = res.data.data;
          }
        } catch (apiErr) {
          console.warn('[profileService] Express PATCH /donors/me fallback:', apiErr.message);
        }
      }

      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          await updateDoc(docRef, profileData);
        } catch (fsErr) {
          console.warn('[profileService] Firestore update doc warning:', fsErr.message);
        }
      }

      if (!updatedUser) {
        const current = localStorage.getItem('redconnect_user');
        const parsed = current ? JSON.parse(current) : {};
        updatedUser = { ...parsed, ...profileData };
      }

      localStorage.setItem('redconnect_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  toggleAvailability: async (isAvailable) => {
    return await profileService.updateProfile({ isAvailable, available: isAvailable });
  },

  getDonationHistory: async () => {
    try {
      const firebaseUser = auth.currentUser;
      const uid = firebaseUser ? firebaseUser.uid : null;
      if (!uid) {
        const stored = localStorage.getItem('redconnect_user');
        const parsed = stored ? JSON.parse(stored) : null;
        if (parsed && (parsed.id || parsed._id)) {
          const q = query(
            collection(db, "donations"),
            where("userId", "==", parsed.id || parsed._id)
          );
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return [];
      }
      
      const q = query(
        collection(db, "donations"),
        where("userId", "==", uid)
      );
      
      const querySnapshot = await getDocs(q);
      const donations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      donations.sort((a, b) => {
        const aTime = a.date?.toMillis ? a.date.toMillis() : new Date(a.date || 0).getTime();
        const bTime = b.date?.toMillis ? b.date.toMillis() : new Date(b.date || 0).getTime();
        return bTime - aTime;
      });
      
      return donations;
    } catch (error) {
      console.error("Error getting donation history:", error);
      return [];
    }
  }
};
