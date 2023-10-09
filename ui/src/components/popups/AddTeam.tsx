import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useCreateTeamMutation } from '../../api/api';
import { useAppDispatch } from '../../hooks';
import { CreateTeamRequest } from '../../interfaces/CreateTeamRequest';
import { PopupProps } from '../../interfaces/PopupProps';
import { setSnackbarState } from '../../slices/snackbarSlice';

const AddTeam = ({ isOpen, id, setIsOpen }: PopupProps) => {
  const dispatch = useAppDispatch();

  const [addTeam, { isLoading: isAdding }] = useCreateTeamMutation();

  const [formError, setFormError] = useState<string | undefined>(undefined);

  // Form data for Team:
  const [teamName, setTeamName] = useState<string>('');
  const [teamPassword, setTeamPassword] = useState<string>('');

  const handleClose = () => {
    clearForm();
    setFormError(undefined);
    setIsOpen(false);
  };

  const clearForm = () => {
    setTeamName('');
    setTeamPassword('');
    setFormError(undefined);
  };

  const handleAdd = () => {
    setFormError(undefined);

    const createTeamRequest: CreateTeamRequest = {
      hackathonId: id!,
      name: teamName.trim(),
      password: teamPassword.trim(),
    };

    addTeam(createTeamRequest)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Team added successfully!',
          })
        );
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };

        if (status === 400) {
          setFormError('Error adding team - bad request');
        } else {
          setFormError('Error adding team - internal server error');
        }
      });
  };

  return (
    <>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={{ width: 500 }}>
          <Typography sx={{ m: 1, mx: 'auto' }} role="dialogHeading">
            Add a new team
          </Typography>

          <TextField
            fullWidth
            label="Team name"
            sx={{ m: 1, mx: 'auto' }}
            value={teamName}
            variant="outlined"
            onChange={(e) => setTeamName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Team password"
            sx={{ m: 1, mx: 'auto' }}
            type="password"
            value={teamPassword}
            variant="outlined"
            onChange={(e) => setTeamPassword(e.target.value)}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              m: 1,
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>

            <Button
              disabled={!teamName.trim() || !teamPassword.trim()}
              onClick={handleAdd}
            >
              Add team
            </Button>
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

          {isAdding && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTeam;
