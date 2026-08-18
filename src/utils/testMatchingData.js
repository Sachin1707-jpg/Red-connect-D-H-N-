/**
 * testMatchingData.js
 *
 * Test dataset specified in Part 21 of the RED_CONNECT specification.
 */

export const testRequest = {
  id: "REQ001",
  bloodGroup: "O+",
  units: 2,
  priority: "Critical",
  hospitalName: "AIIMS",
  latitude: 28.5672,
  longitude: 77.2100
};

export const testDonors = [
  {
    id: "D001",
    name: "Donor A",
    bloodGroup: "O+",
    available: true,
    latitude: 28.5800,
    longitude: 77.2200
  },
  {
    id: "D002",
    name: "Donor B",
    bloodGroup: "O+",
    available: true,
    latitude: 28.5900,
    longitude: 77.2300
  },
  {
    id: "D003",
    name: "Donor C",
    bloodGroup: "O+",
    available: true,
    latitude: 28.6000,
    longitude: 77.2400
  },
  {
    id: "D004",
    name: "Unavailable Donor",
    bloodGroup: "O+",
    available: false,
    latitude: 28.5700,
    longitude: 77.2150
  },
  {
    id: "D005",
    name: "Wrong Blood Group",
    bloodGroup: "A+",
    available: true,
    latitude: 28.5750,
    longitude: 77.2200
  }
];
