# 💻 Frontend Architecture - RedConnect

This document describes the software design patterns, layering, custom hooks, and architectural boundaries governing the RedConnect React platform.

---

## 1. Architectural Layers

RedConnect is structured into **5 distinct architectural layers**:

```
+-----------------------------------------------------------------------+
|  1. VIEW / PRESENTATION LAYER (Pages, Layouts, Visual Components)    |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|  2. CUSTOM HOOKS LAYER (useAuth, useBloodRequests, useToast)          |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|  3. STATE MANAGEMENT LAYER (Redux Toolkit Store & Slices)             |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|  4. SERVICES & API LAYER (httpService, mockAdapter, authService)      |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|  5. UTILITIES & CONFIG LAYER (formatters, validators, themeTokens)    |
+-----------------------------------------------------------------------+
```

---

## 2. Pages Layer (`src/pages/`)

Pages represent standalone route destinations. Pages are responsible for subscribing to global store state, triggering async initialization data fetches, and rendering layout containers.

### Key Page Modules:
- `LandingPage.jsx`: Hero, statistics, public request highlights, call-to-action sections.
- `EmergencyRequestsPage.jsx`: Public wall with real-time filters for blood group, urgency, and city.
- `DonorDashboardPage.jsx`: Private portal for donors featuring availability switch, recent pledges, badges, and rewards.
- `HospitalDashboardPage.jsx`: Private portal for hospital admins featuring inventory grid, request creation modal trigger, and pledges list.
- `NgoCampsPage.jsx`: Public camp listings and private organizer creation interface.

---

## 3. Layout Layer (`src/layouts/`)

Layout components wrap page views, enforcing common UI structures (headers, sidebars, footers, notification toasts):

- `PublicLayout.jsx`: Renders `Navbar`, page output container, and `Footer`.
- `DashboardLayout.jsx`: Renders top `Navbar`, collateral role-based `Sidebar` (Donor/Hospital/NGO), and main content area.
- `AuthLayout.jsx`: Centered single-card framing for Login and Registration forms.

---

## 4. Component Layer (`src/components/`)

Separated into reusable primitives and domain-specific UI:

### `src/components/common/` (Primitives)
- `Button.jsx`: Flexible button supporting `primary`, `secondary`, `emergency`, `outline`, and `ghost` variants.
- `Card.jsx`: Surface container supporting custom elevation, headers, and padding.
- `Input.jsx`: Form field component integrated with validation message rendering.
- `Modal.jsx`: Accessible modal dialog backdrop with focus trap and `Esc` key support.
- `Badge.jsx`: Pill badge component supporting `danger`, `warning`, `success`, `info` colorways.

### `src/components/domain/` (Domain-Specific)
- `BloodTypeBadge.jsx`: Displays blood group tag (e.g. `O-`) with custom blood drop iconography.
- `EmergencyRequestCard.jsx`: Displays urgency badge, hospital distance, units needed, and `Pledge` action button.
- `StockMatrixGrid.jsx`: Visual inventory grid displaying unit counts for all 8 blood groups.

---

## 5. Services Layer (`src/services/`)

Handles external communication and mock data translation:

- `apiClient.js`: Unified Axios instance configured with base URL, timeout, and response interceptors.
- `authService.js`: Encapsulates `login()`, `signup()`, `logout()`, `getCurrentUser()`.
- `bloodRequestService.js`: Encapsulates `fetchRequests()`, `createRequest()`, `pledgeRequest()`.
- `mockData/`: Contains deterministic JSON datasets for immediate development and testing.

---

## 6. Custom Hooks Layer (`src/hooks/`)

Custom React hooks extract stateful logic out of view components:

- `useAuth()`: Provides `user`, `role`, `isAuthenticated`, `login()`, `logout()`.
- `useBloodRequests()`: Exposes filtered blood requests, loading statuses, and request creation methods.
- `useToast()`: Provides helper triggers for success, error, warning, and emergency notifications (`showToast()`).
- `useDebounce()`: Utility hook for debouncing fast-typing search inputs.

---

## 7. Utilities Layer (`src/utils/`)

Pure, deterministic utility functions:

- `dateFormatter.js`: Formats timestamps to human-friendly strings (e.g., *"10 minutes ago"*).
- `bloodGroupValidator.js`: Validates donor-recipient blood compatibility matrix.
- `validators.js`: Zod schema definitions for form verification.
