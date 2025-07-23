import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  leaderboard: [],
  loading: false,
  error: null,
};

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetchLeaderboard', async (_, thunkAPI) => {
  // TODO: Implement API call to fetch leaderboard
  return [];
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default leaderboardSlice.reducer;