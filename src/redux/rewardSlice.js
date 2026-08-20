import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rewardService } from '../services/rewardService';

export const fetchRewards = createAsyncThunk('rewards/fetch', async () => {
  return await rewardService.getRewards();
});

export const fetchBadges = createAsyncThunk('rewards/fetchBadges', async () => {
  return await rewardService.getBadges();
});

export const fetchLeaderboard = createAsyncThunk('rewards/fetchLeaderboard', async () => {
  return await rewardService.getLeaderboard();
});

export const redeemVoucher = createAsyncThunk('rewards/redeem', async (id) => {
  return await rewardService.redeemReward(id);
});

const rewardSlice = createSlice({
  name: 'rewards',
  initialState: {
    vouchers: [],
    badges: [],
    leaderboard: [],
    pointsBalance: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(redeemVoucher.fulfilled, (state, action) => {
        const cost = action.payload.reward.pointsCost || action.payload.reward.points || 0;
        state.pointsBalance = Math.max(0, state.pointsBalance - cost);
      });
  },
});

export default rewardSlice.reducer;
