import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rewardService } from '../services/rewardService';
import { mockRewards, mockBadges, mockLeaderboard } from '../data/mockData';

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
    vouchers: mockRewards,
    badges: mockBadges,
    leaderboard: mockLeaderboard,
    pointsBalance: 850,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.vouchers = action.payload;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(redeemVoucher.fulfilled, (state, action) => {
        state.pointsBalance -= action.payload.reward.pointsCost;
      });
  },
});

export default rewardSlice.reducer;
