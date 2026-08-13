# 🩸 RedConnect - Emergency Blood Donation & Request Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-crimson.svg)](CHANGELOG.md)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC.svg?logo=redux)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

> **RedConnect** is an open-source, life-saving digital platform designed to bridge the critical gap between voluntary blood donors, emergency patients, healthcare institutions, and blood donation NGOs. Built with a human-centric UI/UX and real-time urgency routing, RedConnect empowers communities to save lives seamlessly.

---

## 🌟 Key Features

### 🩸 For Donors
- **Emergency Alert Feed**: Receive instant geolocated notifications for matching blood group urgent requests.
- **Availability Toggle**: Easily switch status between `Ready to Donate` and `On Break` with automatic eligibility timers.
- **Donation History & Badges**: Track total donations, lives impacted, and earn community recognition badges (e.g. *Life Saver*, *Gold Hero*).
- **Gamified Rewards Store**: Earn points per donation redeemable for health checkup vouchers, partner discounts, and certificates.

### 🏥 For Hospitals & Blood Banks
- **Emergency Request Dispatcher**: Create high-priority blood requests specifying urgency, required units, patient details, and hospital location.
- **Live Inventory Dashboard**: Monitor real-time units of A+, A-, B+, B-, AB+, AB-, O+, and O- with low-stock warnings.
- **Donor Matching System**: Instantly query eligible donors within a customizable radius (e.g., 5km, 10km, 25km).

### 🤝 For NGOs & Community Organizers
- **Blood Donation Camp Manager**: Schedule, organize, and publish donation drives with registration forms and goal meters.
- **Volunteer Rosters**: Manage event volunteers and donor turnout statistics.

### 🌐 For Visitors & General Public
- **Public Emergency Request Board**: View ongoing urgent needs and pledge immediate assistance without complex friction.
- **Interactive Blood Bank Directory**: Locate verified blood banks, contact info, and open hours across cities.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18 | Declarative component-based UI |
| **State Management** | Redux Toolkit | Centralized predictable state tree |
| **Styling** | Vanilla CSS / CSS Modules | Custom design system & design tokens |
| **Icons** | Lucide React | Modern crisp SVG icons |
| **Routing** | React Router v6 | Client-side declarative routing |
| **Form Handling** | React Hook Form + Zod | Type-safe form validation |
| **Notifications** | Custom Toast System | Real-time visual alerts |
| **Build Tooling** | Vite | Lightning-fast HMR build framework |

---

## 🖼️ Screenshots Placeholder

```
+-----------------------------------------------------------------------+
|  [NAVBAR] RedConnect | Emergency Requests | Camps | Rewards | Profile  |
+-----------------------------------------------------------------------+
|  [HERO SECTION]                                                       |
|  "Every Drop Counts. Connect with Nearby Donors in Seconds."          |
|  [Emergency Request Button] [Become a Donor Button]                   |
+-----------------------------------------------------------------------+
|  [LIVE STATS GRID]                                                    |
|  1,420 Lives Saved | 385 Verified Hospitals | 12,400+ Active Donors   |
+-----------------------------------------------------------------------+
|  [ACTIVE EMERGENCY BLOOD REQUESTS CAROUSEL/GRID]                      |
|  Card 1: O- Urgent (City Hospital) - 2 Units - [Pledge Help]           |
|  Card 2: A+ Critical (St. Jude Blood Bank) - 4 Units - [Pledge Help]  |
+-----------------------------------------------------------------------+
```

---

## ⚡ Installation

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or yarn `v1.22.x`

### Setup Commands
```bash
# 1. Clone the repository
git clone https://github.com/redconnect/redconnect-frontend.git

# 2. Navigate to project root
cd redconnect-frontend

# 3. Install dependencies
npm install
```

---

## 📁 Folder Structure

```
red_connect/
├── docs/                      # 📄 Complete Project Documentation (28 Files)
├── public/                    # Static public assets, favicons, manifests
└── src/
    ├── assets/                # Images, icons, static graphic resources
    ├── components/            # Reusable UI components (Atomic design)
    │   ├── common/            # Buttons, Cards, Inputs, Modals, Badges, Loaders
    │   ├── layout/            # Navbar, Sidebar, Footer, PageWrappers
    │   └── domain/            # DonorCards, RequestForms, InventoryTable
    ├── config/                # Constants, theme definitions, app settings
    ├── hooks/                 # Custom React hooks (useAuth, useNotification)
    ├── layouts/               # Page wrapper layouts (AuthLayout, DashboardLayout)
    ├── pages/                 # Full view page components
    ├── services/              # API interfaces, HTTP clients, Mock data layer
    ├── store/                 # Redux slices, store setup, selectors
    ├── styles/                # CSS variable tokens, global stylesheets
    └── utils/                 # Formatters, validators, date helpers
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Vite development server with HMR at `http://localhost:5173` |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint analysis across codebase |
| `npm run format` | Formats all source files with Prettier |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Application Mode
VITE_APP_ENV=development

# API Base URL (Mocked locally)
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Feature Flags
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_GAMIFICATION=true

# Google Maps / Maplibre Key (Optional for location services)
VITE_MAPS_API_KEY=your_maps_api_key_here
```

---

## 🚀 Running Locally

```bash
# Start development server
npm run dev
```
Open your browser at `http://localhost:5173` to explore RedConnect.

---

## 📦 Build Instructions

```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

---

## 🌐 Deployment

RedConnect can be deployed seamlessly to Vercel, Netlify, or AWS S3 + CloudFront:

### Vercel Deployment
```bash
npx vercel --prod
```

### Netlify Deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Rewrite Rule**: Create `public/_redirects` containing `/* /index.html 200`

---

## 🔮 Future Scope
- **AI-Powered Matching**: Predict donor availability based on location history & donation schedules.
- **IoT Smart Refrigerator Sync**: Real-time automated inventory updates from hospital blood bank units.
- **WhatsApp Bot Integration**: Dispatch blood request alerts via WhatsApp API for ultra-fast community response.
- **Mobile Native App**: Cross-platform Flutter / React Native application with background push alerts.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](../LICENSE) file for details.

---

## 🤝 Contributors

Made with ❤️ by the **RedConnect Open Source Community**. Contributions are warmly welcomed! See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.
