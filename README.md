# 🩸 Red Connect

> **A Smart, Real-Time Blood Donation & Healthcare Networking Platform**

Red Connect is a centralized digital platform that connects **blood donors, hospitals, NGOs, and people in need of blood** through a single, easy-to-use ecosystem.

The platform is designed to reduce the time required to find suitable blood donors during emergencies. It combines **real-time blood requests, donor discovery, location-based services, communication, notifications, rewards, and analytics** to make the blood donation process faster, more transparent, and more accessible.

---

## 🚨 The Problem

During medical emergencies, finding the right blood donor quickly can be extremely difficult.

Traditional blood donation processes often depend on:

* Calling individual donors
* Sharing requirements across WhatsApp or social media groups
* Manually contacting hospitals and blood banks
* Searching for donors without knowing their current availability
* Lack of centralized information
* Delayed communication between donors and hospitals
* Difficulty tracking previous donations and donor activity

These delays can become critical when a patient requires blood urgently.

### Red Connect aims to solve this problem by creating a centralized platform where all major stakeholders can coordinate in real time.

---

# 💡 Our Solution

Red Connect digitizes the complete blood donation workflow.

A person or hospital can create a blood requirement, and the platform can help identify relevant donors based on factors such as:

* Blood group
* Location/distance
* Availability
* Donation eligibility
* Previous donation activity
* Urgency of the request

Donors receive relevant notifications and can communicate with the requesting organization.

Hospitals and NGOs can manage requests, monitor responses, view analytics, and coordinate donation activities from their dashboards.

---

# 🎯 Project Objectives

Red Connect focuses on five major objectives:

1. **Reduce the time required to find blood donors**
2. **Connect donors with hospitals and NGOs efficiently**
3. **Provide real-time communication and notifications**
4. **Make donor participation more engaging through rewards**
5. **Provide organizations with useful analytics and resource insights**

---

# 👥 User Roles

Red Connect provides role-specific experiences for different users.

## 🩸 1. Donor

Donors are individuals willing to donate blood.

### Donor capabilities

* Create and manage a donor profile
* Add blood group and relevant information
* View nearby blood requirements
* Receive urgent blood request notifications
* Respond to donation requests
* Communicate with hospitals/organizations
* View donation history
* Track lives potentially helped through donations
* Earn reward points
* View nearby hospitals and blood donation drives
* Manage availability and profile information

---

## 🏥 2. Hospital

Hospitals can use Red Connect to manage blood requirements and coordinate with potential donors.

### Hospital capabilities

* Create blood requests
* Specify required blood group
* Specify required units
* Set emergency/urgency level
* Track donor responses
* Communicate with donors
* Monitor active and completed requests
* Locate nearby donors and hospitals
* View blood requirement analytics
* Manage hospital information

---

## 🤝 3. NGO

NGOs can coordinate blood donation campaigns and community-level activities.

### NGO capabilities

* Create and manage blood donation drives
* Publish blood requirements
* Coordinate with donors
* Monitor donation activities
* Communicate with hospitals and donors
* Track campaign performance
* Analyze donor participation
* Monitor community contribution

---

# 🔄 How Red Connect Works

The basic workflow of the platform is:

```text
User Registration
       ↓
Select User Role
       ↓
Donor / Hospital / NGO
       ↓
Create Profile
       ↓
Blood Requirement Created
       ↓
System Identifies Relevant Donors
       ↓
Real-Time Notifications
       ↓
Donor Responds
       ↓
Communication & Coordination
       ↓
Blood Donation
       ↓
Request Completed
       ↓
Donation Recorded
       ↓
Rewards & Analytics Updated
```

This workflow reduces dependency on manual searching and enables faster coordination during emergencies.

---

# ⚡ Core Features

## 🔴 Real-Time Blood Requests

Hospitals and NGOs can create blood requests containing important information such as:

* Blood group
* Required units
* Hospital/location
* Urgency level
* Required date/time
* Contact information

The request can then be communicated to relevant donors.

---

## 📍 Location-Based Donor Discovery

Red Connect uses location-based services to help identify nearby:

* Blood donors
* Hospitals
* NGOs
* Blood donation drives

