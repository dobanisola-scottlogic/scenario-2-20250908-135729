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
} from '~/api/api';
import PasswordTextField from '~/components/common/PasswordTextField';
import { commonStyles, popupStyles } from '~/components/commonStyles';
import { useAppDispatch } from '~/hooks';
import { CreateTeamRequest } from '~/interfaces/CreateTeamRequest';
import { PopupProps } from '~/interfaces/PopupProps';
import { Team } from '~/interfaces/Team';
import { setSnackbarState } from '~/slices/snackbarSlice';

import { isValidName } from './utils';

interface CreateUpdateTeamProps extends PopupProps {
  hackathonId: string;
}

export const teamNameErrorMsg =
  'Team name must not be empty, include special characters, be a prohibited name or include multiple spaces';

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

  const prohibitedTeamNames = ['admin'];

  const teamNameShowError = () =>
    teamName.length > 0 && !isValidName(teamName, prohibitedTeamNames);

  const handleClose = () => {
    if (!isEditing) {
      clearForm();
    }

    setFormError(undefined);
    setIsOpen(false);
  };

  const clearForm = () => {
    setTeamName('');
    setTeamPassword('');
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
        <DialogContent sx={popupStyles.dialogContentStyle}>
          <Typography sx={commonStyles.spacingStyle}>
            {isEditing ? 'Edit team' : 'Add a new team'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              autoComplete='username'
              error={teamNameShowError()}
              helperText={teamNameShowError() ? teamNameErrorMsg : null}
              fullWidth
              inputProps={{ maxLength: 255 }}
              label='Name'
              required
              sx={commonStyles.spacingStyle}
              value={teamName}
              variant='outlined'
              onChange={(e) => setTeamName(e.target.value)}
            />

            <PasswordTextField
              required
              value={teamPassword}
              onChange={(e) => setTeamPassword(e.target.value)}
            />

            <Box sx={popupStyles.popupBoxStyle}>
              <Button onClick={handleClose}>Cancel</Button>

              <Button
                disabled={
                  !teamPassword?.trim() ||
                  !isValidName(teamName, prohibitedTeamNames) ||
                  isLoading
                }
                type='submit'
              >
                {isEditing ? 'Update team' : 'Add team'}
              </Button>
            </Box>
          </form>

          {formError && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
              {formError}
            </Alert>
          )}

          {isEditing && !isFetching && fetchError && !teamName && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
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
