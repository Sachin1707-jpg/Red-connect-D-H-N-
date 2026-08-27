import { collection, getDocs, doc, getDoc, updateDoc, query, orderBy, limit, increment } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { mockBadges, mockVouchers, mockLeaderboard } from "../data/mockData";

export const rewardService = {
  getRewards: async () => {
    try {
      const q = query(collection(db, "rewards"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      // Firestore is empty — return enriched mock vouchers
      return mockVouchers;
    } catch (error) {
      console.warn("[rewardService] Firestore unavailable, using mock vouchers:", error.message);
      return mockVouchers;
    }
  },

  getBadges: async () => {
    try {
      const q = query(collection(db, "badges"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      return mockBadges;
    } catch (error) {
      console.warn("[rewardService] Firestore badges unavailable, using mock badges:", error.message);
      return mockBadges;
    }
  },

  getLeaderboard: async () => {
    try {
      const q = query(collection(db, "users"), orderBy("rewardPoints", "desc"), limit(10));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs
          .map((d, i) => {
            const data = d.data();
            return {
              rank: i + 1,
              id: d.id,
              name: data.name || "Anonymous Donor",
              bloodGroup: data.bloodGroup || "O+",
              avatar: data.avatar || "",
              points: data.rewardPoints || 0,
              donations: data.totalDonations || data.donationCount || 0,
              livesSaved: data.livesSaved || 0,
            };
          })
          .filter((d) => d.points > 0);
      }
      // Firestore empty — return enriched mock leaderboard
      return mockLeaderboard;
    } catch (error) {
      console.warn("[rewardService] Firestore leaderboard unavailable, using mock:", error.message);
      return mockLeaderboard;
    }
  },

  getUserPoints: async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          return snap.data().rewardPoints || 0;
        }
      }
      // Fallback to localStorage
      const stored = localStorage.getItem("redconnect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.rewardPoints || 0;
      }
      return 500; // demo default
    } catch (error) {
      console.warn("[rewardService] Could not fetch user points:", error.message);
      return 500;
    }
  },

  redeemReward: async (rewardId, pointsCost) => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if ((userData.rewardPoints || 0) < pointsCost) {
            throw new Error("Insufficient reward points.");
          }
          await updateDoc(userRef, { rewardPoints: increment(-pointsCost) });
        }
      }

      // Also deduct from localStorage user cache
      const stored = localStorage.getItem("redconnect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.rewardPoints = Math.max(0, (parsed.rewardPoints || 0) - pointsCost);
        localStorage.setItem("redconnect_user", JSON.stringify(parsed));
      }

      const voucher = mockVouchers.find((v) => v.id === rewardId);
      return {
        success: true,
        reward: { id: rewardId, pointsCost, code: voucher?.code || "RC-GIFT-2026", ...(voucher || {}) },
      };
    } catch (error) {
      console.error("[rewardService] Redeem error:", error);
      throw error;
    }
  },

  addPoints: async (pointsToAdd) => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        await updateDoc(userRef, { rewardPoints: increment(pointsToAdd) });
      }
      // Update localStorage cache
      const stored = localStorage.getItem("redconnect_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.rewardPoints = (parsed.rewardPoints || 0) + pointsToAdd;
        localStorage.setItem("redconnect_user", JSON.stringify(parsed));
      }
      return { success: true, pointsAdded: pointsToAdd };
    } catch (error) {
      console.warn("[rewardService] addPoints error:", error.message);
      return { success: false };
    }
  },
};
