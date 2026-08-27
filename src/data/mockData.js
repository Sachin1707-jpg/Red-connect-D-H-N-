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
  { id: "mhosp_1",  name: "AIIMS New Delhi",               city: "New Delhi",   phone: "+91-11-26588500", address: "Ansari Nagar, New Delhi - 110029",       latitude: 28.5672, longitude: 77.2100, rating: 4.9 },
  { id: "mhosp_2",  name: "Safdarjung Hospital",           city: "New Delhi",   phone: "+91-11-26707444", address: "Safdarjung Enclave, New Delhi",           latitude: 28.5697, longitude: 77.1993, rating: 4.5 },
  { id: "mhosp_3",  name: "RML Hospital",                  city: "New Delhi",   phone: "+91-11-23365525", address: "Baba Kharak Singh Marg, Connaught Place",  latitude: 28.6353, longitude: 77.2024, rating: 4.6 },
  { id: "mhosp_4",  name: "Fortis Hospital Vasant Kunj",  city: "New Delhi",   phone: "+91-11-42776222", address: "Sector C, Vasant Kunj, Delhi",           latitude: 28.5200, longitude: 77.1600, rating: 4.8 },
  { id: "mhosp_5",  name: "Max Super Speciality Saket",    city: "New Delhi",   phone: "+91-11-26515050", address: "Press Enclave Road, Saket, Delhi",       latitude: 28.5270, longitude: 77.2100, rating: 4.7 },
  { id: "mhosp_6",  name: "BLK-Max Super Speciality",      city: "New Delhi",   phone: "+91-11-30403040", address: "Pusa Road, Rajendra Place, Delhi",       latitude: 28.6421, longitude: 77.1874, rating: 4.6 },
  { id: "mhosp_7",  name: "Lok Nayak Hospital",            city: "New Delhi",   phone: "+91-11-23232400", address: "Jawaharlal Nehru Marg, Delhi",            latitude: 28.6401, longitude: 77.2425, rating: 4.4 },
  { id: "mhosp_8",  name: "Medanta - The Medicity",        city: "Gurugram",    phone: "+91-124-4141414", address: "CH Bakhtawar Singh Road, Sector 38, GGN", latitude: 28.4391, longitude: 77.0427, rating: 4.9 },
  { id: "mhosp_9",  name: "Fortis Memorial Research",      city: "Gurugram",    phone: "+91-124-7162200", address: "Sector 44, Gurugram",                    latitude: 28.4595, longitude: 77.0725, rating: 4.8 },
  { id: "mhosp_10", name: "Jaypee Hospital Noida",         city: "Noida",       phone: "+91-120-4122222", address: "Sector 128, Noida",                      latitude: 28.5152, longitude: 77.3712, rating: 4.7 },
  { id: "mhosp_11", name: "Yashoda Super Speciality",      city: "Ghaziabad",   phone: "+91-120-4182000", address: "Nehru Nagar, Ghaziabad",                 latitude: 28.6692, longitude: 77.4420, rating: 4.6 },
  { id: "mhosp_12", name: "Amrita Hospital Faridabad",     city: "Faridabad",   phone: "+91-129-2882882", address: "Mata Amritanandamayi Marg, Sector 88",    latitude: 28.4089, longitude: 77.3410, rating: 4.8 },
];

