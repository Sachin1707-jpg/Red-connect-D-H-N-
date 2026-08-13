# 🔌 API Integration Guide - RedConnect

This document details the REST API specifications for all RedConnect service endpoints, including request payloads, response structures, HTTP status codes, error handling, and frontend mock integration code.

---

## 1. Auth Endpoints

### 1.1 `POST /api/v1/auth/login`
- **Description**: Authenticate user and issue JWT token.
- **Request Body**:
```json
{
  "email": "donor@example.com",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_101",
      "name": "Alex Mercer",
      "email": "donor@example.com",
      "role": "donor",
      "bloodGroup": "O-"
    }
  }
}
```
- **Error `401 Unauthorized`**:
```json
{
  "status": "error",
  "message": "Invalid email or password credentials."
}
```

### 1.2 `POST /api/v1/auth/signup`
- **Description**: Register a new Donor, Hospital, or NGO profile.
- **Request Body**:
```json
{
  "name": "St. Jude Memorial Hospital",
  "email": "contact@stjude.org",
  "password": "Password123!",
  "role": "hospital",
  "phone": "+1-555-0192",
  "city": "Metropolis"
}
```
- **Response `201 Created`**:
```json
{
  "status": "success",
  "message": "Registration successful. Welcome to RedConnect."
}
```

---

## 2. Emergency Blood Request Endpoints

### 2.1 `GET /api/v1/blood-requests`
- **Description**: Fetch paginated blood requests with query filters.
- **Query Params**: `bloodGroup=O-&urgency=Critical&city=Metropolis&page=1&limit=10`
- **Response `200 OK`**:
```json
{
  "status": "success",
  "total": 24,
  "page": 1,
  "data": [
    {
      "id": "req_501",
      "hospitalName": "Metro General Hospital",
      "patientId": "PT-9982",
      "bloodGroup": "O-",
      "unitsNeeded": 3,
      "unitsPledged": 1,
      "urgency": "Critical",
      "contactPhone": "+1-555-8832",
      "location": {
        "address": "450 Health Ave",
        "city": "Metropolis",
        "distanceKm": 3.2
      },
      "status": "Active",
      "createdAt": "2026-07-22T08:15:00Z"
    }
  ]
}
```

### 2.2 `POST /api/v1/blood-requests`
- **Description**: Issue a new emergency request (Hospital role).
- **Request Body**:
```json
{
  "bloodGroup": "AB-",
  "unitsNeeded": 2,
  "urgency": "Critical",
  "patientId": "PT-4411",
  "notes": "Emergency surgery requiring immediate units."
}
```
- **Response `201 Created`**: Returns newly created request object.

### 2.3 `POST /api/v1/blood-requests/:id/pledge`
- **Description**: Donor pledges to fulfill 1 unit for a request.
- **Request Body**: `{}`
- **Response `200 OK`**:
```json
{
  "status": "success",
  "message": "Thank you for pledging! The hospital has been notified.",
  "pledgeId": "plg_881"
}
```

### 2.4 `DELETE /api/v1/blood-requests/:id`
- **Description**: Cancel an emergency request (Hospital role).
- **Response `200 OK`**: `{ "status": "success", "message": "Request cancelled." }`

---

## 3. Hospital Inventory Endpoints

### 3.1 `GET /api/v1/hospital/inventory`
- **Response `200 OK`**:
```json
{
  "status": "success",
  "data": {
    "A+": 15, "A-": 2, "B+": 20, "B-": 4,
    "AB+": 6, "AB-": 1, "O+": 25, "O-": 3
  }
}
```

### 3.2 `PUT /api/v1/hospital/inventory`
- **Request Body**:
```json
{
  "bloodGroup": "O-",
  "units": 5
}
```

---

## 4. Notifications & History Endpoints

### 4.1 `GET /api/v1/notifications`
- **Response `200 OK`**: Returns array of unread emergency alerts.

### 4.2 `GET /api/v1/donor/history`
- **Response `200 OK`**: Returns list of verified past blood donations with date, hospital name, and points earned.

### 4.3 `GET /api/v1/rewards`
- **Response `200 OK`**: Returns list of available reward vouchers and current user points balance.
