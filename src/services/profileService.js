import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

export const profileService = {
  getProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // Fallback to local storage if accessed before auth is fully initialized
        const stored = localStorage.getItem('redconnect_user');
        return stored ? JSON.parse(stored) : null;
      }
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = { id: user.uid, email: user.email, ...docSnap.data() };
        localStorage.setItem('redconnect_user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, profileData);
      
      return await profileService.getProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  toggleAvailability: async (isAvailable) => {
    return await profileService.updateProfile({ isAvailable });
  },

  getDonationHistory: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];
      
      const q = query(
        collection(db, "donations"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const donations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort client side for now
      donations.sort((a, b) => {
        const aTime = a.date?.toMillis ? a.date.toMillis() : 0;
        const bTime = b.date?.toMillis ? b.date.toMillis() : 0;
        return bTime - aTime;
      });
      
      return donations;
    } catch (error) {
      console.error("Error getting donation history:", error);
      return [];
    }
  }
};
