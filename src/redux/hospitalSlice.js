import { createSlice } from '@reduxjs/toolkit';

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState: {
    inventory: {
      'A+': 18, 'A-': 4, 'B+': 22, 'B-': 3,
      'AB+': 8, 'AB-': 1, 'O+': 35, 'O-': 2
    },
    donorResponses: [
      { id: '1', donorName: 'Sarah Jenkins', bloodGroup: 'O-', distance: '2.4 km', availability: 'Available', status: 'Pending', phone: '+1-555-0147' },
      { id: '2', donorName: 'Alex Vance', bloodGroup: 'O-', distance: '1.2 km', availability: 'Available', status: 'Accepted', phone: '+1-555-0011' },
      { id: '3', donorName: 'Brian Lawson', bloodGroup: 'A+', distance: '3.4 km', availability: 'Available', status: 'Pending', phone: '+1-555-0033' },
    ],
    emergencyCases: [
      { id: 'c1', patientName: 'Robert Chen', priority: 'Critical', bloodGroup: 'O-', unitsRequired: 3, timeline: 'Surgery in 30 mins' },
      { id: 'c2', patientName: 'Elena Vance', priority: 'High', bloodGroup: 'B-', unitsRequired: 2, timeline: 'Transfusion today' },
    ],
    loading: false,
  },
  reducers: {
    updateInventoryUnit: (state, action) => {
      const { group, units } = action.payload;
      state.inventory[group] = Math.max(0, units);
    },
    updateDonorStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.donorResponses.findIndex(d => d.id === id);
      if (index !== -1) {
        state.donorResponses[index].status = status;
      }
    }
  }
});

export const { updateInventoryUnit, updateDonorStatus } = hospitalSlice.actions;
export default hospitalSlice.reducer;
