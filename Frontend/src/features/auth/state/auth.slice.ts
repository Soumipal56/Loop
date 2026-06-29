import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/auth.api';

// Async Thunks
export const registerUser = createAsyncThunk('auth/register', async (data: any, { rejectWithValue }) => {
  try {
    return await authApi.register(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data: any, { rejectWithValue }) => {
  try {
    return await authApi.login(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data: any, { rejectWithValue }) => {
  try {
    return await authApi.verifyOTP(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'OTP Verification failed');
  }
});

export const resendOTP = createAsyncThunk('auth/resendOTP', async (data: any, { rejectWithValue }) => {
  try {
    return await authApi.resendOTP(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    return await authApi.getMe();
  } catch (error: any) {
    return rejectWithValue('Not authenticated');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    return true;
  } catch (error: any) {
    return rejectWithValue('Logout failed');
  }
});

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setOtpEmail: (state, action) => {
      state.otpEmail = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login (OTP sent)
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOTP.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.otpEmail = null;
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Me
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.otpEmail = null;
    });
  },
});

export const { clearError, setOtpEmail } = authSlice.actions;
export default authSlice.reducer;
