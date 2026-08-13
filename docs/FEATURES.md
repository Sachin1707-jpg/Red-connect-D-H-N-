# 🚀 Feature Matrix & Specifications - RedConnect

Comprehensive matrix of all planned features for RedConnect, organized by business priority, completion status, and cross-feature dependencies.

---

## 1. Feature Priority Matrix

| Feature ID | Feature Name | Description | Priority | Status | Dependencies |
|---|---|---|---|---|---|
| `FEAT-001` | Multi-Role Authentication | JWT Login and Registration for Donors, Hospitals, NGOs | **P0** | Planned | Auth Service, Redux Auth Slice |
| `FEAT-002` | Public Emergency Board | Live wall displaying active emergency requests filtered by blood type | **P0** | Planned | Redux Requests Slice, Request Cards |
| `FEAT-003` | Emergency Request Dispatcher | Form allowing hospitals to publish critical requests | **P0** | Planned | Modal Component, Form Validation |
| `FEAT-004` | Donor Pledge Workflow | Allows registered donors to pledge 1 unit to a request | **P0** | Planned | Auth Guard, Redux Requests Slice |
| `FEAT-005` | Real-time Inventory Grid | Matrix tracking units of all 8 blood types for hospital admins | **P0** | Planned | Inventory Service, Stock Grid |
| `FEAT-006` | Low Stock Alert System | Highlights blood types falling below threshold | **P1** | Planned | Inventory Grid, Badge Component |
| `FEAT-007` | Donor Availability Switch | Instant toggle setting donor status `Available` vs `On Break` | **P1** | Planned | Donor Dashboard, Redux Auth Slice |
| `FEAT-008` | Gamified Rewards Store | Points balance and redeemable checkup/gift vouchers | **P1** | Planned | Rewards Service, Points System |
| `FEAT-009` | Community Leaderboard | Top donors list ranked by verified donation count | **P2** | Planned | Mock Leaderboard Service |
| `FEAT-010` | NGO Blood Camp Drive | Event scheduling and public registration listing | **P1** | Planned | Camps Page, Form Validation |
| `FEAT-011` | Toast Notification System | Floating feedback toasts for emergency alerts and user actions | **P0** | Planned | Redux UI Slice, ToastContainer |
| `FEAT-012` | Dark Mode Toggle | Visual theme switcher between Light Slate and Dark Slate | **P2** | Planned | Redux UI Slice, CSS Variables |

---

## 2. Priority Level Definitions

- **P0 (Critical Path)**: Essential MVP functionality required for blood request lifecycle, authentication, and emergency fulfillment.
- **P1 (High Value)**: Core engagement features including inventory management, donor toggles, and rewards system.
- **P2 (Enhancement)**: Value-added features such as gamification leaderboards, dark mode, and social sharing options.
