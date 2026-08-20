import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { campService } from '../services/campService';

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
    camps: [],
    volunteers: [],
    shortages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCampLocal: (state, action) => {
      state.camps.unshift(action.payload);
    },
    assignVolunteerLocal: (state, action) => {
      const { id, role } = action.payload;
      const index = state.volunteers.findIndex(v => (v.id || v._id) === id);
      if (index !== -1) {
        state.volunteers[index].role = role;
        state.volunteers[index].status = 'Assigned';
      }
    }
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
        const idx = state.volunteers.findIndex(v => (v.id || v._id) === id);
        if (idx !== -1) {
          state.volunteers[idx].role = role;
          state.volunteers[idx].status = status;
        }
      });
  }
});

export const { addCampLocal, assignVolunteerLocal } = ngoSlice.actions;
export default ngoSlice.reducer;
