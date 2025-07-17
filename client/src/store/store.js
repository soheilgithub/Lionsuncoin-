import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import gamesSlice from './slices/gamesSlice';
import walletSlice from './slices/walletSlice';
import leaderboardSlice from './slices/leaderboardSlice';
import socketSlice from './slices/socketSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    games: gamesSlice,
    wallet: walletSlice,
    leaderboard: leaderboardSlice,
    socket: socketSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;