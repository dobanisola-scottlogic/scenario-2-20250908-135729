import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDeleteTeamMutation } from '../../api/api';
import { PopupProps } from '../../interfaces/PopupTypes';
import PopupMessage from '../popupMessage/PopupMessage';

const DeleteTeam = ({ isOpen, id, setIsOpen }: PopupProps) => {
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSnackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleClose = () => {
    setFormError(undefined);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setFormError(undefined);

    deleteTeam(id!)
      .unwrap()
      .then(() => {
        setSnackbarOpen(true);
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };
        if (status === 400) {
          setFormError('Error deleting team - bad request');
        } else {
          setFormError('Error deleting team - internal server error');
        }
      });
  };

  return (
    <>
      <PopupMessage
        isSnackbarOpen={isSnackbarOpen}
        popupMessage="Team deleted successfully!"
        setShowSnackbar={setSnackbarOpen}
      />

      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={{ width: 500 }}>
          <Typography sx={{ m: 1, mx: 'auto' }} role="dialogHeading">
            Are you sure you want to delete the team?
          </Typography>
          <Typography
            sx={{ fontWeight: 'normal', m: 1, mx: 'auto' }}
            role="dialogHeading"
          >
            This will delete the team&apos;s games as well. You{' '}
            <strong>cannot</strong> undo this action.
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
            <Button onClick={handleDelete}>DELETE TEAM</Button>
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

export default DeleteTeam;
