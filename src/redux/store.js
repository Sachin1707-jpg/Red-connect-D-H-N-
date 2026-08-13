import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import requestReducer from './requestSlice';
import notificationReducer from './notificationSlice';
import rewardReducer from './rewardSlice';
import themeReducer from './themeSlice';
import hospitalReducer from './hospitalSlice';
import ngoReducer from './ngoSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    requests: requestReducer,
    notifications: notificationReducer,
    rewards: rewardReducer,
    theme: themeReducer,
    hospital: hospitalReducer,
    ngo: ngoReducer,
    admin: adminReducer,
  },
});

export default store;
