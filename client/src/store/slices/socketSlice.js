import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  isConnected: false,
  connectionError: null,
  onlineUsers: 0,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.isConnected = false;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearSocket: (state) => {
      state.socket = null;
      state.isConnected = false;
      state.connectionError = null;
      state.onlineUsers = 0;
    },
  },
});

export const {
  setSocket,
  setConnected,
  setConnectionError,
  setOnlineUsers,
  clearSocket,
} = socketSlice.actions;

// Async action creators
export const connectSocket = (token) => (dispatch) => {
  // Socket connection logic would go here
  dispatch(setConnected(true));
};

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    dispatch(clearSocket());
  }
};

export default socketSlice.reducer;
