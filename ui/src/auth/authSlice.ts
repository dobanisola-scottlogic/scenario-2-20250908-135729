import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { AuthState } from '../interfaces/AuthState';
import type { RootState } from '../store';

const initialState: AuthState = {
  name: null,
  role: null,
  credentials: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<string>) => {
      state.credentials = action.payload;
    },
    logout: () => {
      return initialState;
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
});

export const { setCredentials, logout } = authSlice.actions;

export const selectUserRole = (state: RootState) => state.auth.role;
export const selectTeamName = (state: RootState) => state.auth.name;
export const selectCredentials = (state: RootState) => state.auth.credentials;

export default authSlice.reducer;
