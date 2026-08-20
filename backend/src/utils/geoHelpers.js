/**
 * Calculate distance in km between two [lng, lat] coordinate pairs
 * using the Haversine formula.
 */
const haversineDistance = ([lng1, lat1], [lng2, lat2]) => {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

/**
 * Convert km to metres (for MongoDB $near maxDistance)
 */
const kmToMetres = (km) => km * 1000;

/**
 * Build a GeoJSON Point from lat/lng
 */
const toGeoPoint = (lng, lat) => ({
  type: 'Point',
  coordinates: [parseFloat(lng), parseFloat(lat)],
});

module.exports = { haversineDistance, kmToMetres, toGeoPoint };