This helps reduce travel time and increases the probability of receiving a quick response.

---

## 🔔 Real-Time Notifications

Donors can receive notifications when a relevant blood requirement is created.

Notifications can be used for:

* Emergency blood requests
* Donation confirmations
* Request updates
* New blood drives
* Communication updates

Firebase services are used to support real-time capabilities.

---

## 💬 In-App Communication

Red Connect provides communication capabilities between donors and organizations.

This allows users to coordinate:

* Donation availability
* Hospital location
* Arrival time
* Request status
* Other donation-related information

The goal is to reduce dependency on external communication platforms.

---

# 🏆 Rewards & Gamification

Blood donation is a voluntary contribution, but continuous engagement can be encouraged through a reward system.

Red Connect tracks donor contribution through:

* Total donations
* Donation history
* Reward points
* Lives potentially helped
* Donation milestones

Gamification can encourage users to remain active and contribute regularly.

---

# 📊 Analytics & Reporting

Hospitals and NGOs can access dashboards containing useful information about their activities.

Analytics can include:

* Active blood requests
* Completed requests
* Blood group demand
* Donor response rate
* Donation activity
* Campaign performance
* Request trends

Charts and visualizations are implemented using **Recharts**.

These insights can help organizations understand demand patterns and improve resource planning.

---

# 🔐 Authentication & Security

Security is an important part of a healthcare-related platform.

Red Connect uses multiple technologies for authentication and security:

* **JWT** for backend authentication
* **bcryptjs** for password hashing
* **Firebase Authentication** for supported authentication workflows
* Protected backend routes
* Environment variables for sensitive configuration
* CORS configuration for controlled API access

Sensitive credentials such as database URLs, JWT secrets, and Firebase configuration should be stored in `.env` files and should **never be committed to GitHub**.

---

# 🧠 Smart Matching Concept

One of the key ideas behind Red Connect is helping users find suitable donors faster.

A future/advanced matching layer can consider multiple parameters:

```text
Blood Group
     +
Location / Distance
     +
Donor Availability
     +
Donation Eligibility
     +
Urgency
     +
Previous Response Behaviour
     ↓
Relevant Donor Ranking
```

Instead of simply broadcasting every request to every donor, the system can prioritize donors who are more suitable for a particular requirement.

This creates the foundation for integrating **Machine Learning / AI-based donor recommendation and response prediction models**.

---

# 🗺️ Maps & Location Services

Red Connect integrates map-based functionality to provide geographical context.

Users can potentially discover:

* Nearby hospitals
* Nearby donors
* NGOs
* Blood donation camps
* Blood drives
* Relevant healthcare locations

Location-based discovery is particularly important because physical distance can significantly affect response time during emergencies.

---

# 🏗️ System Architecture

Red Connect follows a modular full-stack architecture.

```text
                    ┌──────────────────────┐
                    │      User / Client   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  Vite + Tailwind     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Firebase          REST APIs         Maps / Services
     Authentication           │
     & Real-Time              ▼
                         ┌──────────────┐
                         │ Express.js   │
                         │   Backend    │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   MongoDB    │
                         │  + Mongoose  │
                         └──────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| React 18         | User interface                      |
| Vite             | Development & build tooling         |
| Redux Toolkit    | Global state management             |
| React Router DOM | Application routing                 |
| Tailwind CSS     | UI styling                          |
| Framer Motion    | Animations & interactions           |
| React Hook Form  | Form management                     |
| Zod              | Form validation                     |
| Recharts         | Analytics & data visualization      |
| Firebase         | Authentication & real-time services |

## Backend

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | Backend runtime               |
| Express.js | REST API framework            |
| JWT        | Authentication                |
| bcryptjs   | Password hashing              |
| dotenv     | Environment configuration     |
| CORS       | Cross-origin request handling |

## Database

| Technology | Purpose        |
| ---------- | -------------- |
| MongoDB    | NoSQL database |
| Mongoose   | MongoDB ODM    |

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

---

# 📁 Project Structure

```text
Red-connect/
│
├── backend/
│   ├── config/
│   │   └── Database and application configuration
│   │
│   ├── controllers/
│   │   └── Business logic for API requests
│   │
│   ├── middleware/
│   │   └── Authentication and request middleware
│   │
│   ├── models/
│   │   └── MongoDB/Mongoose schemas
│   │
│   ├── routes/
│   │   └── Backend API routes
│   │
│   └── server.js
│       └── Backend entry point
│
├── src/
│   ├── components/
│   │   └── Reusable UI components
│   │
│   ├── config/
│   │   └── Firebase and external service configuration
│   │
│   ├── context/
│   │   └── React Context providers
│   │
│   ├── pages/
│   │   └── Application pages
│   │
│   ├── redux/
│   │   └── Redux store and slices
│   │
│   ├── routes/
│   │   └── Application routing
│   │
│   └── services/
│       └── API and external service integrations
│
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js v16+
* MongoDB or MongoDB Atlas
* Git
* npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/Sachin1707-jpg/Red-connect-D-H-N-.git

