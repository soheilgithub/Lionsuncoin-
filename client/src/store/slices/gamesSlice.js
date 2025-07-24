import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  games: [],
  currentGame: null,
  loading: false,
  error: null,
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setGames: (state, action) => {
      state.games = action.payload;
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setGames, setCurrentGame, setLoading, setError } = gamesSlice.actions;
export default gamesSlice.reducer;