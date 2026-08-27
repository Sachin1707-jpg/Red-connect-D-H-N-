import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestService } from '../services/requestService';
import { mockBloodRequests } from '../data/mockData';

export const fetchRequests = createAsyncThunk('requests/fetch', async (filters, { rejectWithValue }) => {
  try {
    return await requestService.getRequests(filters);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch blood requests');
  }
});

export const createBloodRequest = createAsyncThunk('requests/create', async (requestData, { rejectWithValue }) => {
  try {
    return await requestService.createRequest(requestData);
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create request');
  }
});

export const pledgeBloodRequest = createAsyncThunk('requests/pledge', async (requestId, { rejectWithValue }) => {
  try {
    return await requestService.pledgeRequest(requestId);
  } catch (err) {
    return rejectWithValue(err.message || 'Pledge failed');
  }
});

export const deleteBloodRequest = createAsyncThunk('requests/delete', async (requestId, { rejectWithValue }) => {
  try {
    return await requestService.deleteRequest(requestId);
  } catch (err) {
    return rejectWithValue(err.message || 'Delete failed');
  }
});

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    // ← Pre-seeded with mock data so request lists are never empty on first load
    items: mockBloodRequests,
    loading: false,
    error: null,
    filters: {
      bloodGroup: 'ALL',
      urgency: 'ALL',
      search: '',
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 6,
    }
  },
  reducers: {
    setFilterBloodGroup: (state, action) => {
      state.filters.bloodGroup = action.payload;
    },
    setFilterUrgency: (state, action) => {
      state.filters.urgency = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        // Only replace mock seed if live data returned actual results
        if (action.payload && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Pledge
      .addCase(pledgeBloodRequest.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteBloodRequest.fulfilled, (state, action) => {
        state.items = state.items.filter((r) => r.id !== action.payload);
      });
  },
});

export const { setFilterBloodGroup, setFilterUrgency, setSearchQuery, setCurrentPage } = requestSlice.actions;
export default requestSlice.reducer;
