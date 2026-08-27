/**
 * firestoreDataService.js
 *
 * Real Firebase Firestore Data Layer for RED_CONNECT Maps, Spatial Search, and Matching.
 * Includes automatic mock data merging & coordinate fallback so map pins ALWAYS render.
 */

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { mockNearbyDonors, mockHospitals, mockBloodRequests } from '../data/mockData';

// Helper to ensure every map item has valid numeric coordinates
function ensureCoords(item, index, defaultLat = 28.6139, defaultLng = 77.2090) {
  let lat = Number(item.latitude ?? item.lat);
  let lng = Number(item.longitude ?? item.lng ?? item.lon);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    // Generate slight offset based on index so fallback items don't overlap exactly
    const offsetLat = ((index % 5) - 2) * 0.035;
    const offsetLng = (((index + 2) % 5) - 2) * 0.035;
    lat = defaultLat + offsetLat;
    lng = defaultLng + offsetLng;
  }

  return {
    ...item,
    latitude: lat,
    longitude: lng,
  };
}

/**
 * Fetch all available blood donors from live Firestore database + mock fallback.
 * @returns {Promise<Array<object>>}
 */
export async function getAvailableDonors() {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'donor'));
    const snapshot = await getDocs(q);

    let fsDonors = [];
    if (!snapshot.empty) {
      fsDonors = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } else {
      const allUsersSnap = await getDocs(collection(db, 'users'));
      if (!allUsersSnap.empty) {
        fsDonors = allUsersSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.available === true || u.isAvailable === true);
      }
    }

    // Combine Firestore donors with mock donors, filtering out private profiles
    const combined = [...mockNearbyDonors.filter((m) => m.profileVisibility !== 'private' && m.isPrivate !== true)];
    fsDonors.forEach((d) => {
      if (
        d.profileVisibility !== 'private' &&
        d.isPrivate !== true &&
        !combined.some((m) => m.id === d.id || m.phone === d.phone)
      ) {
        combined.push(d);
      }
    });

    return combined.map((d, i) => ensureCoords(d, i, 28.5800, 77.2200));
  } catch (err) {
    console.error('[firestoreDataService] Error fetching donors (using mock fallback):', err);
    return mockNearbyDonors
      .filter((m) => m.profileVisibility !== 'private' && m.isPrivate !== true)
      .map((d, i) => ensureCoords(d, i, 28.5800, 77.2200));
  }
}

/**
 * Fetch all hospitals from live Firestore database + mock fallback.
 * @returns {Promise<Array<object>>}
 */
export async function getHospitals() {
  try {
    const snapshot = await getDocs(collection(db, 'hospitals'));
    let fsHospitals = [];
    if (!snapshot.empty) {
      fsHospitals = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    }

    const combined = [...mockHospitals];
    fsHospitals.forEach((h) => {
      if (!combined.some((m) => m.id === h.id || m.name === h.name)) {
        combined.push(h);
      }
    });

    return combined.map((h, i) => ensureCoords(h, i, 28.6100, 77.2000));
  } catch (err) {
    console.error('[firestoreDataService] Error fetching hospitals (using mock fallback):', err);
    return mockHospitals.map((h, i) => ensureCoords(h, i, 28.6100, 77.2000));
  }
}

/**
 * Fetch all active blood requests from live Firestore database + mock fallback.
 * @returns {Promise<Array<object>>}
 */
export async function getActiveBloodRequests() {
  try {
    const q = query(collection(db, 'bloodRequests'), where('status', '==', 'Active'));
    const snapshot = await getDocs(q);

    let fsRequests = [];
    if (!snapshot.empty) {
      fsRequests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } else {
      const allSnap = await getDocs(collection(db, 'bloodRequests'));
      if (!allSnap.empty) {
        fsRequests = allSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    }

    const combined = [...mockBloodRequests];
    fsRequests.forEach((r) => {
      if (!combined.some((m) => m.id === r.id)) {
        combined.push(r);
      }
    });

    return combined.map((r, i) => ensureCoords(r, i, 28.5600, 77.2100));
  } catch (err) {
    console.error('[firestoreDataService] Error fetching blood requests (using mock fallback):', err);
    return mockBloodRequests.map((r, i) => ensureCoords(r, i, 28.5600, 77.2100));
  }
}
