# 🗺️ Routing Architecture - RedConnect

RedConnect uses **React Router v6** to manage client-side navigation, role-based route guards, and nested layouts.

---

## 1. Route Map Specification

### 1.1 Public Routes (No Authentication Required)
| Path | Page Component | Layout | Purpose |
|---|---|---|---|
| `/` | `LandingPage` | `PublicLayout` | Marketing landing, hero, live stats, emergency ticker |
| `/requests` | `EmergencyRequestsPage` | `PublicLayout` | Public wall of ongoing blood requests |
| `/requests/:id` | `RequestDetailPage` | `PublicLayout` | Detailed request information and pledge trigger |
| `/blood-banks` | `BloodBanksPage` | `PublicLayout` | Directory search for verified hospital blood banks |
| `/camps` | `CampsPage` | `PublicLayout` | Directory of community blood donation drives |
| `/login` | `LoginPage` | `AuthLayout` | Login authentication portal |
| `/register` | `RegisterPage` | `AuthLayout` | Role selection & user sign-up portal |

### 1.2 Protected Donor Portal Routes (`role === 'donor'`)
| Path | Page Component | Layout | Purpose |
|---|---|---|---|
| `/donor/dashboard` | `DonorDashboardPage` | `DashboardLayout` | Donor availability status, urgent alerts, stats |
| `/donor/pledges` | `DonorPledgesPage` | `DashboardLayout` | Manage active and completed pledges |
| `/donor/history` | `DonationHistoryPage` | `DashboardLayout` | Log of past blood donations & verified records |
| `/donor/rewards` | `RewardsStorePage` | `DashboardLayout` | Redeem accrued points for rewards & badges |

### 1.3 Protected Hospital Portal Routes (`role === 'hospital'`)
| Path | Page Component | Layout | Purpose |
|---|---|---|---|
| `/hospital/dashboard` | `HospitalDashboardPage` | `DashboardLayout` | Overview of inventory and emergency activity |
| `/hospital/inventory` | `InventoryManagementPage` | `DashboardLayout` | Real-time stock matrix management for 8 blood types |
| `/hospital/requests/create` | `CreateRequestPage` | `DashboardLayout` | Issue high-urgency emergency blood request |
| `/hospital/requests` | `HospitalRequestsPage` | `DashboardLayout` | Manage hospital's active requests & incoming pledges |

### 1.4 Protected NGO Portal Routes (`role === 'ngo'`)
| Path | Page Component | Layout | Purpose |
|---|---|---|---|
| `/ngo/dashboard` | `NgoDashboardPage` | `DashboardLayout` | Event metrics & drive summaries |
| `/ngo/camps/create` | `CreateCampPage` | `DashboardLayout` | Schedule community blood donation drive |

### 1.5 System Fallback Routes
| Path | Page Component | Layout | Purpose |
|---|---|---|---|
| `*` | `NotFoundPage` | `PublicLayout` | 404 page for invalid URL paths |

---

## 2. Protected Route Implementation

```jsx
// src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
```

---

## 3. Declarative Router Configuration

```jsx
// src/routes/AppRoutes.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'requests', element: <EmergencyRequestsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/donor',
    element: <ProtectedRoute allowedRoles={['donor']} />,
    children: [
      {
        element: <DashboardLayout role="donor" />,
        children: [
          { path: 'dashboard', element: <DonorDashboardPage /> },
          { path: 'rewards', element: <RewardsStorePage /> },
        ],
      },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
```
