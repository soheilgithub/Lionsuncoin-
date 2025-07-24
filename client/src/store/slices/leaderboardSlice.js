import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leaderboard: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLeaderboard, setLoading, setError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;