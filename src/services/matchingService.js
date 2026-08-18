/**
 * matchingService.js
 *
 * Smart Donor Matching & Nearby Donor Ranking for RED_CONNECT (Part 3).
 *
 * Pipeline:
 *  1. Blood Group Compatibility (`isBloodCompatible`)
 *  2. Availability Filter (`available === true` or `isAvailable === true` or `availability === true`)
 *  3. Coordinate Validation (valid `latitude` & `longitude`)
 *  4. Haversine Straight-line Distance Pre-filtering
 *  5. Top Candidate Selection (`MAX_ROUTE_CANDIDATES = 10`)
 *  6. OSRM Road Distance & Travel Time Calculation
 *  7. Final Sorting & Ranking (Nearest → Farthest)
 */

import { haversineDistanceKm, calculateDistance } from '../utils/distance.js';
import { getRoutesToMany } from './osrmService.js';

export const MAX_ROUTE_CANDIDATES = 10;

// ─── Blood Compatibility ──────────────────────────────────────────────────────

const COMPATIBILITY_MAP = {
  'A+':  ['A+', 'A-', 'O+', 'O-'],
  'A-':  ['A-', 'O-'],
  'B+':  ['B+', 'B-', 'O+', 'O-'],
  'B-':  ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+':  ['O+', 'O-'],
  'O-':  ['O-'],
};

/**
 * Check whether a donor's blood group is compatible with the requested group.
 * Supports exact matching or isolated group compatibility logic.
 *
 * @param {string} donorGroup   e.g. "O+"
 * @param {string} requestGroup e.g. "O+"
 * @param {boolean} [exactOnly=false] Set true to enforce strict exact blood group match
 * @returns {boolean}
 */
export function isBloodCompatible(donorGroup, requestGroup, exactOnly = false) {
  if (!donorGroup || !requestGroup) return false;

  const dGroup = String(donorGroup).trim().toUpperCase();
  const rGroup = String(requestGroup).trim().toUpperCase();

  if (exactOnly) {
    return dGroup === rGroup;
  }

  // Exact match check first
  if (dGroup === rGroup) return true;

  // Fallback to compatibility matrix
  const compatibleList = COMPATIBILITY_MAP[rGroup];
  return compatibleList ? compatibleList.includes(dGroup) : false;
}

// ─── Field Normalization Helpers ──────────────────────────────────────────────

function extractCoords(obj) {
  if (!obj) return null;
  const lat = Number(obj.latitude ?? obj.lat);
  const lon = Number(obj.longitude ?? obj.lng ?? obj.lon);

  if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
    return { latitude: lat, longitude: lon };
  }
  return null;
}

function isDonorAvailable(donor) {
  if (!donor) return false;
  if (donor.available === false || donor.isAvailable === false) return false;
  if (donor.available === true || donor.isAvailable === true) return true;
  if (typeof donor.availabilityStatus === 'string') {
    return donor.availabilityStatus.toLowerCase() === 'available' || donor.availabilityStatus.toLowerCase() === 'on';
  }
  if (typeof donor.availability === 'string') {
    return donor.availability.toLowerCase() === 'available' || donor.availability.toLowerCase() === 'on';
  }
  return true; // Default to true if unstated, unless explicitly false
}

// ─── Main Donor Matching Service ──────────────────────────────────────────────

/**
 * Find and rank nearby donors for a given blood request.
 *
 * @param {object} request Blood request object ({ bloodGroup, latitude, longitude, ... })
 * @param {Array<object>} donors Array of donor objects
 * @param {object} [options]
 * @param {number} [options.maxRouteCandidates=10] Candidates sent to OSRM
 * @param {boolean} [options.exactBloodMatch=false] Whether to enforce exact blood group match
 * @returns {Promise<Array<object>>} Sorted array of matched donors (Nearest → Farthest)
 */
export async function findMatchingDonors(request, donors = [], options = {}) {
  const { maxRouteCandidates = MAX_ROUTE_CANDIDATES, exactBloodMatch = false } = options;

  if (!request) {
    console.warn('[matchingService] Invalid or missing request object.');
    return [];
  }

  const reqCoords = extractCoords(request);
  if (!reqCoords) {
    console.warn('[matchingService] Hospital/Request coordinates are invalid or missing.', request);
    return [];
  }

  const reqBloodGroup = request.bloodGroup || request.requiredBloodGroup;
  if (!reqBloodGroup) {
    console.warn('[matchingService] Request has no blood group specified.');
    return [];
  }

  // Step 1 — Blood Group Filtering
  const bloodFiltered = donors.filter((d) =>
    isBloodCompatible(d.bloodGroup, reqBloodGroup, exactBloodMatch)
  );

  // Step 2 — Availability Filtering
  const availableFiltered = bloodFiltered.filter(isDonorAvailable);

  // Step 3 — Location Validation
  const validDonors = availableFiltered.filter((d) => Boolean(extractCoords(d)));

  if (validDonors.length === 0) {
    console.info(`[matchingService] No available, compatible donors with valid coordinates found for ${reqBloodGroup}.`);
    return [];
  }

  // Step 4 — Haversine Distance Pre-filtering & Sorting
  const withHaversine = validDonors.map((donor) => {
    const dCoords = extractCoords(donor);
    const haversineKm = calculateDistance(
      reqCoords.latitude,
      reqCoords.longitude,
      dCoords.latitude,
      dCoords.longitude
    );
    return { donor, dCoords, haversineKm };
  });

  withHaversine.sort((a, b) => a.haversineKm - b.haversineKm);

  // Step 5 — Select Nearest Candidates (MAX_ROUTE_CANDIDATES = 10)
  const shortlisted = withHaversine.slice(0, maxRouteCandidates);

  // Step 6 — OSRM Road Distance Calculation
  let roadResults = [];
  try {
    const origin = reqCoords;
    const destinations = shortlisted.map((item) => item.dCoords);
    roadResults = await getRoutesToMany(origin, destinations);
  } catch (err) {
    console.warn('[matchingService] OSRM routing failed — falling back to Haversine straight-line distance.', err);
    // Fallback: estimate road distance and travel time from Haversine
    roadResults = shortlisted.map((item) => ({
      distanceKm: item.haversineKm,
      durationMinutes: Math.max(1, Math.round((item.haversineKm / 30) * 60)), // ~30 km/h urban speed estimate
    }));
  }

  // Step 7 — Final Ranking & Formatting Output Array
  const matchedResults = shortlisted.map((item, index) => {
    const d = item.donor;
    const road = roadResults[index] || {
      distanceKm: item.haversineKm,
      durationMinutes: Math.max(1, Math.round((item.haversineKm / 30) * 60)),
    };

    const donorId = d.id || d.donorId || d._id;
    const name = d.name || d.donorName || 'Anonymous Donor';
    const bloodGroup = d.bloodGroup;
    const coords = item.dCoords;

    return {
      donorId,
      id: donorId,
      name,
      bloodGroup,
      available: true,
      isAvailable: true,
      latitude: coords.latitude,
      longitude: coords.longitude,
      distanceKm: road.distanceKm,
      durationMinutes: road.durationMinutes,
      donor: d, // Preserve original donor object for existing UI components
      matchReason: `Blood group ${bloodGroup} matched for request (${reqBloodGroup})`,
    };
  });

  // Sort by final road distance ascending (Nearest → Farthest)
  matchedResults.sort((a, b) => a.distanceKm - b.distanceKm);

  return matchedResults;
}

/**
 * Backward-compatible wrapper for existing components.
 */
export async function findNearbyDonors(request, donors, options = {}) {
  return findMatchingDonors(request, donors, options);
}
