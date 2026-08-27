import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestService } from '../services/requestService';
import { getAvailableDonors } from '../services/firestoreDataService';
import { mockInventory, mockDonorResponses, mockEmergencyCases } from '../data/mockData';

export const fetchHospitalCases = createAsyncThunk('hospital/fetchCases', async (filters, { rejectWithValue }) => {
  try {
    const requests = await requestService.getRequests(filters);
    return requests;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch hospital cases');
  }
});

export const fetchHospitalDonors = createAsyncThunk('hospital/fetchDonors', async (_, { rejectWithValue }) => {
  try {
    const donors = await getAvailableDonors();
    return donors;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch donors');
  }
});

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState: {
    // ← Pre-seeded with mock data so dashboards are never empty on first load
    inventory: mockInventory,
    donorResponses: mockDonorResponses,
    emergencyCases: mockEmergencyCases,
    loading: false,
    error: null,
  },
  reducers: {
    updateInventoryUnit: (state, action) => {
      const { group, units } = action.payload;
      state.inventory[group] = Math.max(0, units);
    },
    updateDonorStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.donorResponses.findIndex(d => (d.id || d._id) === id);
      if (index !== -1) {
        state.donorResponses[index].status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitalCases.fulfilled, (state, action) => {
        state.loading = false;
        // Only overwrite if live data actually returned results
        if (action.payload && action.payload.length > 0) {
          state.emergencyCases = action.payload;
        }
      })
      .addCase(fetchHospitalCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Keep mock data on failure — don't blank the UI
      })
      .addCase(fetchHospitalDonors.fulfilled, (state, action) => {
        // Only overwrite if live data returned results
        if (action.payload && action.payload.length > 0) {
          state.donorResponses = action.payload;
        }
      });
  }
});

export const { updateInventoryUnit, updateDonorStatus } = hospitalSlice.actions;
export default hospitalSlice.reducer;

