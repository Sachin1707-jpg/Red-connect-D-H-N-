import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campService } from '../services/campService';
import { mockCamps, mockVolunteers, mockNgoNotifications } from '../data/mockData';

export const fetchCamps = createAsyncThunk('ngo/fetchCamps', async (_, { rejectWithValue }) => {
  try {
    return await campService.getCamps();
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch camps');
  }
});

export const createCamp = createAsyncThunk('ngo/createCamp', async (campData, { rejectWithValue }) => {
  try {
    return await campService.createCamp(campData);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create camp');
  }
});

export const assignVolunteerThunk = createAsyncThunk('ngo/assignVolunteer', async ({ id, role }, { rejectWithValue }) => {
  try {
    return await campService.assignVolunteer(id, role);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to assign volunteer');
  }
});

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: {
    camps: mockCamps,
    volunteers: mockVolunteers,
    ngoNotifications: mockNgoNotifications,
    shortages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCampLocal: (state, action) => {
      state.camps.unshift(action.payload);
    },
    updateCampLocal: (state, action) => {
      const index = state.camps.findIndex((c) => (c.id || c._id) === (action.payload.id || action.payload._id));
      if (index !== -1) {
        state.camps[index] = { ...state.camps[index], ...action.payload };
      }
    },
    deleteCampLocal: (state, action) => {
      state.camps = state.camps.filter((c) => (c.id || c._id) !== action.payload);
    },
    assignVolunteerLocal: (state, action) => {
      const { id, role } = action.payload;
      const index = state.volunteers.findIndex((v) => (v.id || v._id) === id);
      if (index !== -1) {
        state.volunteers[index].role = role;
        state.volunteers[index].status = 'Assigned';
      }
    },
    updateVolunteerLocal: (state, action) => {
      const index = state.volunteers.findIndex((v) => (v.id || v._id) === (action.payload.id || action.payload._id));
      if (index !== -1) {
        state.volunteers[index] = { ...state.volunteers[index], ...action.payload };
      }
    },
    sendNgoNotificationLocal: (state, action) => {
      state.ngoNotifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCamps.fulfilled, (state, action) => {
        if (action.payload && action.payload.length > 0) {
          state.camps = action.payload;
        }
      })
      .addCase(createCamp.fulfilled, (state, action) => {
        state.camps.unshift(action.payload);
      })
      .addCase(assignVolunteerThunk.fulfilled, (state, action) => {
        const { id, role, status } = action.payload;
        const idx = state.volunteers.findIndex((v) => (v.id || v._id) === id);
        if (idx !== -1) {
          state.volunteers[idx].role = role;
          state.volunteers[idx].status = status;
        }
      });
  },
});

export const {
  addCampLocal,
  updateCampLocal,
  deleteCampLocal,
  assignVolunteerLocal,
  updateVolunteerLocal,
  sendNgoNotificationLocal,
} = ngoSlice.actions;

export default ngoSlice.reducer;


