import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
    return response.data.user || response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Not authenticated');
  }
});

const initialState = {
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
      });
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
