# ⚡ Performance Optimization Guide - RedConnect

This document details client-side performance benchmarks, bundle size budgets, caching strategies, and React rendering optimization rules for RedConnect.

---

## 1. Target Web Vitals Benchmarks

| Metric | Target | Description |
|---|---|---|
| **LCP (Largest Contentful Paint)** | `< 1.2s` | Time for main hero image/heading to render. |
| **FID / INP (Interaction to Next Paint)** | `< 50ms` | Latency for button click interactions (e.g. Pledge trigger). |
| **CLS (Cumulative Layout Shift)** | `< 0.05` | Zero visual jumping when dynamic requests load. |
| **FCP (First Contentful Paint)** | `< 0.8s` | Time until initial UI graphics appear. |

---

## 2. Code Splitting & Route Lazy Loading

All non-critical route pages are code-split using `React.lazy()` and `Suspense`:

```jsx
// src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/common/Loader';

const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const EmergencyRequestsPage = lazy(() => import('@/pages/public/EmergencyRequestsPage'));
const DonorDashboardPage = lazy(() => import('@/pages/donor/DonorDashboardPage'));
const HospitalDashboardPage = lazy(() => import('@/pages/hospital/HospitalDashboardPage'));

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <RouterProvider router={router} />
  </Suspense>
);
```

---

## 3. React Rendering & Memoization Rules

1. **`useMemo` for Heavy Computations**: Filter operations matching blood group compatibility across large arrays are wrapped in `useMemo()`:
```jsx
const filteredRequests = useMemo(() => {
  return requests.filter(req => {
    const matchesGroup = selectedGroup === 'ALL' || req.bloodGroup === selectedGroup;
    const matchesUrgency = selectedUrgency === 'ALL' || req.urgency === selectedUrgency;
    return matchesGroup && matchesUrgency;
  });
}, [requests, selectedGroup, selectedUrgency]);
```
2. **`useCallback` for Event Handlers**: Callbacks passed down to child components inside lists (e.g. `onPledgeClick` in `EmergencyRequestCard`) are memoized via `useCallback()`.
3. **Pure Component Wrappers**: Reusable primitives like `BloodTypeBadge` use `React.memo()`.

---

## 4. Asset & Bundle Optimization

- **Vite Chunk Splitting**: Configured in `vite.config.js` to isolate vendor libraries (`react`, `redux`, `lucide-react`) into standalone long-term cached vendor chunks.
- **Image WebP Conversion**: All graphics and banners are compressed in WebP format with resolution caps.
- **Bundle Budget Limit**: Total initial JavaScript payload is capped at **< 200 KB gzipped**.
