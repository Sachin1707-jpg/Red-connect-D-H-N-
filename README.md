# 🩸 Red Connect

> **A Comprehensive Blood Donation & Healthcare Networking Platform**

**Red Connect** is a centralized platform designed to bridge the gap between blood donors, hospitals, and NGOs. It streamlines the blood donation process, facilitates real-time communication, and rewards users for their life-saving contributions. This project is built to ensure a robust, fast, and scalable solution for healthcare and emergency needs.

---

## ✨ Key Features

- **Multi-Role Dashboards**: Tailored interfaces and features for **Donors**, **Hospitals**, and **NGOs**.
- **Real-Time Requests & Alerts**: Instant notifications and tracking for urgent blood requirements.
- **In-App Chat & Communication**: Real-time messaging to coordinate between donors and hospitals seamlessly.
- **Rewards & Gamification**: A reward point system that tracks total donations and lives saved, motivating continuous contribution.
- **Live Maps Integration**: Easily locate nearby donors, hospitals, and ongoing blood drives.
- **Analytics & Reporting**: Comprehensive data visualization (via Recharts) for hospitals and NGOs to manage resources efficiently.
- **Secure Authentication**: Robust user authentication with JWT, bcrypt, and Firebase.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS & Framer Motion (for smooth animations)
- **Routing**: React Router DOM
- **Additional Services**: Firebase (for real-time capabilities/auth), Recharts (for analytics), React Hook Form & Zod (validation)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Environment Management**: dotenv
- **CORS**: cors

### Database
- **NoSQL Database**: MongoDB
- **ODM**: Mongoose

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sachin1707-jpg/Red-connect-D-H-N-.git
   cd "Red-connect-D-H-N-"
   ```

2. **Setup Frontend:**
   ```bash
   # Install dependencies
   npm install
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   # Install dependencies
   npm install
   cd ..
   ```

### ⚙️ Environment Variables

You need to create two `.env` files to run the project. 

**1. Root Directory (`/.env`)** for the Frontend:
```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"
```

**2. Backend Directory (`/backend/.env`)** for the API:
```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

### 🏃‍♂️ Running the Application

**Start the Backend Server:**
```bash
cd backend
node server.js
# The backend runs on http://localhost:5000
```

**Start the Frontend Development Server:**
```bash
# In a new terminal window at the project root
npm run dev
# The frontend runs on http://localhost:5173
```

---

## 📁 Project Structure

```
Red-connect/
├── backend/                  # Node.js + Express backend
│   ├── config/               # Database and app configuration
│   ├── controllers/          # API route controllers
│   ├── middleware/           # Express middlewares (auth, etc.)
│   ├── models/               # Mongoose schemas (User, etc.)
│   ├── routes/               # Express API routes
│   └── server.js             # Backend entry point
├── src/                      # React frontend
│   ├── components/           # Reusable UI components
│   ├── config/               # Firebase & external configs
│   ├── context/              # React Context providers
│   ├── pages/                # Page views (Dashboard, Auth, Maps, etc.)
│   ├── redux/                # Redux slices and store
│   ├── routes/               # Application routing
│   └── services/             # API call definitions
├── index.html                # Vite HTML entry point
├── package.json              # Frontend dependencies
├── tailwind.config.js        # Tailwind CSS configuration
└── vite.config.js            # Vite configuration
```

---

## 🏆 Hackathon Submission

This project is built and optimized for our hackathon submission. It addresses a critical real-world problem by digitizing and centralizing the blood donation ecosystem. 

**What makes it stand out:**
- A fully responsive and premium UI design.
- Dynamic schema allowing smooth integration of varying user types (Donors, NGOs, Hospitals).
- Real-time systems designed to save critical minutes during medical emergencies.

---
*Built with ❤️ for a better tomorrow.*