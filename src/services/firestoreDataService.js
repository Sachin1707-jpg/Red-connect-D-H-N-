/**
 * firestoreDataService.js
 *
 * Real Firebase Firestore Data Layer for RED_CONNECT Maps, Spatial Search, and Matching.
 */

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Fetch all available blood donors from live Firestore database.
 * @returns {Promise<Array<object>>}
 */
export async function getAvailableDonors() {
  try {
    // Query users where role == 'donor'
    const q = query(collection(db, 'users'), where('role', '==', 'donor'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Fallback: fetch all users with coordinates if role not indexed yet
      const allUsersSnap = await getDocs(collection(db, 'users'));
      const donors = allUsersSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.available === true || u.isAvailable === true);
      return donors;
    }

    const donors = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Filter for available donors
    return donors.filter((d) => d.available === true || d.isAvailable === true || d.available === undefined);
  } catch (err) {
    console.error('[firestoreDataService] Error fetching live donors:', err);
    return [];
  }
}

/**
 * Fetch all hospitals from live Firestore database.
 * @returns {Promise<Array<object>>}
 */
export async function getHospitals() {
  try {
    const snapshot = await getDocs(collection(db, 'hospitals'));
    if (snapshot.empty) return [];
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[firestoreDataService] Error fetching live hospitals:', err);
    return [];
  }
}

/**
 * Fetch all active blood requests from live Firestore database.
 * @returns {Promise<Array<object>>}
 */
export async function getActiveBloodRequests() {
  try {
    const q = query(collection(db, 'bloodRequests'), where('status', '==', 'Active'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      const allSnap = await getDocs(collection(db, 'bloodRequests'));
      return allSnap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => r.status === 'Active');
    }

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('[firestoreDataService] Error fetching live blood requests:', err);
    return [];
  }
}
