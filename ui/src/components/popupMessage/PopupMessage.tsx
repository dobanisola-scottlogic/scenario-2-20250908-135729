import { Alert, Snackbar } from '@mui/material';

interface PopupMessageProps {
  isSnackbarOpen: boolean;
  popupMessage: string;
  severity?: string;
  setShowSnackbar: (showSuccessSnackbar: boolean) => void;
}

const PopupMessage = ({
  isSnackbarOpen,
  popupMessage,
  severity = 'success',
  setShowSnackbar,
}: PopupMessageProps) => {
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

export default PopupMessage;
