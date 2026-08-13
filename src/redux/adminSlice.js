import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingHospitals: [
      { id: 'h_p1', name: 'Apex Heart & Trauma Center', license: 'HOSP-88102-NY', address: '120 Apex Way, Sector 9', status: 'Pending Approval' },
      { id: 'h_p2', name: 'St. Mary Specialized Hospital', license: 'HOSP-77190-CA', address: '45 Saint Mary Blvd', status: 'Pending Approval' },
    ],
    pendingNgos: [
      { id: 'n_p1', name: 'Hope Blood Relief NGO', license: 'NGO-44102-REG', location: 'Metropolis North', status: 'Pending Approval' },
    ],
    users: [
      { id: 'u1', name: 'Sarah Jenkins', role: 'donor', status: 'Active', email: 'sarah.j@example.com' },
      { id: 'u2', name: 'Metro General Hospital', role: 'hospital', status: 'Active', email: 'emergency@citygeneral.org' },
      { id: 'u3', name: 'Red Cross Community', role: 'ngo', status: 'Active', email: 'contact@redcross.org' },
      { id: 'u4', name: 'John Suspended', role: 'donor', status: 'Suspended', email: 'john.s@example.com' },
    ],
    reportedRequests: [
      { id: 'r1', title: 'Suspicious duplicate O- request', reportedBy: 'Donor Mark', reason: 'Unverified medical document', status: 'Under Review' },
    ],
    auditLogs: [
      { id: 'al1', action: 'Hospital Approval', user: 'Admin User', details: 'Approved Metro General Hospital license', timestamp: '2 hours ago' },
      { id: 'al2', action: 'User Suspended', user: 'Admin User', details: 'Suspended user John Suspended for fake requests', timestamp: '1 day ago' },
    ]
  },
  reducers: {
    approveHospital: (state, action) => {
      state.pendingHospitals = state.pendingHospitals.filter(h => h.id !== action.payload);
    },
    approveNgo: (state, action) => {
      state.pendingNgos = state.pendingNgos.filter(n => n.id !== action.payload);
    },
    updateUserRoleStatus: (state, action) => {
      const { id, status, role } = action.payload;
      const index = state.users.findIndex(u => u.id === id);
      if (index !== -1) {
        if (status) state.users[index].status = status;
        if (role) state.users[index].role = role;
      }
    }
  }
});

export const { approveHospital, approveNgo, updateUserRoleStatus } = adminSlice.actions;
export default adminSlice.reducer;