export const mockBloodRequests = [
  {
    id: "REQ001",
    patientName: "Rajesh Sharma (Trauma Ward)",
    hospitalName: "AIIMS New Delhi",
    hospitalId: "mhosp_1",
    bloodGroup: "O+",
    unitsRequired: 3,
    unitsPledged: 1,
    priority: "Critical",
    urgency: "Critical",
    requiredDate: "2026-08-22",
    location: "Ansari Nagar, New Delhi",
    latitude: 28.5672,
    longitude: 77.2100,
    distanceKm: 2.0,
    hospitalContact: "+91-11-26588500",
    description: "Urgent O+ blood needed for major organ surgery following highway trauma collision.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T18:00:00Z"
  },
  {
    id: "REQ002",
    patientName: "Robert Chen (ICU Bed 12)",
    hospitalName: "Safdarjung Hospital",
    hospitalId: "mhosp_2",
    bloodGroup: "O-",
    unitsRequired: 2,
    unitsPledged: 0,
    priority: "Critical",
    urgency: "Critical",
    requiredDate: "2026-08-22",
    location: "Safdarjung Enclave, New Delhi",
    latitude: 28.5697,
    longitude: 77.1993,
    distanceKm: 2.4,
    hospitalContact: "+91-11-26707444",
    description: "Urgent O-Negative blood required for acute trauma surgery. Immediate donors requested.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T19:15:00Z"
  },
  {
    id: "REQ003",
    patientName: "Maya Lin (Pediatric Ward)",
    hospitalName: "Max Super Speciality Saket",
    hospitalId: "mhosp_5",
    bloodGroup: "AB-",
    unitsRequired: 2,
    unitsPledged: 1,
    priority: "High",
    urgency: "High",
    requiredDate: "2026-08-23",
    location: "Press Enclave Road, Saket, Delhi",
    latitude: 28.5270,
    longitude: 77.2100,
    distanceKm: 4.8,
    hospitalContact: "+91-11-26515050",
    description: "Patient undergoing urgent oncology transfusion requiring rare AB-Negative unit.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T20:00:00Z"
  },
  {
    id: "REQ004",
    patientName: "Kavita Verma (Maternity)",
    hospitalName: "BLK-Max Super Speciality",
    hospitalId: "mhosp_6",
    bloodGroup: "A+",
    unitsRequired: 4,
    unitsPledged: 2,
    priority: "High",
    urgency: "High",
    requiredDate: "2026-08-22",
    location: "Pusa Road, Rajendra Place, Delhi",
    latitude: 28.6421,
    longitude: 77.1874,
    distanceKm: 5.2,
    hospitalContact: "+91-11-30403040",
    description: "High priority A+ blood required for postpartum hemorrhage patient.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T21:10:00Z"
  },
  {
    id: "REQ005",
    patientName: "Amitabh Singh (Cardiac OT)",
    hospitalName: "Medanta - The Medicity",
    hospitalId: "mhosp_8",
    bloodGroup: "B+",
    unitsRequired: 3,
    unitsPledged: 3,
    priority: "Critical",
    urgency: "Critical",
    requiredDate: "2026-08-22",
    location: "Sector 38, Gurugram",
    latitude: 28.4391,
    longitude: 77.0427,
    distanceKm: 18.5,
    hospitalContact: "+91-124-4141414",
    description: "Emergency open-heart bypass surgery requirement.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T21:30:00Z"
  },
  {
    id: "REQ006",
    patientName: "Siddharth Malhotra",
    hospitalName: "Jaypee Hospital Noida",
    hospitalId: "mhosp_10",
    bloodGroup: "B-",
    unitsRequired: 2,
    unitsPledged: 0,
    priority: "Medium",
    urgency: "Medium",
    requiredDate: "2026-08-24",
    location: "Sector 128, Noida",
    latitude: 28.5152,
    longitude: 77.3712,
    distanceKm: 16.2,
    hospitalContact: "+91-120-4122222",
    description: "Planned orthopedic procedure transfusion.",
    documentUrl: "#",
    status: "Active",
    createdAt: "2026-08-21T15:00:00Z"
  },
  {
    id: "REQ007",
    patientName: "Sunil Dutt",
    hospitalName: "RML Hospital",
    hospitalId: "mhosp_3",
    bloodGroup: "A-",
    unitsRequired: 2,
    unitsPledged: 2,
    priority: "Medium",
    urgency: "Medium",
    requiredDate: "2026-08-20",
    location: "Connaught Place, New Delhi",
    latitude: 28.6353,
    longitude: 77.2024,
    distanceKm: 3.1,
    hospitalContact: "+91-11-23365525",
    description: "Successfully fulfilled elective surgery requirement.",
    documentUrl: "#",
    status: "Fulfilled",
    createdAt: "2026-08-20T10:00:00Z"
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

export const mockVouchers = [
  { id: "v_001", title: "Free Full-Body Health Check-up", partner: "Metropolis Labs", description: "Complete blood panel + liver & kidney function tests at any Metropolis diagnostic lab.", pointsCost: 200, code: "METRO-RC-2026", unlocked: true },
  { id: "v_002", title: "Pharmacy Discount — 15% Off",   partner: "Apollo Pharmacy",  description: "15% discount on all prescription and OTC medicines at Apollo Pharmacy outlets.", pointsCost: 150, code: "APL-RC-15DISC", unlocked: true },
  { id: "v_003", title: "₹500 Hospital OPD Voucher",     partner: "Max Healthcare",   description: "₹500 off on OPD consultation at any Max Hospital across India.",         pointsCost: 300, code: "MAX-OPD-500", unlocked: true },
  { id: "v_004", title: "Free Iron Supplement Pack",     partner: "HealthKart",        description: "Free 60-day iron + multivitamin supplement pack shipped to your doorstep.", pointsCost: 100, code: "HK-IRON-FREE", unlocked: true },
  { id: "v_005", title: "Nutrition Consultation (Free)", partner: "Dietitian Network", description: "Free 45-minute online nutrition consultation with a certified dietitian.",  pointsCost: 250, code: "DIET-RC-FREE", unlocked: false },
  { id: "v_006", title: "Blood Group Tattoo — Free",     partner: "InkRedible Tattoo", description: "Get your blood group tattooed free of cost as a lifesaving identifier.",   pointsCost: 500, code: "INK-BTYPE-RC", unlocked: false },
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
  { id: "don_001", name: "Muskan Mishra", bloodGroup: "O+", distance: "0.3 km", distanceKm: 0.3, location: "Connaught Place, Delhi", phone: "+91-9711684719", isAvailable: true, available: true, lastDonation: "2026-05-10", totalDonations: 6, latitude: 28.6315, longitude: 77.2180 },
  { id: "don_002", name: "Sachin Verma", bloodGroup: "A+", distance: "0.6 km", distanceKm: 0.6, location: "Connaught Place, Delhi", phone: "+91-9648393246", isAvailable: true, available: true, lastDonation: "2026-06-12", totalDonations: 9, latitude: 28.6280, longitude: 77.2190 },
  { id: "don_003", name: "Riya Baliyan", bloodGroup: "B+", distance: "0.9 km", distanceKm: 0.9, location: "Connaught Place, Delhi", phone: "+91-9568594735", isAvailable: true, available: true, lastDonation: "2026-04-18", totalDonations: 5, latitude: 28.5700, longitude: 77.2200 },
  { id: "don_004", name: "Shivam Kumar", bloodGroup: "O-", distance: "1.1 km", distanceKm: 1.1, location: "Connaught Place, Delhi", phone: "+91-9142607920", isAvailable: true, available: true, lastDonation: "2026-05-22", totalDonations: 7, latitude: 28.5250, longitude: 77.2100 },
  { id: "don_110", name: "Sneha Reddy", bloodGroup: "O+", distance: "1.4 km", distanceKm: 1.4, location: "Saket", phone: "+91-98765-43219", isAvailable: true, available: true, lastDonation: "2026-06-20", totalDonations: 5, latitude: 28.5244, longitude: 77.2066 },
  { id: "don_117", name: "Deepika Padukone", bloodGroup: "O-", distance: "1.8 km", distanceKm: 1.8, location: "Connaught Place", phone: "+91-98765-43226", isAvailable: true, available: true, lastDonation: "2026-06-25", totalDonations: 14, latitude: 28.6304, longitude: 77.2177 },
  { id: "don_105", name: "Rohan Mehta", bloodGroup: "B+", distance: "2.0 km", distanceKm: 2.0, location: "Delhi", phone: "+91-98765-43214", isAvailable: true, available: true, lastDonation: "2026-05-25", totalDonations: 12, latitude: 28.6100, longitude: 77.1950 },
  { id: "don_104", name: "Priya Sharma", bloodGroup: "A+", distance: "3.0 km", distanceKm: 3.0, location: "Delhi", phone: "+91-98765-43213", isAvailable: true, available: true, lastDonation: "2026-02-14", totalDonations: 6, latitude: 28.6350, longitude: 77.2050 },
  { id: "don_107", name: "Amit Patel", bloodGroup: "AB+", distance: "4.5 km", distanceKm: 4.5, location: "Dwarka", phone: "+91-98765-43216", isAvailable: true, available: true, lastDonation: "2026-05-30", totalDonations: 7, latitude: 28.5921, longitude: 77.0460 },
  { id: "don_108", name: "Neha Gupta", bloodGroup: "A-", distance: "5.5 km", distanceKm: 5.5, location: "Delhi", phone: "+91-98765-43217", isAvailable: true, available: true, lastDonation: "2026-03-05", totalDonations: 2, latitude: 28.5800, longitude: 77.2600 },
  { id: "don_106", name: "Sunita Yadav", bloodGroup: "B-", distance: "6.0 km", distanceKm: 6.0, location: "Delhi", phone: "+91-98765-43215", isAvailable: true, available: true, lastDonation: "2026-01-10", totalDonations: 3, latitude: 28.6500, longitude: 77.1800 },
  { id: "don_113", name: "Shalini Sen", bloodGroup: "A+", distance: "7.8 km", distanceKm: 7.8, location: "Karol Bagh", phone: "+91-98765-43222", isAvailable: false, available: false, lastDonation: "2026-07-15", totalDonations: 3, latitude: 28.6441, longitude: 77.1895 },
  { id: "don_109", name: "Vikram Singh", bloodGroup: "AB-", distance: "8.2 km", distanceKm: 8.2, location: "Ghaziabad", phone: "+91-98765-43218", isAvailable: true, available: true, lastDonation: "2026-05-02", totalDonations: 9, latitude: 28.6710, longitude: 77.4120 },
  { id: "don_114", name: "Manish Joshi", bloodGroup: "B-", distance: "9.0 km", distanceKm: 9.0, location: "Rohini", phone: "+91-98765-43223", isAvailable: true, available: true, lastDonation: "2026-05-18", totalDonations: 6, latitude: 28.7041, longitude: 77.1025 },
  { id: "don_111", name: "Kunal Malhotra", bloodGroup: "O-", distance: "10.5 km", distanceKm: 10.5, location: "Gurugram", phone: "+91-98765-43220", isAvailable: true, available: true, lastDonation: "2026-04-18", totalDonations: 11, latitude: 28.4595, longitude: 77.0266 },
  { id: "don_112", name: "Pooja Rao", bloodGroup: "B+", distance: "11.2 km", distanceKm: 11.2, location: "Gurugram", phone: "+91-98765-43221", isAvailable: true, available: true, lastDonation: "2026-03-22", totalDonations: 4, latitude: 28.4712, longitude: 77.0420 },
  { id: "don_115", name: "Aarti Nair", bloodGroup: "AB+", distance: "12.4 km", distanceKm: 12.4, location: "Noida Sector 62", phone: "+91-98765-43224", isAvailable: true, available: true, lastDonation: "2026-06-01", totalDonations: 10, latitude: 28.6273, longitude: 77.3725 },
  { id: "don_101", name: "Garima Singh", bloodGroup: "O+", distance: "13.0 km", distanceKm: 13.0, location: "Noida", phone: "+91-98765-43210", isAvailable: true, available: true, lastDonation: "2026-05-10", totalDonations: 4, latitude: 28.5355, longitude: 77.3910 },
  { id: "don_116", name: "Vicky Kaushal", bloodGroup: "O+", distance: "14.1 km", distanceKm: 14.1, location: "Faridabad", phone: "+91-98765-43225", isAvailable: true, available: true, lastDonation: "2026-04-12", totalDonations: 8, latitude: 28.4089, longitude: 77.3178 },
  { id: "don_118", name: "Ranveer Singh", bloodGroup: "A-", distance: "15.0 km", distanceKm: 15.0, location: "Greater Noida", phone: "+91-98765-43227", isAvailable: true, available: true, lastDonation: "2026-03-29", totalDonations: 5, latitude: 28.4744, longitude: 77.5030 },
  { id: "don_102", name: "Dev Joshi", bloodGroup: "O-", distance: "20.8 km", distanceKm: 20.8, location: "Noida", phone: "+91-98765-43211", isAvailable: true, available: true, lastDonation: "2026-06-15", totalDonations: 8, latitude: 28.6250, longitude: 77.4400 },
  { id: "don_103", name: "Rahul Verma", bloodGroup: "B-", distance: "22.2 km", distanceKm: 22.2, location: "Ghaziabad", phone: "+91-98765-43212", isAvailable: true, available: true, lastDonation: "2026-04-20", totalDonations: 5, latitude: 28.6692, longitude: 77.4538 }
];


export const mockEmergencyAlerts = [
  { id: "alt_1", title: "CRITICAL: O- Shortage in Metropolis Sector 4", hospital: "Metro General Trauma Center", timeAgo: "15 mins ago", unitsNeeded: 3 },
  { id: "alt_2", title: "HIGH: AB- Needed for Pediatric Surgery", hospital: "St. Jude Children's Memorial", timeAgo: "45 mins ago", unitsNeeded: 2 }
];

// ─── NGO PORTAL MOCK DATA ─────────────────────────────────────────────────────

export const mockCamps = [
  {
    id: "camp_001",
    title: "Mega Community Blood Drive — Connaught Place",
    date: "2026-09-05",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    location: "NDMC Civic Centre, CP, New Delhi",
    address: "Parliament Street, Block A, Connaught Place, New Delhi - 110001",
    target: 200,
    registered: 162,
    requiredBloodGroups: ["O-", "O+", "A+", "B+"],
    description: "Annual central Delhi voluntary blood donation drive organized with AIIMS & RML blood banks.",
    organizer: "RedConnect NGO",
    status: "Active",
    contactPhone: "+91-98765-00300"
  },
  {
    id: "camp_002",
    title: "Corporate Donation Drive — DLF Cyber City",
    date: "2026-09-10",
    startTime: "10:00 AM",
    endTime: "06:00 PM",
    location: "DLF Cyber Hub, Building 10, Gurugram",
    address: "Phase 2, DLF Cyber City, Sector 24, Gurugram, Haryana - 122002",
    target: 150,
    registered: 88,
    requiredBloodGroups: ["All Groups"],
    description: "CSR corporate blood camp targeting IT professionals and corporate employees.",
    organizer: "Red Cross Chapter Delhi",
    status: "Active",
    contactPhone: "+91-98765-00301"
  },
  {
    id: "camp_003",
    title: "College Campus Youth Donation Drive",
    date: "2026-09-14",
    startTime: "09:30 AM",
    endTime: "04:00 PM",
    location: "IIT Delhi Campus, Hauz Khas",
    address: "Student Activity Center, IIT Campus, Hauz Khas, New Delhi - 110016",
    target: 100,
    registered: 73,
    requiredBloodGroups: ["A-", "B-", "AB-", "O-"],
    description: "Youth empowerment drive focusing on rare negative blood group collection.",
    organizer: "Youth For Blood",
    status: "Upcoming",
    contactPhone: "+91-98765-00302"
  },
  {
    id: "camp_004",
    title: "Emergency O- Collection Drive",
    date: "2026-08-20",
    startTime: "08:00 AM",
    endTime: "03:00 PM",
    location: "AIIMS Auditorium, Ansari Nagar",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029",
    target: 80,
    registered: 80,
    requiredBloodGroups: ["O-"],
    description: "Special emergency drive to replenish critical O- universal donor reserves.",
    organizer: "AIIMS Blood Bank Unit",
    status: "Completed",
    contactPhone: "+91-11-26588500"
  },
  {
    id: "camp_005",
    title: "Lajpat Nagar Community Health & Blood Drive",
    date: "2026-09-20",
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    location: "Lajpat Nagar Central Market Plaza",
    address: "Near Metro Gate 2, Lajpat Nagar II, New Delhi - 110024",
    target: 120,
    registered: 45,
    requiredBloodGroups: ["O+", "A+", "B+", "AB+"],
    description: "Weekend community donation camp with free basic health screening.",
    organizer: "RedConnect NGO",
    status: "Upcoming",
    contactPhone: "+91-98765-00303"
  },
  {
    id: "camp_006",
    title: "Mayur Vihar Residential Society Camp",
    date: "2026-09-22",
    startTime: "09:00 AM",
    endTime: "02:00 PM",
    location: "Mayur Vihar Phase 1 Clubhouse",
    address: "Pocket 1, Mayur Vihar Phase 1, Delhi - 110091",
    target: 60,
    registered: 22,
    requiredBloodGroups: ["All Groups"],
    description: "Neighborhood residential drive for local donors.",
    organizer: "Society Welfare Trust",
    status: "Upcoming",
    contactPhone: "+91-98765-00304"
  },
  {
    id: "camp_007",
    title: "Rohini Sector 7 Monsoon Donation Drive",
    date: "2026-08-15",
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    location: "Community Center, Sector 7, Rohini",
    address: "Main Ring Road, Rohini Sector 7, Delhi - 110085",
    target: 90,
    registered: 15,
    requiredBloodGroups: ["All Groups"],
    description: "Cancelled due to severe rain forecast and localized waterlogging.",
    organizer: "RedConnect NGO",
    status: "Cancelled",
    contactPhone: "+91-98765-00305"
  }
];

export const mockVolunteers = [
  { id: "vol_001", name: "Ananya Kapoor",    phone: "+91-98765-50001", bloodGroup: "O+", availability: "Available", location: "Connaught Place, Delhi", role: "Camp Coordinator",    status: "Assigned",    email: "ananya.k@example.com",    campId: "camp_001", joinedDate: "2026-08-01", lastActivity: "Today, 10:30 AM" },
  { id: "vol_002", name: "Karan Mehta",      phone: "+91-98765-50002", bloodGroup: "A+", availability: "Available", location: "Saket, Delhi", role: "Registration Desk",   status: "Assigned",    email: "karan.m@example.com",      campId: "camp_001", joinedDate: "2026-08-02", lastActivity: "Today, 09:15 AM" },
  { id: "vol_003", name: "Shreya Nair",      phone: "+91-98765-50003", bloodGroup: "B+", availability: "On Break",   location: "Gurugram, Haryana", role: "Medical Support",     status: "Assigned",    email: "shreya.n@example.com",     campId: "camp_002", joinedDate: "2026-08-05", lastActivity: "Yesterday, 04:45 PM" },
  { id: "vol_004", name: "Arjun Bhatia",     phone: "+91-98765-50004", bloodGroup: "O-", availability: "Available", location: "Hauz Khas, Delhi", role: "Donor Assistance",    status: "Pending",     email: "arjun.b@example.com",      campId: "camp_002", joinedDate: "2026-08-10", lastActivity: "2 days ago" },
  { id: "vol_005", name: "Pallavi Reddy",    phone: "+91-98765-50005", bloodGroup: "AB+", availability: "Available", location: "Noida, Sector 62", role: "Logistics",           status: "Assigned",    email: "pallavi.r@example.com",    campId: "camp_003", joinedDate: "2026-08-12", lastActivity: "Today, 11:20 AM" },
  { id: "vol_006", name: "Nikhil Sharma",    phone: "+91-98765-50006", bloodGroup: "A-", availability: "Unavailable", location: "Dwarka, Delhi", role: "Registration Desk",   status: "Pending",     email: "nikhil.s@example.com",     campId: "camp_003", joinedDate: "2026-08-15", lastActivity: "3 days ago" },
  { id: "vol_007", name: "Divya Joshi",      phone: "+91-98765-50007", bloodGroup: "B-", availability: "Available", location: "Ansari Nagar, Delhi", role: "Camp Coordinator",    status: "Assigned",    email: "divya.j@example.com",      campId: "camp_004", joinedDate: "2026-07-28", lastActivity: "Today, 08:00 AM" },
  { id: "vol_008", name: "Rahul Mishra",     phone: "+91-98765-50008", bloodGroup: "O+", availability: "Available", location: "Lajpat Nagar, Delhi", role: "Medical Support",     status: "Assigned",    email: "rahul.m@example.com",      campId: "camp_005", joinedDate: "2026-08-18", lastActivity: "Yesterday, 02:10 PM" },
  { id: "vol_009", name: "Prerna Singh",     phone: "+91-98765-50009", bloodGroup: "AB-", availability: "On Break",   location: "Mayur Vihar, Delhi", role: "Donor Assistance",    status: "Pending",     email: "prerna.s@example.com",     campId: "camp_006", joinedDate: "2026-08-20", lastActivity: "1 day ago" },
  { id: "vol_010", name: "Varun Agarwal",    phone: "+91-98765-50010", bloodGroup: "O-", availability: "Available", location: "Karol Bagh, Delhi", role: "Logistics",           status: "Assigned",    email: "varun.a@example.com",      campId: "camp_001", joinedDate: "2026-08-03", lastActivity: "Today, 01:00 PM" },
];

export const mockNgoNotifications = [
  {
    id: "ngo_notif_001",
    title: "🩸 Urgent O- Blood Requirement Alert",
    message: "Critical shortage of O-Negative units at AIIMS Trauma Center. Eligible donors requested to visit immediately.",
    type: "urgent",
    targetAudience: "O- & O+ Donors",
    sentAt: "2026-08-21T18:30:00Z",
    recipientCount: 420,
    status: "Delivered",
    sender: "RedConnect NGO Admin"
  },
  {
    id: "ngo_notif_002",
    title: "📢 Mega Connaught Place Camp Announcement",
    message: "Join us for our mega community drive at NDMC Civic Centre on Sept 5th. Free health checks for all donors!",
    type: "announcement",
    targetAudience: "All Registered Donors",
    sentAt: "2026-08-20T10:00:00Z",
    recipientCount: 1850,
    status: "Delivered",
    sender: "RedConnect NGO Admin"
  },
  {
    id: "ngo_notif_003",
    title: "📅 Reminder: Upcoming IIT Delhi Campus Drive",
    message: "Reminder to registered student donors: IIT Delhi blood drive starts at 9:30 AM on Sept 14th.",
    type: "reminder",
    targetAudience: "Camp Attendees",
    sentAt: "2026-08-19T14:15:00Z",
    recipientCount: 140,
    status: "Delivered",
    sender: "RedConnect NGO Admin"
  },
  {
    id: "ngo_notif_004",
    title: "📍 Duty Briefing for Camp Volunteers",
    message: "All assigned volunteers for Connaught Place camp please attend online briefing tomorrow at 5 PM.",
    type: "location_update",
    targetAudience: "Volunteers",
    sentAt: "2026-08-18T16:00:00Z",
    recipientCount: 25,
    status: "Delivered",
    sender: "RedConnect NGO Admin"
  }
];

export const mockShortages = [
  { id: "sh_001", bloodGroup: "O-",  hospital: "AIIMS New Delhi",              priority: "Critical", unitsNeeded: 4, location: "Ansari Nagar, Delhi",      phone: "+91-11-26588500", timeReported: "30 mins ago" },
  { id: "sh_002", bloodGroup: "AB-", hospital: "Fortis Hospital Vasant Kunj",  priority: "Critical", unitsNeeded: 2, location: "Vasant Kunj, Delhi",       phone: "+91-11-42776222", timeReported: "1 hr ago" },
  { id: "sh_003", bloodGroup: "B-",  hospital: "Safdarjung Hospital",          priority: "High",     unitsNeeded: 5, location: "Safdarjung Enclave, Delhi", phone: "+91-11-26707444", timeReported: "2 hrs ago" },
  { id: "sh_004", bloodGroup: "A-",  hospital: "Max Hospital Saket",           priority: "High",     unitsNeeded: 3, location: "Saket, Delhi",              phone: "+91-11-26515050", timeReported: "3 hrs ago" },
  { id: "sh_005", bloodGroup: "O+",  hospital: "RML Hospital Connaught Place", priority: "Medium",   unitsNeeded: 6, location: "Connaught Place, Delhi",    phone: "+91-11-23365525", timeReported: "4 hrs ago" },
];

// ─── HOSPITAL PORTAL MOCK DATA ────────────────────────────────────────────────

export const mockInventory = {
  "A+":  42,
  "A-":  8,
  "B+":  35,
  "B-":  4,
  "AB+": 14,
  "AB-": 2,
  "O+":  58,
  "O-":  6,
};

export const mockDonorResponses = [
  { id: "dr_000a", donorName: "Muskan Mishra", bloodGroup: "O+", distance: "0.3 km", availability: "Immediate", phone: "+91-9711684719", status: "Accepted" },
  { id: "dr_000b", donorName: "Sachin Verma",  bloodGroup: "A+", distance: "0.6 km", availability: "Immediate", phone: "+91-9648393246", status: "Accepted" },
  { id: "dr_000c", donorName: "Riya Baliyan",  bloodGroup: "B+", distance: "0.9 km", availability: "Within 1hr", phone: "+91-9568594735", status: "Pending"  },
  { id: "dr_000d", donorName: "Shivam Kumar",  bloodGroup: "O-", distance: "1.1 km", availability: "Within 1hr", phone: "+91-9142607920", status: "Accepted" },
  { id: "dr_001",  donorName: "Rohan Mehta",   bloodGroup: "O+", distance: "2.0 km", availability: "Immediate", phone: "+91-98765-43214", status: "Pending"  },
  { id: "dr_002",  donorName: "Sneha Reddy",   bloodGroup: "O+", distance: "1.4 km", availability: "Within 1hr", phone: "+91-98765-43219", status: "Accepted" },
  { id: "dr_003",  donorName: "Dev Joshi",     bloodGroup: "O-", distance: "20.8 km", availability: "Tomorrow",  phone: "+91-98765-43211", status: "Pending"  },
  { id: "dr_004",  donorName: "Deepika Padukone", bloodGroup: "O-", distance: "1.8 km", availability: "Immediate", phone: "+91-98765-43226", status: "Accepted" },
  { id: "dr_005",  donorName: "Manish Joshi",  bloodGroup: "B-", distance: "9.0 km", availability: "Within 2hrs", phone: "+91-98765-43223", status: "Pending"  },
  { id: "dr_006",  donorName: "Vikram Singh",  bloodGroup: "AB-", distance: "8.2 km", availability: "Tomorrow",  phone: "+91-98765-43218", status: "Rejected" },
  { id: "dr_007",  donorName: "Priya Sharma",  bloodGroup: "A+", distance: "3.0 km", availability: "Immediate", phone: "+91-98765-43213", status: "Accepted" },
  { id: "dr_008",  donorName: "Neha Gupta",    bloodGroup: "A-", distance: "5.5 km", availability: "Within 1hr", phone: "+91-98765-43217", status: "Pending"  },
];

export const mockEmergencyCases = [
  { id: "ec_001", patientName: "Ravi Kumar (ICU Bed 3)",       bloodGroup: "O-",  unitsRequired: 3, urgency: "Critical", status: "Active",    location: "ICU Ward A",        admittedAt: "2026-08-21T08:00:00Z" },
  { id: "ec_002", patientName: "Meena Agarwal (Surgery OT 2)", bloodGroup: "AB+", unitsRequired: 2, urgency: "High",     status: "Active",    location: "Operation Theatre", admittedAt: "2026-08-21T09:30:00Z" },
  { id: "ec_003", patientName: "Suresh Yadav (Trauma Ward)",   bloodGroup: "B+",  unitsRequired: 4, urgency: "Critical", status: "Active",    location: "Trauma Bay 1",      admittedAt: "2026-08-21T10:15:00Z" },
  { id: "ec_004", patientName: "Rina Patel (Maternity Ward)",  bloodGroup: "A+",  unitsRequired: 1, urgency: "Medium",   status: "Fulfilled", location: "Maternity Ward",    admittedAt: "2026-08-21T07:00:00Z" },
];

// ─── DONOR PORTAL MOCK DATA ───────────────────────────────────────────────────

export const mockDonationHistory = [
  { id: "dh_001", hospitalName: "AIIMS New Delhi",                bloodGroup: "O+", date: "2026-06-15", units: 1, status: "Verified",   certificateUrl: "#", pointsEarned: 100 },
  { id: "dh_002", hospitalName: "Safdarjung Hospital",            bloodGroup: "O+", date: "2026-03-10", units: 1, status: "Verified",   certificateUrl: "#", pointsEarned: 100 },
  { id: "dh_003", hospitalName: "Max Hospital Saket",             bloodGroup: "O+", date: "2025-12-05", units: 1, status: "Verified",   certificateUrl: "#", pointsEarned: 100 },
  { id: "dh_004", hospitalName: "Metro General Trauma Center",    bloodGroup: "O+", date: "2025-09-20", units: 1, status: "Verified",   certificateUrl: "#", pointsEarned: 100 },
  { id: "dh_005", hospitalName: "Fortis Hospital Vasant Kunj",    bloodGroup: "O+", date: "2025-06-18", units: 1, status: "Verified",   certificateUrl: "#", pointsEarned: 100 },
];

export const mockDonorStats = {
  totalDonations: 5,
  livesSaved: 15,
  rewardPoints: 500,
  isAvailable: true,
  bloodGroup: "O+",
  nextEligibleDate: "2026-09-15",
};

