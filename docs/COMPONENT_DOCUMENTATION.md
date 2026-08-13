# 🧩 Component Documentation - RedConnect

Detailed technical documentation for core presentation and domain components in RedConnect.

---

## 1. Top Navbar (`src/components/layout/Navbar.jsx`)

### Overview
Global responsive application navigation bar mounted at the top of all views.

### Structure & Behavior
- **Brand Logo**: Displays RedConnect logo mark and wordmark; clicking navigates to `/`.
- **Navigation Links**: Dynamic route links matching user auth state (`Emergency Requests`, `Blood Banks`, `Donation Camps`, `Rewards`).
- **Notification Bell**: Displays unread notification count badge; clicking opens `NotificationPopover`.
- **User Profile Menu**: Dropdown displaying avatar, user name, role badge, and `Logout` command button.
- **Mobile Drawer Toggle**: Hamburger button rendering mobile slide-over navigation drawer on `<640px` screens.

---

## 2. Dashboard Sidebar (`src/components/layout/Sidebar.jsx`)

### Overview
Collapsible side navigation used inside `DashboardLayout` for authenticated Donors, Hospitals, and NGOs.

### Role Adaptations
- **Donor View Links**: Overview, Nearby Requests, My Pledges, Donation History, Rewards Store, Settings.
- **Hospital View Links**: Overview, Blood Inventory, Issue Emergency Request, Active Requests, Pledges Received, Analytics.
- **NGO View Links**: Overview, Active Drives, Create Event, Attendee Roster, Volunteer Messages.

---

## 3. Data Table (`src/components/common/Table.jsx`)

### Overview
Sortable, accessible tabular data grid used for inventory lists, request logs, and donation history.

### Props API
- `columns`: Array of `{ key, label, renderCell, sortable }`.
- `data`: Array of data objects.
- `isLoading`: Renders table skeleton rows.
- `pagination`: `{ currentPage, totalPages, onPageChange }`.

---

## 4. Toast Notification (`src/components/common/Toast.jsx`)

### Overview
Floating alerts rendered in the top-right screen corner.

### Notification Types
1. `emergency`: Critical dark red alert with pulsing icon for new nearby O- requests.
2. `success`: Green checkmark alert for successful pledge or inventory save.
3. `error`: Solid red error message for failed actions.
4. `info`: Blue informational notice.

---

## 5. Avatar Component (`src/components/common/Avatar.jsx`)

### Overview
Displays user profile image or generated initials fallback with donor blood group badge overlay.

---

## 6. Pagination (`src/components/common/Pagination.jsx`)

### Overview
Navigates multi-page request lists and history logs with Previous, Next, and direct page buttons.

---

## 7. Search & Filter Bar (`src/components/domain/FilterBar.jsx`)

### Overview
Combines search input for location/hospital name with dropdown selectors for Blood Type (`A+`, `O-`, etc.), Urgency (`Critical`, `High`, `Medium`), and Distance Radius (`5km`, `10km`, `25km`).
