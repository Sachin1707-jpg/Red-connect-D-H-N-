import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { api } from "./api";

export const requestService = {
  getRequests: async (filters = {}) => {
    try {
      // Try Node.js Express REST API backend first
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/requests/nearby?${params}`);
      if (res.data && res.data.success && res.data.data) {
        return res.data.data.map(r => ({
          id: r._id,
          hospitalName: r.hospital?.name || r.hospitalName,
          patientName: r.patientName,
          bloodGroup: r.bloodGroup,
          unitsRequired: r.unitsNeeded || r.unitsRequired,
          unitsPledged: r.unitsFulfilled || r.unitsPledged || 0,
          urgency: r.urgency === 'critical' ? 'Critical' : r.urgency === 'urgent' ? 'High' : 'Medium',
          location: r.hospital?.address || r.location || 'Metropolis',
          status: r.status === 'open' ? 'Active' : r.status,
          createdAt: r.createdAt,
        }));
      }
    } catch (apiError) {
      console.warn("[requestService] REST API unavailable, falling back to Firestore:", apiError.message);
    }

    // Fallback to Firestore
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

      if (filters.search) {
        const searchQ = filters.search.toLowerCase();
        result = result.filter(
          (r) =>
            (r.hospitalName && r.hospitalName.toLowerCase().includes(searchQ)) ||
            (r.patientName && r.patientName.toLowerCase().includes(searchQ)) ||
            (r.location && r.location.toLowerCase().includes(searchQ))
        );
      }

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
      // Try Node.js Express REST API backend first
      const res = await api.post('/requests', {
        patientName: requestData.patientName,
        bloodGroup: requestData.bloodGroup,
        unitsNeeded: Number(requestData.unitsRequired || requestData.unitsNeeded || 1),
        urgency: (requestData.urgency || 'Critical').toLowerCase(),
        hospital: {
          name: requestData.hospitalName || 'Metro General Hospital',
          address: requestData.location || 'Metropolis',
          location: { type: 'Point', coordinates: [77.2090, 28.6139] },
        },
        description: requestData.description || '',
      });

      if (res.data && res.data.success && res.data.data) {
        const r = res.data.data;
        return {
          id: r._id,
          ...r,
          status: 'Active',
        };
      }
    } catch (apiError) {
      console.warn("[requestService] REST API create failed, falling back to Firestore:", apiError.message);
    }

    // Fallback to Firestore
    try {
      const newReq = {
        ...requestData,
        unitsPledged: 0,
        status: "Active",
        distanceKm: Math.floor(Math.random() * 10) + 1,
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
      const res = await api.post(`/requests/${requestId}/respond`, { status: 'accepted' });
      if (res.data && res.data.success) {
        return { id: requestId, ...res.data.data };
      }
    } catch (apiError) {
      console.warn("[requestService] REST pledge failed, falling back to Firestore:", apiError.message);
    }

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
      await api.delete(`/requests/${requestId}`);
      return requestId;
    } catch (apiError) {
      console.warn("[requestService] REST delete failed, falling back to Firestore:", apiError.message);
    }

    try {
      await deleteDoc(doc(db, "bloodRequests", requestId));
      return requestId;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  }
};
