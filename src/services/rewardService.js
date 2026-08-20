import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, orderBy, limit, increment } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { mockRewards, mockBadges } from "../data/mockData";

async function seedRewardsIfEmpty() {
  try {
    const snap = await getDocs(collection(db, "rewards"));
    if (snap.empty) {
      for (const rew of mockRewards) {
        await setDoc(doc(db, "rewards", rew.id), rew);
      }
    }
    const badgeSnap = await getDocs(collection(db, "badges"));
    if (badgeSnap.empty) {
      for (const badge of mockBadges) {
        await setDoc(doc(db, "badges", badge.id), badge);
      }
    }
  } catch (e) {
    console.warn("[rewardService] Seed warning:", e);
  }
}

export const rewardService = {
  getRewards: async () => {
    try {
      await seedRewardsIfEmpty();
      const q = query(collection(db, "rewards"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting rewards:", error);
      return [];
    }
  },

  getBadges: async () => {
    try {
      await seedRewardsIfEmpty();
      const q = query(collection(db, "badges"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting badges:", error);
      return [];
    }
  },

  getLeaderboard: async () => {
    try {
      const q = query(
        collection(db, "users"), 
        orderBy("rewardPoints", "desc"), 
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        const allUsers = await getDocs(collection(db, "users"));
        return allUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "Anonymous Donor",
          avatar: data.avatar,
          points: data.rewardPoints || 0,
          donations: data.totalDonations || 0
        };
      });
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      return [];
    }
  },

  redeemReward: async (rewardId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const rewardRef = doc(db, "rewards", rewardId);
      const rewardSnap = await getDoc(rewardRef);
      
      if (!rewardSnap.exists()) {
        throw new Error("Reward voucher not found");
      }
      
      const rewardData = rewardSnap.data();
      const pointsNeeded = rewardData.pointsCost || rewardData.points || 0;
      
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
         throw new Error("User not found");
      }
      
      const userData = userSnap.data();
      
      if ((userData.rewardPoints || 0) < pointsNeeded) {
        throw new Error("Not enough points to redeem this reward");
      }
      
      await updateDoc(userRef, {
        rewardPoints: increment(-pointsNeeded)
      });
      
      return { success: true, reward: { id: rewardId, ...rewardData } };
    } catch (error) {
      console.error("Error redeeming reward:", error);
      throw error;
    }
  }
};
