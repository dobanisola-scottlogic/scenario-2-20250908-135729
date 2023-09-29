import { Alert, Snackbar } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectSnackbarState,
  setSnackbarState,
} from '../../slices/snackbarSlice';

const SnackbarAlert = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const snackbarState = useAppSelector(selectSnackbarState);

  const setShowSnackbar = (isOpen: boolean) => {
    dispatch(
      setSnackbarState({
        isOpen,
        message: snackbarState.message,
        severity: snackbarState.severity,
      })
    );
  };

  const handleClose = () => setShowSnackbar(false);

  useEffect(() => {
    // Close snackbar when route changes
    setShowSnackbar(false);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        key={'top' + 'center'}
        open={snackbarState.isOpen}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarState.severity}
          sx={{ width: '100%' }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarAlert;
