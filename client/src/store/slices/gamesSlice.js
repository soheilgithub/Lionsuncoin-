import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  games: [],
  loading: false,
  error: null,
};

export const fetchGames = createAsyncThunk('games/fetchGames', async (_, thunkAPI) => {
  // TODO: Implement API call to fetch games
  return [];
});

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gamesSlice.reducer;