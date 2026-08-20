import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { api } from "./api";

export const requestService = {
  getRequests: async (filters = {}) => {
    let mongoResults = [];
    let firestoreResults = [];

    // 1. Try Express REST API (MongoDB)
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v !== 'ALL' && v !== ''))
      ).toString();
      const res = await api.get(`/requests/nearby${params ? `?${params}` : ''}`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        mongoResults = res.data.data.map(r => ({
          id: r._id,
          _mongoId: r._id,
          hospitalName: r.hospital?.name || r.hospitalName || 'Hospital',
          patientName: r.patientName,
          bloodGroup: r.bloodGroup,
          unitsRequired: r.unitsNeeded || r.unitsRequired || 1,
          unitsPledged: r.unitsFulfilled || r.unitsPledged || 0,
          urgency: r.urgency === 'critical' ? 'Critical' : r.urgency === 'urgent' ? 'High' : 'Medium',
          location: r.hospital?.address || r.location || 'Metropolis',
          status: (r.status === 'open' || r.status === 'active' || r.status === 'Active') ? 'Active' : r.status,
          createdAt: r.createdAt,
          description: r.description || '',
        }));
      }
    } catch (apiError) {
      console.warn("[requestService] REST API unavailable, using Firestore only:", apiError.message);
    }

    // 2. Always fetch from Firestore as well (catches offline-created requests)
    try {
      let q = collection(db, "bloodRequests");
      const conditions = [];

      if (filters.bloodGroup && filters.bloodGroup !== 'ALL') {
        conditions.push(where("bloodGroup", "==", filters.bloodGroup));
      }

      const fsQuery = conditions.length > 0 ? query(q, ...conditions) : q;
      const querySnapshot = await getDocs(fsQuery);
      let fsResult = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter by status — Firestore stores 'Active'
      fsResult = fsResult.filter(r => r.status === 'Active' || r.status === 'active' || r.status === 'open');

      if (filters.urgency && filters.urgency !== 'ALL') {
        fsResult = fsResult.filter(r => (r.urgency || '').toLowerCase() === filters.urgency.toLowerCase());
      }

      if (filters.search) {
        const searchQ = filters.search.toLowerCase();
        fsResult = fsResult.filter(r =>
          (r.hospitalName && r.hospitalName.toLowerCase().includes(searchQ)) ||
          (r.patientName && r.patientName.toLowerCase().includes(searchQ)) ||
          (r.location && r.location.toLowerCase().includes(searchQ))
        );
      }

      firestoreResults = fsResult;
    } catch (error) {
      console.warn("[requestService] Firestore fetch warning:", error.message);
    }

    // 3. Merge: prefer MongoDB results, add Firestore-only docs (no MongoDB equivalent)
    const mongoIds = new Set(mongoResults.map(r => r.id));
    const uniqueFirestore = firestoreResults.filter(r => !mongoIds.has(r.id));
    const merged = [...mongoResults, ...uniqueFirestore];

    // Sort by createdAt descending
    merged.sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    if (merged.length > 0) return merged;

    // Final fallback: throw if truly empty and both failed
    if (mongoResults.length === 0 && firestoreResults.length === 0) {
      return []; // return empty rather than throw — no data is not an error
    }
    return merged;
  },


  createRequest: async (requestData) => {
    let createdRecord = null;

    // Normalize urgency: frontend uses 'Critical'/'High'/'Medium', backend expects 'critical'/'urgent'/'planned'
    const urgencyMap = { critical: 'critical', high: 'urgent', medium: 'planned', urgent: 'urgent', planned: 'planned' };
    const normalizedUrgency = urgencyMap[(requestData.urgency || 'Critical').toLowerCase()] || 'urgent';

    try {
      // 1. Try Node.js Express REST API backend
      const res = await api.post('/requests', {
        patientName: requestData.patientName,
        bloodGroup: requestData.bloodGroup,
        unitsNeeded: Number(requestData.unitsRequired || requestData.unitsNeeded || 1),
        urgency: normalizedUrgency,
        hospital: {
          name: requestData.hospitalName || 'Hospital',
          address: requestData.location || '',
          location: {
            type: 'Point',
            coordinates: requestData.coordinates || [
              requestData.longitude ?? 77.2090,
              requestData.latitude ?? 28.6139,
            ],
          },
        },
        description: requestData.description || '',
      });

      if (res.data && res.data.success && res.data.data) {
        const r = res.data.data;
        createdRecord = {
          id: r._id,
          ...r,
          hospitalName: requestData.hospitalName,
          unitsRequired: Number(requestData.unitsRequired || 1),
          location: requestData.location,
          status: 'Active',
        };
      }
    } catch (apiError) {
      console.warn("[requestService] REST API create fallback to Firestore:", apiError.message);
    }

    // 2. Always persist to Firestore as well so real-time maps & Firestore queries see it
    try {
      const newReq = {
        patientName: requestData.patientName,
        hospitalName: requestData.hospitalName || 'Hospital',
        bloodGroup: requestData.bloodGroup,
        unitsRequired: Number(requestData.unitsRequired || requestData.unitsNeeded || 1),
        unitsPledged: 0,
        urgency: requestData.urgency || 'Critical',
        location: requestData.location || 'Metropolis',
        hospitalContact: requestData.hospitalContact || '',
        description: requestData.description || '',
        status: "Active",
        distanceKm: Math.floor(Math.random() * 10) + 1,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "bloodRequests"), newReq);
      if (!createdRecord) {
        createdRecord = { id: docRef.id, ...newReq };
      }
    } catch (fsErr) {
      console.warn("[requestService] Firestore create write warning:", fsErr.message);
    }

    if (createdRecord) return createdRecord;
    throw new Error('Failed to persist request to database');
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
