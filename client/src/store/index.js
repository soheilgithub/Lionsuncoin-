import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import socketReducer from './slices/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;