import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials);
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed');
  }
});

export const loginWithGoogle = createAsyncThunk('auth/googleLogin', async (role, { rejectWithValue }) => {
  try {
    return await authService.loginWithGoogle(role);
  } catch (err) {
    return rejectWithValue(err.message || 'Google Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    return await authService.signup(userData);
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
  return null;
});

// ─── Session Hydration ────────────────────────────────────────────────────────

const _storedToken = localStorage.getItem('redconnect_token');
const _storedRefresh = localStorage.getItem('redconnect_refresh_token');
const _storedUser = (() => {
  try {
    const raw = localStorage.getItem('redconnect_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
})();

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // If a stored token & user exist → resume session; else use default donor for demo
    user: _storedUser || {
      id: 'usr_001',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      role: 'donor',
      phone: '+1-555-0147',
      bloodGroup: 'O-',
      isAvailable: true,
      rewardPoints: 850,
      totalDonations: 8,
      livesSaved: 24,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    token: _storedToken || null,
    refreshToken: _storedRefresh || null,
    // ← True when real token present OR always-on demo mode
    isAuthenticated: !!_storedToken,
    isFirstVisit: false,   // set to true after a fresh signup
    loading: false,
    error: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserLocal: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('redconnect_user', JSON.stringify(state.user));
    },
    /** Dismiss the first-visit welcome modal */
    dismissFirstVisit: (state) => {
      state.isFirstVisit = false;
    },
    /** Force-login with an existing user object (e.g. demo mode) */
    setDemoUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = 'demo_token';
    },
  },

  extraReducers: (builder) => {
    builder
      // ── Login ──────────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isFirstVisit = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Google Login ───────────────────────────────────────────────────────
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isFirstVisit = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Signup (Auto-Login) ────────────────────────────────────────────────
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;          // ← auto-login: mark authenticated
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.isFirstVisit = true;             // ← trigger welcome modal on first dashboard visit
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Logout ─────────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isFirstVisit = false;
      });
  },
});

export const { clearError, updateUserLocal, dismissFirstVisit, setDemoUser } = authSlice.actions;
export default authSlice.reducer;