cd "Red-connect-D-H-N-"
```

---

## 2. Install Frontend Dependencies

```bash
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd backend

npm install

cd ..
```

---

# ⚙️ Environment Variables

Create the required environment files locally.

### Frontend `.env`

Create `.env` in the project root:

```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
```

### Backend `.env`

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

> **Important:** Never commit `.env` files or secret credentials to GitHub.

---

# ▶️ Running the Application

## Start Backend

Open a terminal:

```bash
cd backend

node server.js
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Development Workflow

A typical development workflow is:

```text
Frontend
   ↓
API Request
   ↓
Express.js
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB
   ↓
API Response
   ↓
Redux / React State
   ↓
UI Update
```

Real-time features can additionally communicate through Firebase services.

---

# 🌟 Why Red Connect?

Red Connect is not simply a blood donor directory.

It aims to provide an **end-to-end digital ecosystem for blood donation**, bringing together:

**Donors + Hospitals + NGOs + Real-Time Communication + Location Services + Analytics + Rewards**

The platform focuses on the most important factor during a blood emergency:

> **Reducing the time between a blood requirement and finding a suitable donor.**

---

# 🏆 Hackathon Innovation

Red Connect is designed as a technology-driven solution to a real-world healthcare problem.

### Key strengths

* 🔴 Centralized blood donation ecosystem
* ⚡ Real-time emergency requests
* 📍 Location-based donor discovery
* 🔔 Instant notifications
* 💬 Integrated communication
* 🏆 Gamified donor engagement
* 📊 Data-driven analytics
* 🔐 Secure authentication
* 🤖 Foundation for AI/ML-based donor matching
* 📱 Responsive and user-friendly interface
* 🚀 Scalable full-stack architecture

---

# 🔮 Future Scope

The platform can be extended with advanced intelligent features.

### AI/ML Donor Matching

Machine Learning can rank potential donors based on:

* Distance
* Blood compatibility
* Availability
* Response probability
* Historical response time
* Request urgency

### Predictive Analytics

The system can predict:

* Blood demand trends
* Potential donor response
* High-demand blood groups
* Emergency requirements

### Smart Notifications

Instead of sending the same alert to everyone, intelligent notification systems can prioritize donors who are most likely to respond quickly.

### Blood Inventory Management

Hospitals and blood banks can maintain digital inventory information and receive alerts when specific blood groups reach critical levels.

### Advanced Emergency Mode

A high-priority emergency mode could automatically optimize donor discovery and notifications for critical requirements.

---

# 🌍 Social Impact

Blood donation is a community-driven activity where **time can directly affect outcomes**.

Red Connect aims to use technology to make this process:

**Faster → Smarter → More Connected → More Accessible**

By connecting donors, hospitals, and NGOs through one platform, Red Connect can help create a more responsive and organized blood donation ecosystem.

---

# 📌 Project Vision

> **"Every second matters when a life depends on blood."**

Red Connect's long-term vision is to build a connected healthcare network where finding blood is no longer dependent on manually searching through disconnected sources.

---

# ❤️ Built For Impact

Red Connect is developed with the goal of combining **technology, data, and community participation** to solve a critical real-world problem.

**Built with ❤️ for a faster and more connected blood donation ecosystem.**
