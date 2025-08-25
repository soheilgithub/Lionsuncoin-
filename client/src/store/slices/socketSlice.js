import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  socketId: null,
  error: null
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectSocket: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    disconnectSocket: (state) => {
      state.isConnected = false;
      state.socketId = null;
      state.error = null;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
      state.isConnected = false;
    },
    clearSocketError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  connectSocket, 
  disconnectSocket, 
  setSocketId, 
  setSocketError, 
  clearSocketError 
} = socketSlice.actions;

export default socketSlice.reducer;