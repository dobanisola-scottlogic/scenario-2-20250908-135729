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
} from '../../api/api';
import { useAppDispatch } from '../../hooks';
import { PopupProps } from '../../interfaces/PopupProps';
import { setSnackbarState } from '../../slices/snackbarSlice';

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

  const handleSubmit = () => {
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
        <DialogContent sx={{ width: 500 }}>
          <Typography sx={{ m: 1, mx: 'auto' }} role="dialogHeading">
            {isEditing ? 'Edit hackathon' : 'Add a new hackathon'}
          </Typography>

          <TextField
            disabled={isEditing}
            fullWidth
            sx={{ m: 1, mx: 'auto' }}
            id="outlined-basic"
            label="Hackathon name"
            variant="outlined"
            value={hackathonName}
            onChange={(e) => setHackathonName(e.target.value)}
          />

          <FormControl sx={{ m: 1, mx: 'auto' }} fullWidth>
            <InputLabel id="current-milestone-bot-label">
              Current milestone bot
            </InputLabel>
            <Select
              data-testid="current-milestone-bot"
              disabled={!isEditing}
              labelId="current-milestone-bot-select-label"
              id="current-milestone-bot"
              label="Current milestone bot"
              value={milestoneBotName}
              onChange={(event) => setMilestoneBotName(event.target.value)}
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

          {/* Hardcoded options should be removed in future when HAC-100 and HAC-101 are implemented */}
          <FormControl sx={{ m: 1, mx: 'auto' }} fullWidth>
            <InputLabel id="demo-simple-select-label">
              Current milestone map
            </InputLabel>
            <Select
              data-testid="current-milestone-map"
              disabled={!isEditing}
              labelId="current-milestone-map-label"
              id="current-milestone-map"
              label="Current milestone map"
              value={milestoneMapName}
              onChange={(event) => setMilestoneMapName(event.target.value)}
            >
              <MenuItem value="VeryEasy">Very Easy</MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="LargeMedium">Large Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
              <MenuItem value="ThreeStar">Three Star</MenuItem>
              <MenuItem value="ThreeStraight">Three Straight</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              m: 1,
            }}
          >
            <Button onClick={handleClose}>CANCEL</Button>
            <Button
              disabled={!hackathonName.trim() || isLoading}
              onClick={handleSubmit}
            >
              {isEditing ? 'UPDATE HACKATHON' : 'ADD A NEW HACKATHON'}
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

          {isEditing && !isFetching && !hackathon && (
            <Alert
              severity="error"
              sx={{
                my: 2,
                mr: 1,
              }}
            >
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
