/**
 * firestoreDataService.js
 *
 * Firebase/Firestore data access layer for the Maps & Smart Matching module.
 *
 * Currently returns mock data — all functions follow the exact shape expected by
 * matchingService and map components so that swapping in real Firestore calls
 * requires only changing this file.
 *
 * To connect to Firestore:
 *   import { db } from '../config/firebase';
 *   import { collection, getDocs, query, where } from 'firebase/firestore';
 *   Then replace the mock returns with Firestore queries.
 */

import {
  mockNearbyDonors,
  mockHospitals,
  mockBloodRequests,
} from '../data/mockData';

/**
 * Fetch all donors who are currently available.
 * Firestore path (when implemented): /users where role == "donor"
 *
 * @returns {Promise<Array<object>>}
 */
export async function getAvailableDonors() {
  // TODO: Replace with real Firestore query when backend is ready
  // const q = query(collection(db, 'users'), where('role', '==', 'donor'), where('isAvailable', '==', true));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Simulate async latency
  await new Promise((r) => setTimeout(r, 200));
  return mockNearbyDonors.filter((d) => d.available || d.isAvailable);
}

/**
 * Fetch all hospitals.
 * Firestore path (when implemented): /hospitals
 *
 * @returns {Promise<Array<object>>}
 */
export async function getHospitals() {
  // TODO: Replace with real Firestore query when backend is ready
  // const snapshot = await getDocs(collection(db, 'hospitals'));
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  await new Promise((r) => setTimeout(r, 150));
  return mockHospitals;
}

/**
 * Fetch all active (non-fulfilled) blood requests.
 * Firestore path (when implemented): /bloodRequests where status == "Active"
 *
 * @returns {Promise<Array<object>>}
 */
export async function getActiveBloodRequests() {
  // TODO: Replace with real Firestore query when backend is ready
  // const q = query(collection(db, 'bloodRequests'), where('status', '==', 'Active'));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  await new Promise((r) => setTimeout(r, 150));
  return mockBloodRequests.filter((r) => r.status === 'Active');
}
