import { createSlice } from '@reduxjs/toolkit';

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: {
    camps: [
      { id: '1', title: 'Metropolis Mega Community Drive', date: '2026-08-05', location: 'City Park', target: 200, registered: 142 },
      { id: '2', title: 'University Youth Drive', date: '2026-08-12', location: 'Student Union', target: 150, registered: 98 },
    ],
    volunteers: [
      { id: 'v1', name: 'Emily Davis', role: 'Registration Desk', status: 'Assigned', phone: '+1-555-4411' },
      { id: 'v2', name: 'James Wilson', role: 'Donor Assistance', status: 'Available', phone: '+1-555-4422' },
    ],
    shortages: [
      { id: 's1', hospital: 'Metro General Hospital', bloodGroup: 'O-', unitsNeeded: 5, priority: 'Critical' },
      { id: 's2', hospital: "St. Jude Children's", bloodGroup: 'AB-', unitsNeeded: 3, priority: 'High' },
    ],
  },
  reducers: {
    addCamp: (state, action) => {
      state.camps.unshift(action.payload);
    },
    assignVolunteer: (state, action) => {
      const { id, role } = action.payload;
      const index = state.volunteers.findIndex(v => v.id === id);
      if (index !== -1) {
        state.volunteers[index].role = role;
        state.volunteers[index].status = 'Assigned';
      }
    }
  }
});

export const { addCamp, assignVolunteer } = ngoSlice.actions;
export default ngoSlice.reducer;
