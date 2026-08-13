import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const requestService = {
  getRequests: async (filters = {}) => {
    try {
      let q = collection(db, "bloodRequests");
      
      if (filters.bloodGroup && filters.bloodGroup !== 'ALL') {
        q = query(q, where("bloodGroup", "==", filters.bloodGroup));
      }

      if (filters.urgency && filters.urgency !== 'ALL') {
        q = query(q, where("urgency", "==", filters.urgency));
      }
      
      const querySnapshot = await getDocs(q);
      let result = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client side search for text since firestore doesn't support 'includes' easily
      if (filters.search) {
        const searchQ = filters.search.toLowerCase();
        result = result.filter(
          (r) =>
            (r.hospitalName && r.hospitalName.toLowerCase().includes(searchQ)) ||
            (r.patientName && r.patientName.toLowerCase().includes(searchQ)) ||
            (r.location && r.location.toLowerCase().includes(searchQ))
        );
      }

      // Sort by createdAt client side if needed (usually better to do with firestore orderBy but requires indexes)
      result.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      return result;
    } catch (error) {
      console.error("Error getting requests:", error);
      throw error;
    }
  },

  createRequest: async (requestData) => {
    try {
      const newReq = {
        ...requestData,
        unitsPledged: 0,
        status: "Active",
        distanceKm: Math.floor(Math.random() * 10) + 1, // Mock distance for now
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "bloodRequests"), newReq);
      return { id: docRef.id, ...newReq };
    } catch (error) {
      console.error("Error creating request:", error);
      throw error;
    }
  },

  pledgeRequest: async (requestId) => {
    try {
      const reqRef = doc(db, "bloodRequests", requestId);
      const reqSnap = await getDoc(reqRef);
      
      if (!reqSnap.exists()) {
        throw new Error("Request not found");
      }
      
      const data = reqSnap.data();
      const newUnitsPledged = (data.unitsPledged || 0) + 1;
      const newStatus = newUnitsPledged >= data.unitsRequired ? "Fulfilled" : "Active";
      
      await updateDoc(reqRef, {
        unitsPledged: newUnitsPledged,
        status: newStatus
      });
      
      return { id: requestId, ...data, unitsPledged: newUnitsPledged, status: newStatus };
    } catch (error) {
      console.error("Error pledging request:", error);
      throw error;
    }
  },

  deleteRequest: async (requestId) => {
    try {
      await deleteDoc(doc(db, "bloodRequests", requestId));
      return requestId;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  }
};
