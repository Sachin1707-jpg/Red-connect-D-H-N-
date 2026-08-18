import { findMatchingDonors, isBloodCompatible } from '../src/services/matchingService.js';
import { calculateDistance } from '../src/utils/distance.js';
import { testRequest, testDonors } from '../src/utils/testMatchingData.js';

async function runTest() {
  console.log('==================================================');
  console.log('RED_CONNECT — Part 3 Smart Matching Test Pipeline');
  console.log('==================================================\n');

  console.log('--- TEST 1: Blood Compatibility Check ---');
  console.log('isBloodCompatible("O+", "O+"):', isBloodCompatible("O+", "O+")); // true
  console.log('isBloodCompatible("A+", "O+", true):', isBloodCompatible("A+", "O+", true)); // false
  console.log('isBloodCompatible("B+", "O+"):', isBloodCompatible("B+", "O+")); // false
  console.log('');

  console.log('--- TEST 2: Distance Calculation (Haversine) ---');
  testDonors.forEach(d => {
    const dist = calculateDistance(testRequest.latitude, testRequest.longitude, d.latitude, d.longitude);
    console.log(`Distance to ${d.name} (${d.bloodGroup}, available: ${d.available}): ${dist} km`);
  });
  console.log('');

  console.log('--- TEST 3: findMatchingDonors Pipeline ---');
  const results = await findMatchingDonors(testRequest, testDonors, { exactBloodMatch: true });

  console.log(`Found ${results.length} matched donors for AIIMS O+ Critical request:`);
  results.forEach((r, idx) => {
    console.log(`  [Rank ${idx + 1}] ${r.name} (${r.bloodGroup}) → ${r.distanceKm} km, ~${r.durationMinutes} min travel`);
  });

  console.log('\n--- VERIFICATION CHECKLIST ---');
  const ids = results.map(r => r.donorId);
  const containsUnavailable = ids.includes("D004");
  const containsWrongGroup = ids.includes("D005");

  console.log('Includes Donor A (D001)?', ids.includes("D001") ? '✅ YES' : '❌ NO');
  console.log('Includes Donor B (D002)?', ids.includes("D002") ? '✅ YES' : '❌ NO');
  console.log('Includes Donor C (D003)?', ids.includes("D003") ? '✅ YES' : '❌ NO');
  console.log('Excluded Unavailable Donor (D004)?', !containsUnavailable ? '✅ EXCLUDED' : '❌ FAILED');
  console.log('Excluded Wrong Blood Group Donor (D005)?', !containsWrongGroup ? '✅ EXCLUDED' : '❌ FAILED');

  if (ids.includes("D001") && ids.includes("D002") && ids.includes("D003") && !containsUnavailable && !containsWrongGroup) {
    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('\n❌ SOME TESTS FAILED!');
    process.exit(1);
  }
}

runTest().catch(console.error);
