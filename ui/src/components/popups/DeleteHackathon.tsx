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
import { useDeleteHackathonMutation } from '../../api/api';
import { useAppDispatch } from '../../hooks';
import { PopupProps } from '../../interfaces/PopupProps';
import { setSnackbarState } from '../../slices/snackbarSlice';

const DeleteHackathon = ({ isOpen, id, setIsOpen }: PopupProps) => {
  const dispatch = useAppDispatch();

  const [deleteHackathon, { isLoading: isDeleting }] =
    useDeleteHackathonMutation();

  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleClose = () => {
    setFormError(undefined);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setFormError(undefined);

    deleteHackathon(id!)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Hackathon deleted successfully!',
          })
        );
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
  };

  return (
    <>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={{ width: 500 }}>
          <Typography sx={{ m: 1, mx: 'auto' }} role="dialogHeading">
            Are you sure you want to delete the hackathon?
          </Typography>
          <Typography
            sx={{ fontWeight: 'normal', m: 1, mx: 'auto' }}
            role="dialogHeading"
          >
            This will delete teams and games in the hackathon as well. You{' '}
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
