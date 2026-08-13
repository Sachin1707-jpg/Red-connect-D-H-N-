import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/profileService';

export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await profileService.getProfile();
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch profile');
  }
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
  try {
    return await profileService.updateProfile(data);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update profile');
  }
});

export const toggleDonorAvailability = createAsyncThunk('user/toggleAvailability', async (isAvailable, { rejectWithValue }) => {
  try {
    return await profileService.toggleAvailability(isAvailable);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to toggle availability');
  }
});

export const fetchDonationHistory = createAsyncThunk('user/fetchDonationHistory', async (_, { rejectWithValue }) => {
  try {
    return await profileService.getDonationHistory();
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch donation history');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    donationHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(toggleDonorAvailability.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isAvailable = action.payload.isAvailable;
        }
      })
      .addCase(fetchDonationHistory.fulfilled, (state, action) => {
        state.donationHistory = action.payload;
      });
  },
});

export default userSlice.reducer;
