import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../services/notificationService';
import { mockNotifications } from '../data/mockData';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  return await notificationService.getNotifications();
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id) => {
  return await notificationService.markAsRead(id);
});

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async () => {
  return await notificationService.markAllAsRead();
});

export const deleteNotification = createAsyncThunk('notifications/delete', async (id) => {
  return await notificationService.deleteNotification(id);
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: mockNotifications,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default notificationSlice.reducer;
