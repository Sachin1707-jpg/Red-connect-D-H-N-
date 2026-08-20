# RedConnect Backend API

Production-ready Express & Node.js backend for **RedConnect**, a blood donation and donor-recipient matching platform powered by MongoDB Mongoose, BullMQ, Firebase FCM, and Twilio.

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your connection strings:
```bash
cp .env.example .env
```

Key variables:
- `MONGO_URI`: Your MongoDB Atlas URI
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure random strings
- `REDIS_URL`: `redis://127.0.0.1:6379` (optional — falls back to sync if omitted)

### 3. Seed Sample Data
```bash
npm run seed
```

### 4. Run Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server runs on: `http://localhost:5000`

---

## 📑 API Endpoint Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user + send OTP | No |
| POST | `/api/auth/verify-otp` | Verify phone OTP | No |
| POST | `/api/auth/login` | Login with email & password | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout & clear refresh token | Yes |

### Donors (`/api/donors`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/donors/me` | Get authenticated user profile | Yes |
| PATCH | `/api/donors/me` | Update availability, location, bloodGroup | Yes |
| GET | `/api/donors/:id` | View public donor profile | No |

### Blood Requests (`/api/requests`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/requests` | Create request (triggers geo matching) | Yes (Limit: 5/hr) |
| GET | `/api/requests/nearby` | List requests near donor's location | Yes |
| GET | `/api/requests/:id` | Get single request details | No |
| GET | `/api/requests/:id/matches` | Get list of matched donors | Yes |
| POST | `/api/requests/:id/respond` | Accept/decline request pledge | Yes |
| PATCH | `/api/requests/:id/fulfill` | Mark fulfilled & log donation history | Yes (Hospital/Admin) |
| DELETE | `/api/requests/:id` | Cancel request | Yes (Owner/Admin) |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/users` | List/filter all users | Yes (Admin) |
| PATCH | `/api/admin/users/:id/verify` | Manually verify a user | Yes (Admin) |
| GET | `/api/admin/stats` | System health & statistics dashboard | Yes (Admin) |

---

## ⚡ Tech Stack Architecture
- **Framework**: Express.js with Helmet, Cors, Morgan, Express-Validator
- **Database**: MongoDB with Mongoose (2dsphere index for geo matching)
- **Queues & Notifications**: BullMQ with Redis + Firebase Admin FCM + Twilio SMS
