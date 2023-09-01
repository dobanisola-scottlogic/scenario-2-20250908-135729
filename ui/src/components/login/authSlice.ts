import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { UserRole } from '../../enums/UserRole';

// Define a type for the slice state
interface LoginState {
  name: string;
  role: UserRole;
  status: 'idle' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: LoginState = {
  name: '',
  role: UserRole.NONE,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.status = 'idle';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

// export const { login } = loginSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectAuthName = (state: RootState) => state.auth.name;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
