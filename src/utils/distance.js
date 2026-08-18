/**
 * Haversine formula — approximate straight-line distance (km) between two lat/lng points.
 * Used to pre-filter donors before sending OSRM routing requests.
 *
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in kilometres
 */
export function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * calculateDistance — calculates distance in kilometers using the Haversine formula.
 * Standard utility function specified for RED_CONNECT Part 5.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in kilometres (rounded to 1 decimal place or exact float)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  const dist = haversineDistanceKm(Number(lat1), Number(lon1), Number(lat2), Number(lon2));
  return Math.round(dist * 10) / 10;
}

