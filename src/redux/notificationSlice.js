import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../services/notificationService';

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
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
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
