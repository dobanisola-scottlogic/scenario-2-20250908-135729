import { Alert, AlertColor, Snackbar } from '@mui/material';

interface SnackbarAlertProps {
  isSnackbarOpen: boolean;
  popupMessage: string;
  severity?: AlertColor;
  setShowSnackbar: (showSuccessSnackbar: boolean) => void;
}

const SnackbarAlert = ({
  isSnackbarOpen,
  popupMessage,
  severity = 'success',
  setShowSnackbar,
}: SnackbarAlertProps) => {
  const handleClose = () => setShowSnackbar(false);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        key={'top' + 'center'}
        open={isSnackbarOpen}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {popupMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarAlert;
