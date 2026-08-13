export const mockUsers = [
  {
    id: "usr_001",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    role: "donor",
    phone: "+1-555-0147",
    bloodGroup: "O-",
    isAvailable: true,
    age: 28,
    weight: "64 kg",
    location: "Metropolis Central",
    address: "742 Evergreen Terrace, Sector 4, Metropolis",
    emergencyContact: "+1-555-9988 (Brother - Mark)",
    lastDonationDate: "2026-03-12",
    totalDonations: 8,
    livesSaved: 24,
    rewardPoints: 850,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "usr_002",
    name: "City General Hospital & Trauma Center",
    email: "emergency@citygeneral.org",
    role: "hospital",
    phone: "+1-555-0199",
    bloodGroup: "N/A",
    location: "Downtown Medical District",
    address: "450 Health Ave, Suite 100, Metropolis",
    licenseNumber: "HOSP-99201-AX",
    avatar: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150"
  },
  {
    id: "usr_003",
    name: "Red Cross Community Foundation",
    email: "contact@redcrosscommunity.org",
    role: "ngo",
    phone: "+1-555-0122",
    location: "North Metropolis Suburbs",
    address: "12 Humanitarian Way, Metropolis",
    avatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150"
  }
];

export const mockHospitals = [
  {
    id: "hosp_101",
    name: "Metro General Trauma Center",
    city: "Metropolis",
    distanceKm: 2.4,
    phone: "+1-555-8832",
    address: "450 Health Ave",
    availableUnits: { "A+": 12, "A-": 2, "B+": 18, "B-": 3, "AB+": 6, "AB-": 1, "O+": 25, "O-": 2 },
    rating: 4.8
  },
  {
    id: "hosp_102",
    name: "St. Jude Children's Memorial",
    city: "Metropolis",
    distanceKm: 5.1,
    phone: "+1-555-0341",
    address: "88 Pediatric Lane",
    availableUnits: { "A+": 8, "A-": 0, "B+": 15, "B-": 2, "AB+": 4, "AB-": 0, "O+": 19, "O-": 1 },
    rating: 4.9
  },
  {
    id: "hosp_103",
    name: "Mercy Care Hospital & Blood Bank",
    city: "Metropolis",
    distanceKm: 7.8,
    phone: "+1-555-7711",
    address: "1200 Care Blvd",
    availableUnits: { "A+": 20, "A-": 5, "B+": 30, "B-": 4, "AB+": 10, "AB-": 2, "O+": 40, "O-": 6 },
    rating: 4.7
  }
];

export const mockBloodRequests = [
  {
    id: "req_001",
    patientName: "Robert Chen (ICU Ward Bed 12)",
    hospitalName: "Metro General Trauma Center",
    hospitalId: "hosp_101",
    bloodGroup: "O-",
    unitsRequired: 3,
    unitsPledged: 2,
    priority: "Emergency",
    urgency: "Critical",
    requiredDate: "2026-07-22",
    location: "Metropolis Central",
    distanceKm: 2.4,
    hospitalContact: "+1-555-8832",
    description: "Urgent O-Negative blood required for acute trauma surgery following major motor accident. Immediate donors requested.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-07-22T08:15:00Z"
  },
  {
    id: "req_002",
    patientName: "Maya Lin (Pediatric Oncology)",
    hospitalName: "St. Jude Children's Memorial",
    hospitalId: "hosp_102",
    bloodGroup: "AB-",
    unitsRequired: 2,
    unitsPledged: 0,
    priority: "High",
    urgency: "High",
    requiredDate: "2026-07-23",
    location: "North Metropolis",
    distanceKm: 5.1,
    hospitalContact: "+1-555-0341",
    description: "Patient undergoing urgent chemotherapy session requiring rare AB-Negative blood unit transfusion.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-07-22T09:00:00Z"
  },
  {
    id: "req_003",
    patientName: "David Miller",
    hospitalName: "Mercy Care Hospital",
    hospitalId: "hosp_103",
    bloodGroup: "A+",
    unitsRequired: 4,
    unitsPledged: 4,
    priority: "Medium",
    urgency: "Medium",
    requiredDate: "2026-07-21",
    location: "East Metropolis",
    distanceKm: 7.8,
    hospitalContact: "+1-555-7711",
    description: "Elective orthopedic hip replacement surgery scheduled.",
    documentUrl: "#",
    status: "Fulfilled",
    createdAt: "2026-07-21T14:20:00Z"
  },
  {
    id: "req_004",
    patientName: "Elena Vance (Cardiac Surgery)",
    hospitalName: "Metro General Trauma Center",
    hospitalId: "hosp_101",
    bloodGroup: "B-",
    unitsRequired: 2,
    unitsPledged: 1,
    priority: "Emergency",
    urgency: "Critical",
    requiredDate: "2026-07-22",
    location: "Metropolis Central",
    distanceKm: 2.4,
    hospitalContact: "+1-555-8832",
    description: "B-Negative units required for emergency bypass surgery.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-07-22T07:45:00Z"
  }
];

export const mockDonations = [
  {
    id: "don_901",
    hospitalName: "Metro General Trauma Center",
    bloodGroup: "O-",
    date: "2026-03-12",
    units: 1,
    status: "Verified",
    certificateUrl: "#",
    pointsEarned: 100
  },
  {
    id: "don_902",
    hospitalName: "St. Jude Children's Hospital",
    bloodGroup: "O-",
    date: "2025-11-04",
    units: 1,
    status: "Verified",
    certificateUrl: "#",
    pointsEarned: 100
  },
  {
    id: "don_903",
    hospitalName: "Mercy Care Hospital",
    bloodGroup: "O-",
    date: "2025-07-19",
    units: 1,
    status: "Verified",
    certificateUrl: "#",
    pointsEarned: 100
  }
];

