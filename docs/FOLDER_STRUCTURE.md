# 📁 Detailed Folder Structure - RedConnect

Comprehensive layout of files and directories within `src/` and root configurations.

---

## 1. Primary Source Directory (`src/`)

```
src/
├── main.jsx                    # Application bootstrapping entrypoint
├── App.jsx                     # Top-level application component with providers
├── index.css                   # Core CSS variable design tokens & resets
│
├── assets/                     # Graphic resources
│   ├── icons/                  # Custom SVG icon components
│   ├── images/                 # Optimized WebP illustrations
│   └── badges/                 # Gamification badge vectors
│
├── components/                 # Reusable UI component modules
│   ├── common/                 # Unopinionated UI primitives
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── Button.module.css
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── Table/
│   │   ├── Loader/
│   │   ├── Toast/
│   │   ├── Avatar/
│   │   └── Pagination/
│   │
│   ├── layout/                 # Structural page components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── ToastContainer.jsx
│   │
│   └── domain/                 # Domain-specific smart components
│       ├── BloodTypeBadge.jsx
│       ├── EmergencyRequestCard.jsx
│       ├── InventoryStockGrid.jsx
│       ├── CampCard.jsx
│       └── RewardItemCard.jsx
│
├── config/                     # System constants & theme rules
│   ├── theme.js                # Design token JavaScript mappings
│   ├── constants.js            # App configuration values & blood groups
│   └── routes.config.js        # Route path constants
│
├── hooks/                      # Custom stateful hooks
│   ├── useAuth.js              # Auth state & helper functions
│   ├── useBloodRequests.js     # Requests fetching & pledge handlers
│   ├── useToast.js             # Toast notification dispatcher
│   └── useDebounce.js          # Search input debouncer
│
├── layouts/                    # Frame wrappers for page routes
│   ├── PublicLayout.jsx
│   ├── DashboardLayout.jsx
│   └── AuthLayout.jsx
│
├── pages/                      # Page view views
│   ├── public/
│   │   ├── LandingPage.jsx
│   │   ├── EmergencyRequestsPage.jsx
│   │   ├── BloodBanksPage.jsx
│   │   ├── CampsPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── donor/
│   │   ├── DonorDashboardPage.jsx
│   │   ├── DonorPledgesPage.jsx
│   │   ├── DonationHistoryPage.jsx
│   │   └── RewardsStorePage.jsx
│   │
│   ├── hospital/
│   │   ├── HospitalDashboardPage.jsx
│   │   ├── InventoryPage.jsx
│   │   └── CreateRequestPage.jsx
│   │
│   └── ngo/
│       ├── NgoDashboardPage.jsx
│       └── CreateCampPage.jsx
│
├── routes/                     # Router setup
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── services/                   # Data fetching & mock layer
│   ├── apiClient.js
│   ├── authService.js
│   ├── bloodRequestService.js
│   ├── inventoryService.js
│   └── mockData/
│       ├── users.json
│       ├── blood_requests.json
│       ├── inventory.json
│       └── rewards.json
│
├── store/                      # Redux state management
│   ├── index.js
│   └── slices/
│       ├── authSlice.js
│       ├── bloodRequestsSlice.js
│       ├── inventorySlice.js
│       ├── rewardsSlice.js
│       └── uiSlice.js
│
├── styles/                     # CSS stylesheets
│   ├── variables.css
│   ├── typography.css
│   └── animations.css
│
└── utils/                      # Helper utilities
    ├── formatDate.js
    ├── bloodCompatibility.js
    └── validators.js
```
