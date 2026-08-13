# 📊 Mock Datasets Specification - RedConnect

This document contains deterministic, realistic JSON mock datasets used by the application service layer to simulate backend responses during initial development phases.

---

## 1. Users Dataset (`users.json`)

```json
[
  {
    "id": "usr_donor_01",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@example.com",
    "role": "donor",
    "phone": "+1-555-0147",
    "bloodGroup": "O-",
    "isAvailable": true,
    "city": "Metropolis",
    "totalDonations": 8,
    "rewardPoints": 850,
    "lastDonationDate": "2026-03-12",
    "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    "id": "usr_hosp_01",
    "name": "City General Hospital & Trauma Center",
    "email": "emergency@citygeneral.org",
    "role": "hospital",
    "phone": "+1-555-0199",
    "city": "Metropolis",
    "address": "742 Evergreen Terrace, Sector 4",
    "licenseNumber": "HOSP-99201-AX"
  },
  {
    "id": "usr_ngo_01",
    "name": "Red Cross Community Foundation",
    "email": "contact@redcrosscommunity.org",
    "role": "ngo",
    "phone": "+1-555-0122",
    "city": "Metropolis"
  }
]
```

---

## 2. Emergency Blood Requests Dataset (`blood_requests.json`)

```json
[
  {
    "id": "req_101",
    "hospitalName": "City General Hospital",
    "hospitalId": "usr_hosp_01",
    "bloodGroup": "O-",
    "unitsNeeded": 3,
    "unitsPledged": 2,
    "urgency": "Critical",
    "patientName": "Robert Chen (ICU Bed 12)",
    "contactPerson": "Dr. Aris Thorne",
    "contactPhone": "+1-555-0199",
    "location": "Metropolis, 3.2 km away",
    "status": "Active",
    "createdAt": "2026-07-22T08:15:00Z"
  },
  {
    "id": "req_102",
    "hospitalName": "St. Jude Children's Hospital",
    "hospitalId": "usr_hosp_02",
    "bloodGroup": "AB-",
    "unitsNeeded": 2,
    "unitsPledged": 0,
    "urgency": "Critical",
    "patientName": "Maya Lin (Pediatric Ward)",
    "contactPerson": "Nurse Elena Vance",
    "contactPhone": "+1-555-0341",
    "location": "Metropolis, 5.8 km away",
    "status": "Active",
    "createdAt": "2026-07-22T09:00:00Z"
  },
  {
    "id": "req_103",
    "hospitalName": "Memorial Health Institute",
    "hospitalId": "usr_hosp_03",
    "bloodGroup": "A+",
    "unitsNeeded": 4,
    "unitsPledged": 4,
    "urgency": "High",
    "patientName": "David Miller",
    "contactPerson": "Blood Bank Desk",
    "contactPhone": "+1-555-0881",
    "location": "Metropolis, 8.1 km away",
    "status": "Fulfilled",
    "createdAt": "2026-07-21T14:20:00Z"
  }
]
```

---

## 3. Hospital Inventories Dataset (`inventory.json`)

```json
{
  "hospitalId": "usr_hosp_01",
  "hospitalName": "City General Hospital",
  "lastUpdated": "2026-07-22T09:30:00Z",
  "stocks": [
    { "bloodGroup": "A+", "units": 18, "threshold": 5, "status": "Normal" },
    { "bloodGroup": "A-", "units": 4, "threshold": 5, "status": "Low" },
    { "bloodGroup": "B+", "units": 22, "threshold": 5, "status": "Normal" },
    { "bloodGroup": "B-", "units": 3, "threshold": 5, "status": "Low" },
    { "bloodGroup": "AB+", "units": 8, "threshold": 5, "status": "Normal" },
    { "bloodGroup": "AB-", "units": 1, "threshold": 3, "status": "Critical" },
    { "bloodGroup": "O+", "units": 35, "threshold": 10, "status": "Normal" },
    { "bloodGroup": "O-", "units": 2, "threshold": 5, "status": "Critical" }
  ]
}
```

---

## 4. Rewards & Badges Dataset (`rewards.json`)

```json
{
  "userBalance": 850,
  "badges": [
    { "id": "b1", "title": "First Blood", "description": "Completed 1st voluntary donation", "unlocked": true, "icon": "droplet" },
    { "id": "b2", "title": "Emergency Hero", "description": "Responded to critical O- alert", "unlocked": true, "icon": "zap" },
    { "id": "b3", "title": "Gold Lifesaver", "description": "Completed 5+ verified donations", "unlocked": true, "icon": "award" },
    { "id": "b4", "title": "Legendary Guardian", "description": "Completed 15+ verified donations", "unlocked": false, "icon": "shield" }
  ],
  "vouchers": [
    { "id": "v1", "title": "Full Body Health Checkup Coupon", "pointsCost": 500, "partner": "Apollo Diagnostics" },
    { "id": "v2", "title": "$20 Pharmacy Voucher", "pointsCost": 300, "partner": "CVS Health" },
    { "id": "v3", "title": "Organic Nutrition Gift Basket", "pointsCost": 600, "partner": "Whole Foods" }
  ]
}
```

---

## 5. Leaderboard Dataset (`leaderboard.json`)

```json
[
  { "rank": 1, "name": "Marcus Aurelius", "bloodGroup": "O-", "donations": 24, "impactCount": 72 },
  { "rank": 2, "name": "Sarah Jenkins", "bloodGroup": "O-", "donations": 8, "impactCount": 24 },
  { "rank": 3, "name": "David K. Stern", "bloodGroup": "B-", "donations": 7, "impactCount": 21 }
]
```
