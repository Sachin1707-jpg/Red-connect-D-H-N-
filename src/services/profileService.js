import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { mockDonations } from "../data/mockData";

async function seedDonationsIfEmpty(userId) {
  try {
    const q = query(collection(db, "donations"), where("userId", "==", userId));
    const snap = await getDocs(q);
    if (snap.empty) {
      for (const don of mockDonations) {
        await setDoc(doc(db, "donations", `${userId}_${don.id}`), {
          ...don,
          userId,
        });
      }
    }
  } catch (e) {
    console.warn("[profileService] Seed warning:", e);
  }
}

export const profileService = {
  getProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
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
    return await profileService.updateProfile({ isAvailable, available: isAvailable });
  },

  getDonationHistory: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];
      
      await seedDonationsIfEmpty(user.uid);

      const q = query(
        collection(db, "donations"),
        where("userId", "==", user.uid)
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
