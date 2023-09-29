import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface SnackbarState {
  isOpen: boolean;
  message: string;
  severity?: AlertColor;
}

const initialState: SnackbarState = {
  isOpen: false,
  message: '',
  severity: 'success',
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setSnackbarState: (state, action: PayloadAction<SnackbarState>) => {
      state.isOpen = action.payload.isOpen;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
  },
});

export const { setSnackbarState } = snackbarSlice.actions;

export const selectSnackbarState = (state: RootState) => state.snackbar;

export default snackbarSlice.reducer;
