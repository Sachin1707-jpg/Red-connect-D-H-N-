/**
 * firestoreDataService.js
 *
 * Real Firebase Firestore Data Layer for RED_CONNECT Maps, Spatial Search, and Matching.
 */

import { collection, getDocs, doc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { mockNearbyDonors, mockHospitals, mockBloodRequests } from '../data/mockData';

/**
 * Seed initial Firestore collections if they are clean/empty.
 */
async function seedInitialDataIfEmpty() {
  try {
    // Check bloodRequests
    const reqSnap = await getDocs(collection(db, 'bloodRequests'));
    if (reqSnap.empty) {
      console.log('[Firestore] Seeding initial live blood requests...');
      for (const req of mockBloodRequests) {
        await setDoc(doc(db, 'bloodRequests', req.id), {
          ...req,
          createdAt: serverTimestamp(),
        });
      }
    }

    // Check hospitals
    const hospSnap = await getDocs(collection(db, 'hospitals'));
    if (hospSnap.empty) {
      console.log('[Firestore] Seeding initial live hospitals...');
      for (const hosp of mockHospitals) {
        await setDoc(doc(db, 'hospitals', hosp.id), {
          ...hosp,
          createdAt: serverTimestamp(),
        });
      }
    }

    // Check donors/users
    const userSnap = await getDocs(collection(db, 'users'));
    if (userSnap.empty) {
      console.log('[Firestore] Seeding initial live donors...');
      for (const donor of mockNearbyDonors) {
        await setDoc(doc(db, 'users', donor.id), {
          ...donor,
          role: 'donor',
          createdAt: serverTimestamp(),
        });
      }
    }
  } catch (err) {
    console.warn('[Firestore] Auto-seed warning:', err);
  }
}

/**
 * Fetch all available blood donors from live Firestore database.
 * @returns {Promise<Array<object>>}
 */
export async function getAvailableDonors() {
  try {
    await seedInitialDataIfEmpty();

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
    await seedInitialDataIfEmpty();
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
    await seedInitialDataIfEmpty();
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
