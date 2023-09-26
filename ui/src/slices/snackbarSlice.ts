import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface SnackbarState {
  isOpen: boolean;
  message: string;
}

const initialState: SnackbarState = {
  isOpen: false,
  message: '',
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setSnackbarState: (state, action: PayloadAction<SnackbarState>) => {
      state.isOpen = action.payload.isOpen;
      state.message = action.payload.message;
    },
  },
});

export const { setSnackbarState } = snackbarSlice.actions;

export const selectSnackbarState = (state: RootState) => state.snackbar;

export default snackbarSlice.reducer;
