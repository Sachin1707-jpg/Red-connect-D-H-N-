# 🗄️ State Management Architecture - RedConnect

RedConnect manages global application state using **Redux Toolkit (RTK)**. This document outlines the store layout, state slice structures, selectors, async thunks, and state mutations.

---

## 1. Redux Store Configuration (`src/store/index.js`)

The store is configured with 7 core slice reducers:

```javascript
import { configureStore } from '@reduxjs.org/toolkit';
import authReducer from './slices/authSlice';
import bloodRequestsReducer from './slices/bloodRequestsSlice';
import inventoryReducer from './slices/inventorySlice';
import donorsReducer from './slices/donorsSlice';
import campsReducer from './slices/campsSlice';
import rewardsReducer from './slices/rewardsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bloodRequests: bloodRequestsReducer,
    inventory: inventoryReducer,
    donors: donorsReducer,
    camps: campsReducer,
    rewards: rewardsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
```

---

## 2. Global State Shape

```json
{
  "auth": {
    "user": {
      "id": "usr_9921",
      "name": "Sarah Jenkins",
      "email": "sarah.j@example.com",
      "role": "donor",
      "bloodType": "O-",
      "isAvailable": true
    },
    "token": "jwt_header.payload.signature",
    "isAuthenticated": true,
    "status": "succeeded",
    "error": null
  },
  "bloodRequests": {
    "items": [
      {
        "id": "req_001",
        "hospitalName": "City General Hospital",
        "bloodGroup": "O-",
        "unitsNeeded": 2,
        "unitsPledged": 1,
        "urgency": "Critical",
        "status": "Active",
        "createdAt": "2026-07-22T08:30:00Z"
      }
    ],
    "filters": {
      "bloodGroup": "ALL",
      "urgency": "ALL",
      "searchQuery": ""
    },
    "status": "idle",
    "error": null
  },
  "inventory": {
    "stocks": {
      "A+": 18, "A-": 4, "B+": 22, "B-": 3,
      "AB+": 8, "AB-": 1, "O+": 30, "O-": 2
    },
    "lastUpdated": "2026-07-22T09:15:00Z",
    "status": "succeeded"
  },
  "ui": {
    "theme": "light",
    "isSidebarOpen": true,
    "activeModal": null,
    "toasts": []
  }
}
```

---

## 3. Slice Specifications

### 3.1 Auth Slice (`authSlice.js`)
- **Actions**: `login.pending`, `login.fulfilled`, `login.rejected`, `logout`, `toggleAvailability`.
- **Selectors**: `selectCurrentUser`, `selectIsAuthenticated`, `selectUserRole`.

### 3.2 Blood Requests Slice (`bloodRequestsSlice.js`)
- **Actions**: `fetchRequests`, `createRequest`, `pledgeRequest`, `setFilterGroup`, `setSearchQuery`.
- **Selectors**: `selectAllRequests`, `selectFilteredRequests`, `selectRequestById`.

### 3.3 Inventory Slice (`inventorySlice.js`)
- **Actions**: `fetchInventory`, `updateStockUnit`, `triggerLowStockAlert`.
- **Selectors**: `selectInventoryStocks`, `selectLowStockAlerts`.

---

## 4. Standard Async Thunk Lifecycle Pattern

All async thunks follow standardized state transitions:

```javascript
// Example Async Thunk for Request Pledges
export const pledgeBloodRequest = createAsyncThunk(
  'bloodRequests/pledge',
  async ({ requestId }, { rejectWithValue }) => {
    try {
      const response = await bloodRequestService.pledge(requestId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Slice extraReducers handling
builder
  .addCase(pledgeBloodRequest.pending, (state) => {
    state.status = 'loading';
    state.error = null;
  })
  .addCase(pledgeBloodRequest.fulfilled, (state, action) => {
    state.status = 'succeeded';
    const index = state.items.findIndex(item => item.id === action.payload.id);
    if (index !== -1) {
      state.items[index] = action.payload;
    }
  })
  .addCase(pledgeBloodRequest.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload?.message || 'Failed to complete pledge';
  });
```
