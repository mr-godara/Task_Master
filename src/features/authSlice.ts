import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';
import { saveUserToStorage, saveAuthState, getUserFromStorage, getAuthState } from '../utils/localStorage';

// Initial state with data from localStorage for persistence
const initialState: AuthState = {
  user: getUserFromStorage(),
  isAuthenticated: getAuthState(),
  isLoading: false,
  error: null,
};

// Mock login - in real app this would call an API
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication - in real app validate with backend
      if (credentials.username && credentials.password.length >= 4) {
        // Mock successful login
        const user: User = {
          id: '1',
          username: credentials.username,
          token: 'mock-jwt-token',
        };
        
        // Save to localStorage
        saveUserToStorage(user);
        saveAuthState(true);
        
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  // Clear data from localStorage
  saveUserToStorage(null);
  saveAuthState(false);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Sync reducers if needed
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 