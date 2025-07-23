import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/games');
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

export const fetchGameById = createAsyncThunk(
  'games/fetchGameById',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
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

export const startGame = createAsyncThunk(
  'games/startGame',
  async (gameId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/games/${gameId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
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

export const endGame = createAsyncThunk(
  'games/endGame',
  async ({ gameId, score, duration }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/games/${gameId}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score, duration }),
      });
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
  games: [],
  currentGame: null,
  gameSession: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    difficulty: 'all',
    sortBy: 'popularity',
  },
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
      state.gameSession = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateGameSession: (state, action) => {
      if (state.gameSession) {
        state.gameSession = { ...state.gameSession, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Game By ID
      .addCase(fetchGameById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Start Game
      .addCase(startGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameSession = action.payload;
      })
      .addCase(startGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // End Game
      .addCase(endGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(endGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gameSession = null;
      })
      .addCase(endGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentGame, clearError, updateGameSession } = gamesSlice.actions;
export default gamesSlice.reducer;