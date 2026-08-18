/**
 * nominatimService.js
 *
 * Geocoding via OpenStreetMap's Nominatim API.
 * Usage policy: https://operations.osmfoundation.org/policies/nominatim/
 *
 * Important constraints:
 *  - Max 1 request/second — always debounce the caller.
 *  - Set a real User-Agent in production (server-side proxy recommended for heavy usage).
 *  - Do NOT call in a tight loop.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'RedConnect/1.0 (redconnect-app; contact@redconnect.app)';

/**
 * Search for an address/place name and return matching locations.
 *
 * @param {string} query  Free-form text, e.g. "AIIMS Delhi"
 * @param {number} [limit=5]  Max results
 * @returns {Promise<Array<{ latitude: number, longitude: number, displayName: string }>>}
 */
export async function searchAddress(query, limit = 5) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    q: query.trim(),
    format: 'json',
    limit: String(limit),
    addressdetails: '1',
  });

  const url = `${NOMINATIM_BASE}/search?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return data.map((item) => ({
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    displayName: item.display_name,
    type: item.type,
    osmId: item.osm_id,
  }));
}

/**
 * Reverse geocode a lat/lng pair to a human-readable address.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} display name
 */
export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'json',
  });

  const url = `${NOMINATIM_BASE}/reverse?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim reverse geocode failed: ${response.status}`);
  }

  const data = await response.json();
  return data.display_name ?? 'Unknown location';
}
