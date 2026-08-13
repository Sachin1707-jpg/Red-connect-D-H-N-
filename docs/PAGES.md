# 📄 Page Specifications - RedConnect

Comprehensive breakdown of every application page, including component composition, interactive controls, API integrations, form validation, and state handling.

---

## 1. Landing Page (`/`)

- **Purpose**: Main marketing entry point presenting platform mission, real-time emergency ticker, platform statistics, and call-to-action triggers.
- **Components Used**: `Navbar`, `HeroSection`, `StatCounterGrid`, `EmergencyRequestCarousel`, `HowItWorksSection`, `TestimonialCards`, `Footer`.
- **Primary Buttons**: `"Emergency Requests"`, `"Become a Donor"`, `"Register Hospital"`.
- **API Call**: `GET /api/v1/public/stats`, `GET /api/v1/blood-requests?urgency=Critical&limit=6`.
- **Loading State**: Skeleton placeholders for live stat counters and request cards.

---

## 2. Emergency Requests Wall (`/requests`)

- **Purpose**: Public directory of active emergency requests allowing users to filter by blood group, urgency, and location.
- **Components Used**: `FilterBar`, `BloodTypePillGroup`, `EmergencyRequestCard`, `Pagination`, `Modal` (Pledge confirmation).
- **Interactive Controls**: Search input field, Blood type dropdown (`A+`, `O-`, etc.), Urgency filter pills (`Critical`, `High`, `Medium`).
- **Forms**: Pledge confirmation form inside modal.
- **API Integration**: `GET /api/v1/blood-requests`, `POST /api/v1/blood-requests/:id/pledge`.
- **Error Handling**: Displays `<EmptyState />` if no matching requests exist or network call fails.

---

## 3. Donor Dashboard (`/donor/dashboard`)

- **Purpose**: Personalized dashboard for voluntary donors to manage availability, view nearby alerts, track pledges, and see earned rewards.
- **Components Used**: `Sidebar`, `DonorStatusSwitch`, `StatCard`, `ActivePledgesList`, `BadgeGrid`, `RewardsSummaryCard`.
- **Interactive Controls**: Toggle switch (`Available` / `On Break`), `"Pledge Help"` button on recommended alerts.
- **API Integration**: `GET /api/v1/donor/profile`, `PUT /api/v1/donor/availability`, `GET /api/v1/donor/pledges`.

---

## 4. Hospital Inventory Page (`/hospital/inventory`)

- **Purpose**: Inventory portal allowing hospital staff to update stock unit levels for all 8 blood groups and configure low-stock alerts.
- **Components Used**: `Sidebar`, `StockMatrixGrid`, `BloodTypeStockRow`, `Button`, `Modal` (Create Request trigger).
- **Interactive Controls**: `+` / `-` unit increment buttons, stock quantity input fields, `"Save Inventory Changes"` button.
- **Forms**: Create Emergency Request form modal.
- **API Integration**: `GET /api/v1/hospital/inventory`, `PUT /api/v1/hospital/inventory`.
- **Validation**: Units cannot be negative integer values.

---

## 5. Hospital Request Creation Page (`/hospital/requests/create`)

- **Purpose**: Dedicated form interface to issue a high-urgency blood dispatch.
- **Components Used**: `Card`, `Input`, `Select`, `Button`, `Badge`.
- **Forms & Validation**:
  - `bloodGroup`: Required select.
  - `unitsNeeded`: Integer `>= 1`.
  - `urgency`: Required enum (`Critical`, `High`, `Medium`).
  - `patientId`: Required string.
- **API Integration**: `POST /api/v1/blood-requests`.

---

## 6. NGO Camps Page (`/camps`)

- **Purpose**: Directory of voluntary blood donation drives hosted by registered NGOs.
- **Components Used**: `CampCard`, `FilterSelect`, `Modal` (Registration), `Button`.
- **API Integration**: `GET /api/v1/camps`, `POST /api/v1/camps/:id/register`.

---

## 7. Rewards Store Page (`/donor/rewards`)

- **Purpose**: Gamified points redemption catalog displaying badges and healthcare voucher rewards.
- **Components Used**: `PointsHeaderCard`, `BadgeCarousel`, `VoucherGrid`, `Button`.
- **API Integration**: `GET /api/v1/rewards`, `POST /api/v1/rewards/redeem`.
