/**
 * osrmService.js
 *
 * Road distance and travel time via OSRM public demo server.
 * Endpoint: https://router.project-osrm.org
 *
 * Note: The public demo server is rate-limited and for non-production use.
 * For production, host your own OSRM instance or use a paid routing API.
 */

const OSRM_BASE = 'https://router.project-osrm.org';

/**
 * Calculate road distance and estimated driving time between two points.
 *
 * @param {{ latitude: number, longitude: number }} origin
 * @param {{ latitude: number, longitude: number }} destination
 * @returns {Promise<{ distanceKm: number, durationMinutes: number }>}
 */
export async function getRoute(origin, destination) {
  // OSRM expects coordinates as {longitude},{latitude}
  const coords = [
    `${origin.longitude},${origin.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(';');

  const url = `${OSRM_BASE}/route/v1/driving/${coords}?overview=false`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OSRM request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error(`OSRM returned no route: ${data.code}`);
  }

  const route = data.routes[0];

  return {
    distanceKm: Math.round((route.distance / 1000) * 10) / 10,       // metres → km, 1 decimal
    durationMinutes: Math.round(route.duration / 60),                  // seconds → minutes
  };
}

/**
 * Get road distances from a single origin to multiple destinations.
 * Uses OSRM Table service (matrix API) for efficient bulk lookups.
 *
 * @param {{ latitude: number, longitude: number }} origin
 * @param {Array<{ latitude: number, longitude: number }>} destinations
 * @returns {Promise<Array<{ distanceKm: number, durationMinutes: number }>>}
 */
export async function getRoutesToMany(origin, destinations) {
  if (!destinations.length) return [];

  // Build coordinate string: origin first, then all destinations
  const allPoints = [origin, ...destinations];
  const coordStr = allPoints
    .map((p) => `${p.longitude},${p.latitude}`)
    .join(';');

  // sources=0 → only calculate from origin (index 0)
  const destinationIndices = destinations.map((_, i) => i + 1).join(';');
  const url = `${OSRM_BASE}/table/v1/driving/${coordStr}?sources=0&destinations=${destinationIndices}&annotations=duration,distance`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OSRM table request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.code !== 'Ok') {
    throw new Error(`OSRM table error: ${data.code}`);
  }

  // durations and distances are nested arrays: [sources][destinations]
  const durations = data.durations[0];   // seconds
  const distances = data.distances[0];   // metres

  return destinations.map((_, i) => ({
    distanceKm: Math.round((distances[i] / 1000) * 10) / 10,
    durationMinutes: Math.round(durations[i] / 60),
  }));
}
