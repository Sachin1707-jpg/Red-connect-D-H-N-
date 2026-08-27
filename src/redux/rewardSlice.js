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

export const fetchUserPoints = createAsyncThunk('rewards/fetchUserPoints', async () => {
  return await rewardService.getUserPoints();
});

export const redeemVoucher = createAsyncThunk('rewards/redeem', async ({ id, pointsCost }) => {
  return await rewardService.redeemReward(id, pointsCost);
});

export const awardPoints = createAsyncThunk('rewards/addPoints', async (pointsToAdd) => {
  await rewardService.addPoints(pointsToAdd);
  return pointsToAdd;
});

const rewardSlice = createSlice({
  name: 'rewards',
  initialState: {
    vouchers: [],
    badges: [],
    leaderboard: [],
    pointsBalance: 0,
    redeemedCode: null,
    loading: false,
    error: null,
  },

  reducers: {
    setPointsBalance: (state, action) => {
      state.pointsBalance = action.payload;
    },
    addPointsLocal: (state, action) => {
      state.pointsBalance = Math.max(0, state.pointsBalance + action.payload);
    },
    clearRedeemedCode: (state) => {
      state.redeemedCode = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRewards.pending, (state) => { state.loading = true; })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchRewards.rejected, (state) => { state.loading = false; })

      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
      })

      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })

      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.pointsBalance = action.payload;
      })

      .addCase(redeemVoucher.fulfilled, (state, action) => {
        const cost = action.payload?.reward?.pointsCost || 0;
        state.pointsBalance = Math.max(0, state.pointsBalance - cost);
        state.redeemedCode = action.payload?.reward?.code || null;
      })

      .addCase(awardPoints.fulfilled, (state, action) => {
        state.pointsBalance = state.pointsBalance + action.payload;
      });
  },
});

export const { setPointsBalance, addPointsLocal, clearRedeemedCode } = rewardSlice.actions;
export default rewardSlice.reducer;
