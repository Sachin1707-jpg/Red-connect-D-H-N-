const User = require('../models/User');
const { getCompatibleDonorGroups } = require('../utils/bloodCompatibility');
const { kmToMetres } = require('../utils/geoHelpers');

const RADII_KM = [15, 25, 50]; // Progressive radius for critical urgency
const MIN_DONORS_THRESHOLD = 5;

/**
 * Find eligible donors for a given BloodRequest.
 * Uses progressive radius widening for 'critical' urgency.
 *
 * @param {Object} request - BloodRequest document
 * @returns {Promise<Array>} - array of matched User documents
 */
const findEligibleDonors = async (request) => {
  const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup);
  const hospitalCoords = request.hospital.location.coordinates; // [lng, lat]
  const isCritical = request.urgency === 'critical';

  const radii = isCritical ? RADII_KM : [RADII_KM[0]];
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  let donors = [];

  for (const radiusKm of radii) {
    const query = {
      role: { $in: ['donor'] },
      bloodGroup: { $in: compatibleGroups },
      isAvailable: true,
      $and: [
        {
          $or: [
            { lastDonationDate: null },
            { lastDonationDate: { $lte: ninetyDaysAgo } },
          ],
        },
      ],
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: hospitalCoords,
          },
          $maxDistance: kmToMetres(radiusKm),
        },
      },
    };

    donors = await User.find(query).select('name phone email bloodGroup location city fcmToken').limit(50);

    if (!isCritical || donors.length >= MIN_DONORS_THRESHOLD) break;

    console.log(`[Matching] Radius ${radiusKm}km: ${donors.length} donors. Widening...`);
  }

  console.log(`[Matching] Final: ${donors.length} eligible donors for ${request.bloodGroup} request`);
  return donors;
};

module.exports = { findEligibleDonors };
