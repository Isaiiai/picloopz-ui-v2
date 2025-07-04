import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import api from '../../config/axiosConfig';
import { PURGE } from 'redux-persist';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isActive: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface VerifyResponse {
  data: {
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null
};

// Register
export const registerUser = createAsyncThunk<AuthResponse, { name: string; email: string; password: string; phone?: string }, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', userData);
      console.log(data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login
export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


// Verify Token
export const verifyToken = createAsyncThunk<
  VerifyResponse,
  void,
  { state: { auth: AuthState }; rejectValue: string }
>(
  'auth/verifyToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log(getState())

      if (!token) {
        return rejectWithValue('No token found');
      }

      const { data } = await api.get<VerifyResponse>('/auth/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return rejectWithValue('Session expired');
      }
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: () => initialState,
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(PURGE, () => initialState)

      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.user;
        state.token = payload.token;
        toast.success(`Welcome to Picloopz, ${payload.user.name}!`);
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload || 'Registration failed';
        toast.error(payload || 'Registration failed');
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.user;
        state.token = payload.token;
        toast.success(`Welcome back, ${payload.user.name}!`);
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload || 'Login failed';
        toast.error(payload || 'Invalid email or password');
      })

      .addCase(verifyToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(verifyToken.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.user = payload.data.user;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        state.error = payload || null;
        if (payload === 'Session expired') {
          toast.error('Your session has expired. Please log in again.');
        }
      });
  }
});

export const { clearAuthState, setCredentials } = authSlice.actions;
export default authSlice.reducer;
