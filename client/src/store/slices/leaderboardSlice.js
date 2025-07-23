import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async ({ gameId, timeframe = 'weekly', limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leaderboard?gameId=${gameId}&timeframe=${timeframe}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGlobalLeaderboard = createAsyncThunk(
  'leaderboard/fetchGlobalLeaderboard',
  async ({ timeframe = 'weekly', limit = 100 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leaderboard/global?timeframe=${timeframe}&limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  gameLeaderboards: {},
  globalLeaderboard: [],
  userRanks: {},
  isLoading: false,
  error: null,
  timeframe: 'weekly',
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        const { gameId, timeframe } = action.meta.arg;
        const key = `${gameId}_${timeframe}`;
        state.gameLeaderboards[key] = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setTimeframe, clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
