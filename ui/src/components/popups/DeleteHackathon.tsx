import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  LinearProgress,
  Typography
} from '@mui/material';
import { useDeleteHackathonMutation } from '../../api/api';
import { PopupProps } from '../../interfaces/PopupTypes';
import PopupMessage from '../popupMessage/PopupMessage';

type DeleteHackathonProps = PopupProps & { hackathonId: string};

const DeleteHackathon = ({
  isOpen,
  hackathonId,
  setIsOpen,
}: DeleteHackathonProps) => {

    const [deleteHackathon, {isLoading: isDeleting}] = useDeleteHackathonMutation();

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    
    const handleClose = () => {
        setFormError(undefined);
        setIsOpen(false);
    }

  const handleDelete = () => {
    setFormError(undefined);

    deleteHackathon(hackathonId)
    .unwrap()
    .then(() => {
      setSnackbarOpen(true);
      handleClose();
    })
    .catch((createError: unknown) => {
      const { status } = createError as { status: number };
      if (status === 400) {
        setFormError('Error deleting hackathon - bad request');
      } else {
        setFormError('Error deleting hackathon - internal server error');
      }
    });
  }

  return (
    <>
      <PopupMessage
        isSnackbarOpen={isSnackbarOpen}
        popupMessage="Hackathon deleted successfully!"
        setShowSnackbar={setSnackbarOpen}
      />

      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={{ width: 500 }}>
            <Typography
                sx={{ m: 1, mx: 'auto' }}
                role="dialogHeading"
            >
                Are you sure you want to delete the hackathon?
            </Typography>
            <Typography
                sx={{ fontWeight: 'normal', m: 1, mx: 'auto' }}
                role="dialogHeading"
            >
                This will delete teams and games in the hackathon as well.
                You <strong>cannot</strong> undo this action.
            </Typography>

            <Box
                sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                m: 1,
                }}
            >
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleDelete}>DELETE HACKATHON</Button>
          </Box>

          {formError && (
            <Alert 
                severity="error"
                sx={{
                  my: 2,
                  mr: 1,
                }}
            >
              {formError}
            </Alert>
          )}
          
          {isDeleting && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteHackathon;
