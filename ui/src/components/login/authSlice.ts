import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { UserRole } from '../../enums/UserRole';
import { api } from '../../api/api';

// Define a type for the slice state
interface LoginState {
  name: string;
  role: UserRole;
  credentials: string;
  status: 'idle' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: LoginState = {
  name: '',
  role: UserRole.NONE,
  credentials: '',
  status: 'idle',
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: string) => {
    const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/login', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + credentials,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    loginSuccess: (state, action) => {
      state.role = action.payload.role;
      state.name = action.payload.name;
    },
    logout: (state) => {
      state.role = UserRole.NONE;
      state.name = '';
      state.credentials = '';
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.role = payload.role;
        state.name = payload.name;
      }
    );
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(login.fulfilled, (state, action) => {
  //       state.role = action.payload.role;
  //       state.name = action.payload.name;
  //       state.status = 'idle';
  //     })
  //     .addCase(login.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(login.rejected, (state) => {
  //       state.status = 'failed';
  //     });
  // },
});

export const {setCredentials, loginSuccess, logout} = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectAuthName = (state: RootState) => state.auth.name;
export const selectCredentials = (state: RootState) => state.auth.credentials;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
