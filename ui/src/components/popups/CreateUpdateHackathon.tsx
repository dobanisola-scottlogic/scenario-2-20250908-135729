import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useEffect, useState } from 'react';

import {
  useCreateHackathonMutation,
  useGetHackathonQuery,
  useGetMilestonesQuery,
  useUpdateHackathonMutation,
} from '~/api/api';
import MapSelect from '~/components/common/MapSelect';
import { commonStyles, popupStyles } from '~/components/commonStyles';
import { useAppDispatch } from '~/hooks';
import { PopupProps } from '~/interfaces/PopupProps';
import { setSnackbarState } from '~/slices/snackbarSlice';
import { isValidName } from './utils';

const CreateUpdateHackathon = ({ id, isOpen, setIsOpen }: PopupProps) => {
  const dispatch = useAppDispatch();

  const isEditing = Boolean(id);

  const {
    data: hackathon,
    isLoading: isFetching,
    error: fetchError,
  } = useGetHackathonQuery(id ?? skipToken);
  const { data: milestoneBots } = useGetMilestonesQuery();
  const [createHackathon, { isLoading: isCreating }] =
    useCreateHackathonMutation();
  const [updateHackathon, { isLoading: isUpdating }] =
    useUpdateHackathonMutation();

  const isLoading = isFetching || isCreating || isUpdating;

  // Form data for hackathon
  const [hackathonName, setHackathonName] = useState<string>('');
  const [milestoneMapName, setMilestoneMapName] = useState<string>('');
  const [milestoneBotName, setMilestoneBotName] = useState<string>('');

  const [formError, setFormError] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load data where passed into form
    if (hackathon) {
      const { currentMilestoneClassName, currentMilestoneMap, name } =
        hackathon;
      setHackathonName(name);
      setMilestoneMapName(currentMilestoneMap);
      setMilestoneBotName(currentMilestoneClassName);
    }
  }, [hackathon]);

  const hackathonNameShowError = () =>
    hackathonName.length > 0 && !isValidName(hackathonName);

  const handleClose = () => {
    if (!isEditing) {
      clearForm();
    }
    setIsOpen(false);
  };

  const clearForm = () => {
    setHackathonName('');
    setMilestoneMapName('');
    setMilestoneBotName('');
    setFormError(undefined);
  };

  const handleCreateHackathon = () => {
    createHackathon(hackathonName)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Hackathon created successfully!',
          })
        );
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };
        if (status === 400) {
          setFormError('Error creating hackathon - bad request');
        } else {
          setFormError('Error creating hackathon - internal server error');
        }
      });
  };

  const handleUpdateHackathon = () => {
    const updateHackathonRequest = {
      id: id!,
      milestoneMap: milestoneMapName,
      milestoneClassName: milestoneBotName,
    };

    updateHackathon(updateHackathonRequest)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Hackathon updated successfully!',
          })
        );
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };
        if (status === 400) {
          setFormError('Error updating hackathon - bad request');
        } else {
          setFormError('Error updating hackathon - internal server error');
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError(undefined);

    if (isEditing) {
      handleUpdateHackathon();
    } else {
      handleCreateHackathon();
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={popupStyles.dialogContentStyle}>
          <Typography sx={commonStyles.spacingStyle} role='dialogHeading'>
            {isEditing ? 'Edit hackathon' : 'Add a new hackathon'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              disabled={isEditing}
              error={hackathonNameShowError()}
              helperText={
                hackathonNameShowError()
                  ? 'Hackathon name must not be empty or include special characters'
                  : null
              }
              fullWidth
              sx={commonStyles.spacingStyle}
              id='outlined-basic'
              label='Hackathon name'
              required
              variant='outlined'
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
            />

            {/* TODO on HAC-98: bot and map dropdowns should be reimplemented on the create hackathon popup when server functionality has been added on HAC-97 */}
            {isEditing && (
              <>
                <FormControl fullWidth required sx={commonStyles.spacingStyle}>
                  <InputLabel id='current-milestone-bot-label'>
                    Current milestone bot
                  </InputLabel>
                  <Select
                    data-testid='current-milestone-bot'
                    disabled={!isEditing}
                    labelId='current-milestone-bot-select-label'
                    id='current-milestone-bot'
                    label='Current milestone bot'
                    value={milestoneBotName}
                    onChange={(event) =>
                      setMilestoneBotName(event.target.value)
                    }
                  >
                    {milestoneBots?.map((milestoneBot, index) => (
                      <MenuItem
                        data-testid={`current-milestone-bot-option-${index}`}
                        key={milestoneBot.id}
                        value={milestoneBot.milestoneClassName}
                      >
                        {milestoneBot.readableMilestoneClassName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <MapSelect
                  labelText={'Current milestone map'}
                  mapName={milestoneMapName}
                  required
                  setMapName={setMilestoneMapName}
                />
              </>
            )}
            <Box sx={popupStyles.popupBoxStyle}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                disabled={isLoading || !isValidName(hackathonName)}
                type='submit'
              >
                {isEditing ? 'Update hackathon' : 'Add a new hackathon'}
              </Button>
            </Box>
          </form>

          {formError && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
              {formError}
            </Alert>
          )}

          {isEditing && !isFetching && !hackathon && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
              {fetchError
                ? 'Error fetching hackathon'
                : 'No hackathon data found'}
            </Alert>
          )}

          {isLoading && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateUpdateHackathon;