export const mockRewards = [
  {
    id: "rew_1",
    title: "Full Body Diagnostic Health Pass",
    partner: "Apollo Healthcare Center",
    pointsCost: 500,
    category: "Health & Wellness",
    description: "Includes complete lipid profile, blood sugar, and CBC analysis at any partner center.",
    unlocked: true,
    code: "RED-APOLLO-500"
  },
  {
    id: "rew_2",
    title: "$25 Pharmacy E-Voucher",
    partner: "CVS Health & Wellness",
    pointsCost: 300,
    category: "Pharmacy",
    description: "Valid for medical supplies, vitamins, and personal care products.",
    unlocked: true,
    code: "RED-CVS-300"
  },
  {
    id: "rew_3",
    title: "Organic Nutrition Basket",
    partner: "Whole Foods Market",
    pointsCost: 750,
    category: "Nutrition",
    description: "Curated organic superfood nutrition hamper delivered to your door.",
    unlocked: true,
    code: "RED-WHOLE-750"
  },
  {
    id: "rew_4",
    title: "VIP Health Screening Package",
    partner: "Mayo Clinic Partner Labs",
    pointsCost: 1200,
    category: "Health & Wellness",
    description: "Comprehensive cardiac and metabolic wellness consultation.",
    unlocked: false,
    code: "LOCKED"
  }
];

export const mockBadges = [
  { id: "b1", title: "First Blood", description: "Completed 1st voluntary donation", unlocked: true, icon: "Droplet", date: "2024-05-10" },
  { id: "b2", title: "Emergency Hero", description: "Responded to critical O- alert within 30 mins", unlocked: true, icon: "Zap", date: "2025-11-04" },
  { id: "b3", title: "Gold Lifesaver", description: "Completed 5+ verified donations", unlocked: true, icon: "Award", date: "2026-03-12" },
  { id: "b4", title: "Legendary Guardian", description: "Saved over 20+ lives through pledges", unlocked: true, icon: "Shield", date: "2026-03-12" },
  { id: "b5", title: "Century Club Donor", description: "Reach 100 total donation milestones", unlocked: false, icon: "Crown", date: null }
];

export const mockLeaderboard = [
  { rank: 1, name: "Dr. Marcus Aurelius", bloodGroup: "O-", donations: 24, livesSaved: 72, points: 2400, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { rank: 2, name: "Sarah Jenkins", bloodGroup: "O-", donations: 8, livesSaved: 24, points: 850, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { rank: 3, name: "David K. Stern", bloodGroup: "B-", donations: 7, livesSaved: 21, points: 700, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { rank: 4, name: "Elena Rostova", bloodGroup: "AB-", donations: 6, livesSaved: 18, points: 600, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { rank: 5, name: "Michael Chang", bloodGroup: "A-", donations: 5, livesSaved: 15, points: 500, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150" }
];

export const mockNotifications = [
  {
    id: "notif_101",
    type: "emergency",
    title: "🚨 URGENT: Critical O- Blood Needed nearby",
    message: "Metro General Trauma Center requires 3 units of O- Negative blood immediately.",
    timestamp: "10 minutes ago",
    read: false,
    link: "/requests"
  },
  {
    id: "notif_102",
    type: "pledge_accepted",
    title: "✅ Donation Pledge Confirmed",
    message: "Metro General Hospital accepted your pledge for Robert Chen.",
    timestamp: "1 hour ago",
    read: false,
    link: "/dashboard"
  },
  {
    id: "notif_103",
    type: "reminder",
    title: "🩸 Eligibility Reminder",
    message: "You are officially eligible for your next blood donation!",
    timestamp: "1 day ago",
    read: true,
    link: "/profile"
  },
  {
    id: "notif_104",
    type: "reward",
    title: "🏆 Badge Unlocked: Gold Lifesaver",
    message: "Congratulations! You earned 100 points and the Gold Lifesaver badge.",
    timestamp: "2 days ago",
    read: true,
    link: "/rewards"
  }
];

export const mockNearbyDonors = [
  { id: "don_1", name: "Alex Vance", bloodGroup: "O-", distanceKm: 1.2, isAvailable: true, phone: "+1-555-0011" },
  { id: "don_2", name: "Jessica Taylor", bloodGroup: "O-", distanceKm: 2.8, isAvailable: true, phone: "+1-555-0022" },
  { id: "don_3", name: "Brian Lawson", bloodGroup: "A+", distanceKm: 3.4, isAvailable: true, phone: "+1-555-0033" },
  { id: "don_4", name: "Chloe Bennett", bloodGroup: "AB-", distanceKm: 4.1, isAvailable: false, phone: "+1-555-0044" }
];

export const mockEmergencyAlerts = [
  { id: "alt_1", title: "CRITICAL: O- Shortage in Metropolis Sector 4", hospital: "Metro General Trauma Center", timeAgo: "15 mins ago", unitsNeeded: 3 },
  { id: "alt_2", title: "HIGH: AB- Needed for Pediatric Surgery", hospital: "St. Jude Children's Memorial", timeAgo: "45 mins ago", unitsNeeded: 2 }
];
