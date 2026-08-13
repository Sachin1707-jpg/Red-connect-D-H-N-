# 📋 Product Requirement Document (PRD) - RedConnect

---

## 1. Project Overview

**RedConnect** is an enterprise-grade digital platform for emergency blood donation management, inventory tracking, and donor-requester coordination. The system functions as a centralized network connecting voluntary donors, registered hospitals, non-governmental organizations (NGOs), and individual citizens seeking emergency blood units.

By providing real-time inventory visibility, instant geo-targeted emergency dispatching, and gamified donor engagement, RedConnect reduces the critical time required to source blood from hours to minutes.

---

## 2. Problem Statement

Every year, millions of critical emergency surgeries, trauma cases, and chronic conditions (e.g. Thalassemia, Anemia) suffer severe delays due to:
1. **Fragmented Communication**: Requesters rely on broadcast messages on messaging apps with high latency and unverified leads.
2. **Lack of Inventory Visibility**: Blood banks operate in silos with non-standardized stock records.
3. **Donor Retention Fatigue**: First-time donors rarely convert into regular donors due to lack of feedback, recognition, and simplified scheduling.
4. **Geography & Timing Mismatch**: Difficulty locating compatible, eligible donors within an actionable physical radius during emergency hours.

---

## 3. The Solution

RedConnect provides a unified multi-portal application:
- **Emergency Alert Dispatcher**: Hospitals and verified requesters broadcast targeted emergency notifications to compatible donors within a specific radius.
- **Donor Lifecycle Portal**: Donors manage eligibility status, track historical donations, earn rewards/badges, and receive urgent localized alerts.
- **Hospital Blood Bank Portal**: Hospitals manage live unit inventories (A+, A-, B+, B-, AB+, AB-, O+, O-), track incoming pledges, and issue verified requests.
- **NGO Camp Portal**: Community organizations host donation drives, manage volunteer schedules, and aggregate donation statistics.

---

## 4. Primary Objectives

- **Reduce Emergency Match Time**: Achieve donor pledge response times within **< 15 minutes** of an emergency request dispatch.
- **Increase Repeat Donors**: Raise repeat donation rates by **35%** through automated eligibility reminders and gamified incentives.
- **Digitize Inventory Tracking**: Eliminate manual phone calls between hospitals by providing real-time stock dashboards.
- **Zero Friction Onboarding**: Allow visitors to search blood banks and view public urgent needs without mandatory account creation.

---

## 5. Target Users & Stakeholders

| User Role | Description | Core Motivations & Goals |
|---|---|---|
| **Donor** | Voluntary individuals eligible to donate blood (ages 18-65). | Save lives, stay updated on local urgent needs, track personal health impacts, earn community badges. |
| **Hospital / Blood Bank** | Accredited healthcare institutions and blood repository managers. | Procure required blood units instantly, prevent stock-outs, log donor pledges, manage critical requests. |
| **NGO / Organizer** | Non-profit groups hosting community blood drives. | Plan blood camps, register donors in bulk, track target goals, recognize community volunteers. |
| **Visitor / Public User** | Unauthenticated platform visitors. | Locate nearest blood banks, check emergency requests, register as a donor or requester. |

---

## 6. Functional Requirements

### 6.1 Authentication & Profile Management
- User signup and login supporting Donor, Hospital, NGO, and Admin roles.
- Profile management: blood group, contact details, address/geolocation, medical eligibility status.
- Secure session handling with role-based routing access controls.

### 6.2 Emergency Blood Request System
- Create Emergency Request specifying blood group, units, hospital name, urgency level (`Critical`, `High`, `Medium`), patient ID, and contact person.
- Public Request Wall displaying filtered active requests by city, blood type, and urgency level.
- Donor Pledge Workflow: Allow eligible donors to click "Pledge Donation", locking their status and sending contact details to the requesting hospital.

### 6.3 Hospital Inventory & Stock Management
- Real-time stock matrix dashboard for all 8 blood groups.
- Low-stock indicator thresholds (e.g. `< 5 units` triggers warning badge).
- Inbound pledge tracker to accept or complete donor fulfillments.

### 6.4 NGO Camp & Event Management
- Create Camp Event specifying title, venue address, date/time, expected units, and contact details.
- Public Camp Directory with "Register to Attend" functionality.
- Live event progress bar showing total registered vs goal target.

### 6.5 Gamification & Rewards
- Reward Points accumulation per successful verified donation (e.g., 100 points per donation).
- Badges System: *First Blood*, *Bronze Lifesaver*, *Silver Guardian*, *Gold Hero*, *Emergency Responder*.
- Rewards Redemption Store for health checkup vouchers and community recognition certificates.

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page initial load time under **1.5 seconds** on 3G network connections.
- Client-side route changes rendering in **< 100ms**.
- Lightweight initial JS bundle size **< 250 KB** gzipped.

### 7.2 Accessibility
- Compliance with **WCAG 2.1 Level AA** standard.
- Complete keyboard navigation support (`Tab`, `Enter`, `Space`, `Esc`).
- Minimum color contrast ratio of **4.5:1** for standard text and **3:1** for UI components.

### 7.3 Responsiveness
- Seamless fluid rendering across mobile (<640px), tablet (640px-1024px), laptop (1024px-1280px), and desktop (>1280px).

