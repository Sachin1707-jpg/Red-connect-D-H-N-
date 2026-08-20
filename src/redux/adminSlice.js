import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../services/adminService';

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (filters, { rejectWithValue }) => {
  try {
    return await adminService.listUsers(filters);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch users');
  }
});

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    return await adminService.getStats();
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch stats');
  }
});

export const verifyAdminUser = createAsyncThunk('admin/verifyUser', async ({ id, verified }, { rejectWithValue }) => {
  try {
    return await adminService.verifyUser(id, verified);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to verify user');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingHospitals: [],
    pendingNgos: [],
    users: [],
    stats: null,
    reportedRequests: [],
    auditLogs: [],
    loading: false,
    error: null,
  },
  reducers: {
    approveHospital: (state, action) => {
      state.pendingHospitals = state.pendingHospitals.filter(h => (h.id || h._id) !== action.payload);
    },
    approveNgo: (state, action) => {
      state.pendingNgos = state.pendingNgos.filter(n => (n.id || n._id) !== action.payload);
    },
    updateUserRoleStatus: (state, action) => {
      const { id, status, role } = action.payload;
      const index = state.users.findIndex(u => (u.id || u._id) === id);
      if (index !== -1) {
        if (status) state.users[index].status = status;
        if (role) state.users[index].role = role;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(verifyAdminUser.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated) {
          const idx = state.users.findIndex(u => (u.id || u._id) === (updated.id || updated._id));
          if (idx !== -1) state.users[idx] = updated;
        }
      });
  }
});

export const { approveHospital, approveNgo, updateUserRoleStatus } = adminSlice.actions;
export default adminSlice.reducer;
