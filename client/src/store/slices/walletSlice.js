import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
};

export const fetchWallet = createAsyncThunk('wallet/fetchWallet', async (_, thunkAPI) => {
  // TODO: Implement API call to fetch wallet info
  return { balance: 0, transactions: [] };
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default walletSlice.reducer;