### 7.4 Security
- Client-side token storage best practices (HttpOnly cookies or encrypted memory).
- XSS prevention via input sanitization and React auto-escaping.
- Strict Role-Based Access Control (RBAC) preventing cross-portal data leaks.

### 7.5 Scalability & Maintainability
- Modular architecture using domain-driven directory structures.
- Strict typing with TypeScript / ES6+ standard modules.

---

## 8. Detailed User Stories (30+ Complete Stories)

### 🩸 Donor User Stories (1-10)
1. **As a Donor**, I want to register an account with my blood group and location so that I can receive localized emergency alerts.
2. **As a Donor**, I want to toggle my availability status between "Available" and "On Break" so that I am not contacted when unable to donate.
3. **As a Donor**, I want to view urgent blood requests near me filtered by distance so that I can respond quickly.
4. **As a Donor**, I want to pledge to an emergency blood request so that the hospital knows I am coming.
5. **As a Donor**, I want to view my past donation history so that I know when I am next eligible to donate.
6. **As a Donor**, I want to earn reward points after a verified donation so that I can redeem health incentives.
7. **As a Donor**, I want to view my unlocked badges so that I feel motivated to donate regularly.
8. **As a Donor**, I want to upload a donor health questionnaire before visiting so that screening is faster.
9. **As a Donor**, I want to receive push/toast notifications when an O-negative emergency request is created nearby.
10. **As a Donor**, I want to share urgent blood requests on social media so that my network can help spread the word.

### 🏥 Hospital User Stories (11-18)
11. **As a Hospital Administrator**, I want to log in to a dedicated hospital dashboard so that I can manage our blood repository.
12. **As a Hospital Administrator**, I want to post an emergency blood request specifying blood type, units needed, and urgency level.
13. **As a Hospital Administrator**, I want to update our current blood inventory units for all 8 blood types in real time.
14. **As a Hospital Administrator**, I want to view list of donors who pledged for our request so that we can coordinate arrival times.
15. **As a Hospital Administrator**, I want to mark a blood request as "Fulfilled" once sufficient units are received.
16. **As a Hospital Administrator**, I want to verify a donor's completed donation to award them platform points and update inventory.
17. **As a Hospital Administrator**, I want to set automated low-stock alerts for critical blood types like AB- and O-.
18. **As a Hospital Administrator**, I want to export monthly blood usage and procurement reports for audit compliance.

### 🤝 NGO User Stories (19-24)
19. **As an NGO Representative**, I want to register our organization on the platform so that we can host verified donation drives.
20. **As an NGO Representative**, I want to create a new Blood Donation Camp event with date, location, and target donor count.
21. **As an NGO Representative**, I want to view the list of registered attendees for an upcoming camp event.
22. **As an NGO Representative**, I want to issue digital certificates of appreciation to donors who attended our camp.
23. **As an NGO Representative**, I want to broadcast announcements to registered camp participants.
24. **As an NGO Representative**, I want to view statistical analytics of blood units collected during past drives.

### 🌐 Visitor User Stories (25-30+)
25. **As a Visitor**, I want to search for active blood banks in my city without logging in so that I can find immediate contacts.
26. **As a Visitor**, I want to filter emergency blood requests by blood group on the public wall.
27. **As a Visitor**, I want to view an educational FAQ section regarding blood donation eligibility criteria.
28. **As a Visitor**, I want to easily sign up as a donor from the hero landing page call-to-action.
29. **As a Visitor**, I want to view real-time platform statistics (Lives Saved, Active Donors) on the homepage.
30. **As a Visitor**, I want to toggle between Dark Mode and Light Mode for comfortable browsing.
31. **As a Visitor**, I want to access a contact support form if I encounter difficulties locating a rare blood type.

---

## 9. Acceptance Criteria Example Matrix

| Requirement | Scenario | Given / When / Then |
|---|---|---|
| **Pledge Request** | Donor pledges to emergency request | **Given** an active emergency request and an logged-in eligible donor<br>**When** the donor clicks "Pledge Donation"<br>**Then** the request pledge counter increments, the hospital receives a notification, and the donor sees a success modal with navigation instructions. |
| **Stock Update** | Hospital updates O- inventory | **Given** a hospital admin on the Inventory page<br>**When** they update O- units from 2 to 6 and click Save<br>**Then** the low-stock alert badge disappears and the store updates globally without page reload. |

---

## 10. Success Metrics

- **Primary KPI**: Average time elapsed from request creation to first donor pledge (**Target: < 15 mins**).
- **User Engagement**: Monthly Active Donors (MAD) returning to check requests (**Target: > 40%**).
- **Fulfillment Rate**: Percentage of emergency requests successfully fulfilled within 24 hours (**Target: > 92%**).
- **Platform Growth**: Number of verified registered hospitals and active NGOs onboarded per quarter.

---

## 11. Out of Scope (Initial Phase)

- Direct online payment transactions for medical bills.
- Complex IoT hardware integration for blood refrigerator temperature telemetry.
- Native mobile app binary builds (iOS App Store / Google Play Store native distribution).

---

## 12. Future Enhancements

- **Real-Time GPS Tracking**: Live map view of pledged donor traveling to hospital.
- **AI Predictive Shortage Engine**: Machine learning model forecasting blood group shortages based on seasonal trends.
- **Automated Voice Calls**: Twilio integration for automated emergency phone calls to rare blood group donors.
