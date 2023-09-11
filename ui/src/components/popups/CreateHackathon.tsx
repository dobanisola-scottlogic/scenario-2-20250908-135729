import { useState } from 'react';
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
  TextField,
  Select,
  Typography,
  Snackbar
} from '@mui/material';
import {
  useCreateHackathonMutation,
  useGetMilestonesQuery,
} from '../../api/api';

interface CreateHackathonProps {
  createHackathonOpen: boolean;
  setCreateHackathonOpen: (createHackathonOpen: boolean) => void;
}

const CreateHackathon = ({
  createHackathonOpen,
  setCreateHackathonOpen,
}: CreateHackathonProps) => {
  const [createHackathon, { isLoading }] = useCreateHackathonMutation();
  const { data: milestoneBots } = useGetMilestonesQuery();

  const [hackathonName, setHackathonName] = useState<string>('');
  const [createdHackathonName, setCreatedHackathonName] = useState<string>('');
  const [milestoneMapName, setMilestoneMapName] = useState<string>('');
  const [milestoneBotName, setMilestoneBotName] = useState<string>('');
  const [numberOfTeamsAndUsers, setNumberOfTeamsAndUsers] =
    useState<string>('');

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);

  const handleCloseSnackbar = () => setShowSuccessSnackbar(false);

  const readableMilestoneBotClassName = (milestoneBotClassName: string) =>
    milestoneBotClassName.replace('com.scottlogic.hackathon.bots.', '');

  const handleClose = () => {
    clearForm();
    setCreateHackathonOpen(false);
  };

  const clearForm = () => {
    setHackathonName('');
    setMilestoneMapName('');
    setMilestoneBotName('');
    setNumberOfTeamsAndUsers('');
    setFormError(undefined);
  };

  const submitForm = () => {
    setFormError(undefined);
    setCreatedHackathonName('');

    createHackathon({ name: hackathonName })
      .unwrap()
      .then(() => {
        setCreatedHackathonName(hackathonName);
        setShowSuccessSnackbar(true);
        handleClose();
      }) // success handled by the `fulfilled` action creator
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };
        if (status === 400) {
          setFormError('Error creating hackathon - bad request');
        } else {
          setFormError('Error creating hackathon - internal server error');
        }
      });
  };

  return (
    <>
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        key={'top' + 'center'}
        open={showSuccessSnackbar}  
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {`Hackathon '${createdHackathonName}' created successfully!`}
        </Alert>
      </Snackbar>

      <Dialog onClose={handleClose} open={createHackathonOpen}>
        <DialogContent sx={{ width: 500 }}>
          <Typography
            sx={{ m: 1, mx: 'auto' }}
            role="dialogHeading"
          >
            Add a new hackathon
          </Typography>

          <TextField
            fullWidth
            sx={{ m: 1, mx: 'auto' }}
            id="outlined-basic"
            label="Hackathon name"
            variant="outlined"
            value={hackathonName}
            onChange={(e) => setHackathonName(e.target.value)}
          />

          <FormControl sx={{ m: 1, mx: 'auto' }} fullWidth>
            <InputLabel id="demo-simple-select-label">
              Current milestone bot
            </InputLabel>
            <Select
              disabled
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Current milestone bot"
              value={milestoneBotName}
              onChange={(event) => setMilestoneBotName(event.target.value)}
            >
              {milestoneBots?.map((milestoneBot) => (
                <MenuItem
                  key={milestoneBot.id}
                  value={milestoneBot.milestoneClassName}
                >
                  {readableMilestoneBotClassName(milestoneBot.milestoneClassName)}
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
              disabled
              labelId="demo-simple-select-label"
              id="demo-simple-select"
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

          <FormControl sx={{ m: 1, mx: 'auto' }} fullWidth>
            <InputLabel id="demo-simple-select-label">
              Number of teams and users to create
            </InputLabel>
            <Select
              disabled
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Number of teams and users to create"
              value={numberOfTeamsAndUsers}
              onChange={(event) => setNumberOfTeamsAndUsers(event.target.value)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
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
            <Button
              onClick={handleClose}
              variant="text"
            >
              CANCEL
            </Button>
            <Button
              disabled={!hackathonName.trim() || isLoading}
              onClick={submitForm}
              variant="text"
            >
              ADD A NEW HACKATHON
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

          {isLoading && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateHackathon;
