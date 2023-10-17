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
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';

import {
  useCreateTeamMutation,
  useGetTeamQuery,
  useUpdateTeamMutation,
} from '../../api/api';
import { useAppDispatch } from '../../hooks';
import { CreateTeamRequest } from '../../interfaces/CreateTeamRequest';
import { PopupProps } from '../../interfaces/PopupProps';
import { Team } from '../../interfaces/Team';
import { setSnackbarState } from '../../slices/snackbarSlice';

interface CreateUpdateTeamProps extends PopupProps {
  hackathonId: string;
}

const CreateUpdateTeam = ({
  isOpen,
  id,
  hackathonId,
  setIsOpen,
}: CreateUpdateTeamProps) => {
  const dispatch = useAppDispatch();

  const isEditing = Boolean(id);

  const [teamName, setTeamName] = useState<string>('');
  const [teamPassword, setTeamPassword] = useState<string>('');
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const {
    data: team,
    isLoading: isFetching,
    error: fetchError,
  } = useGetTeamQuery(id && isOpen ? id : skipToken);

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

  const isLoading = isFetching || isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setTeamName(team?.name ?? '');
      setTeamPassword(team?.password ?? '');
    }
  }, [isOpen, team]);

  const handleClose = () => {
    if (!isEditing) {
      clearForm();
    }

    setIsOpen(false);
  };

  const clearForm = () => {
    setTeamName('');
    setTeamPassword('');
    setFormError(undefined);
  };

  const handleCreateTeam = () => {
    setFormError(undefined);

    const createTeamRequest: CreateTeamRequest = {
      hackathonId: hackathonId,
      name: teamName.trim(),
      password: teamPassword.trim(),
    };

    createTeam(createTeamRequest)
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

  const handleUpdateTeam = () => {
    setFormError(undefined);

    const updateTeamRequest: Team = {
      hackathonId: hackathonId,
      id: id!,
      name: teamName.trim(),
      password: teamPassword.trim(),
    };

    updateTeam(updateTeamRequest)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Team updated successfully!',
          })
        );
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };
        if (status === 400) {
          setFormError('Error updating team - bad request');
        } else {
          setFormError('Error updating team - internal server error');
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError(undefined);

    if (isEditing) {
      handleUpdateTeam();
    } else {
      handleCreateTeam();
    }

    return false;
  };

  return (
    <>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={{ width: 500 }}>
          <Typography sx={{ m: 1, mx: 'auto' }} role='dialogHeading'>
            {isEditing ? 'Edit team' : 'Add a new team'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              autoComplete='username'
              fullWidth
              label='Name'
              sx={{ m: 1, mx: 'auto' }}
              value={teamName}
              variant='outlined'
              onChange={(e) => setTeamName(e.target.value)}
            />

            <TextField
              autoComplete='current-password'
              fullWidth
              label='Password'
              sx={{ m: 1, mx: 'auto' }}
              value={teamPassword}
              variant='outlined'
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
                disabled={
                  !teamName?.trim() || !teamPassword?.trim() || isLoading
                }
                type='submit'
              >
                {isEditing ? 'Update team' : 'Add team'}
              </Button>
            </Box>
          </form>

          {formError && (
            <Alert
              severity='error'
              sx={{
                my: 2,
                mr: 1,
              }}
            >
              {formError}
            </Alert>
          )}

          {isEditing && !isFetching && fetchError && !teamName && (
            <Alert
              severity='error'
              sx={{
                my: 2,
                mr: 1,
              }}
            >
              Error fetching team
            </Alert>
          )}

          {(isCreating || isUpdating) && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateUpdateTeam;
