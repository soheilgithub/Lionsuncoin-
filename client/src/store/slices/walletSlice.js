import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchWalletBalance',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
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

export const fetchTransactionHistory = createAsyncThunk(
  'wallet/fetchTransactionHistory',
  async ({ page = 1, limit = 10 }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/wallet/transactions?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
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

export const claimReward = createAsyncThunk(
  'wallet/claimReward',
  async (rewardData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/wallet/claim-reward', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rewardData),
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

export const withdrawFunds = createAsyncThunk(
  'wallet/withdrawFunds',
  async (withdrawalData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withdrawalData),
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
  balance: {
    lionsuncoin: 0,
    usd: 0,
    btc: 0,
    eth: 0,
  },
  transactions: [],
  pendingRewards: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPendingReward: (state, action) => {
      state.pendingRewards.push(action.payload);
    },
    removePendingReward: (state, action) => {
      state.pendingRewards = state.pendingRewards.filter(
        reward => reward.id !== action.payload
      );
    },
    updateBalance: (state, action) => {
      state.balance = { ...state.balance, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet Balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.pendingRewards = action.payload.pendingRewards || [];
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Transaction History
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Claim Reward
      .addCase(claimReward.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = { ...state.balance, ...action.payload.newBalance };
        state.pendingRewards = state.pendingRewards.filter(
          reward => reward.id !== action.payload.claimedRewardId
        );
      })
      .addCase(claimReward.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Withdraw Funds
      .addCase(withdrawFunds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = { ...state.balance, ...action.payload.newBalance };
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addPendingReward, removePendingReward, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;