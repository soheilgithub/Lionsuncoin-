import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  socket: null, // Non-serializable, handled in middleware
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectSocket(state) {
      state.isConnected = true;
      // TODO: Assign socket instance
    },
    disconnectSocket(state) {
      state.isConnected = false;
      state.socket = null;
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export const { connectSocket, disconnectSocket, setSocket } = socketSlice.actions;
export default socketSlice.reducer;