import { useState } from 'react';
import {
    Alert,
    Box,
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    TextField,
    Select,
    Typography,
    Button,
} from "@mui/material";
import { useCreateHackathonMutation, useGetMilestonesQuery } from "../../api/api";
import { colours } from '../../theme';

interface CreateHackathonProps {
    createHackathonOpen: boolean;
    setCreateHackathonOpen: (createHackathonOpen: boolean) => void;
};

const CreateHackathon = ({ createHackathonOpen, setCreateHackathonOpen }: CreateHackathonProps) => {
    const [createHackathon] = useCreateHackathonMutation();
    const { data: milestoneBots } = useGetMilestonesQuery();

    const [hackathonName, setHackathonName] = useState<string>('');
    const [milestoneMapName, setMilestoneMapName] = useState<string>('');
    const [milestoneBotName, setMilestoneBotName] = useState<string>('');
    const [numberOfTeamsAndUsers, setNumberOfTeamsAndUsers] = useState<string>('');
    
    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [createHackathonStatus, setCreateHackathonStatus] = useState<string | undefined>(undefined);

    const readableMilestoneBotClassName = (milestoneBotClassName: string) => milestoneBotClassName.replace("com.scottlogic.hackathon.bots.", ""); 

    const handleClose = () => {
      clearForm(); 
      setCreateHackathonOpen(false);
      setCreateHackathonStatus(undefined);
    }

    const clearForm = () => {
        setHackathonName('');
        setMilestoneMapName('');
        setMilestoneBotName('');
        setNumberOfTeamsAndUsers('');
        setFormError(undefined);
    }

    const submitForm = () => {
      setCreateHackathonStatus(undefined);
      createHackathon({ name: hackathonName })
          .unwrap().then(() => {
            setCreateHackathonStatus('Hackathon created successfully!');
            clearForm();
          }) // success handled by the `fulfilled` action creator
          .catch((createError: unknown) => {
            const { status, data } = createError as { status: number; data: { message: string } };
            setFormError(`Error creating hackathon: ${status} - ${data.message}`);
          });
      
    }
    
    return (
    <Dialog onClose={handleClose} open={createHackathonOpen}>

      {formError && (<Alert severity="error">{formError}</Alert>)}

      {createHackathonStatus && (<Alert severity="success">{createHackathonStatus}</Alert>)}

      <DialogContent sx={{ width: 500 }}>
        <Typography sx={{ fontSize: 'default', fontWeight: 'bold', m: 1 }} role="dialogHeading">
            Add a new hackathon
        </Typography>

        <TextField fullWidth sx={{ m: 1 }} id="outlined-basic" label="Hackathon name" variant="outlined" value={hackathonName} onChange={e => setHackathonName(e.target.value)} />

        <FormControl  sx={{ m: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Current milestone bot</InputLabel>
            <Select
              disabled
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Current milestone bot"
              value={milestoneBotName}
              onChange={(event) => setMilestoneBotName(event.target.value)}
            >
              {milestoneBots?.map((milestoneBot) => <MenuItem key={milestoneBot.id} value={milestoneBot.milestoneClassName}>{readableMilestoneBotClassName(milestoneBot.milestoneClassName)}</MenuItem> )}
            </Select>
        </FormControl>

        <FormControl  sx={{ m: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Current milestone map</InputLabel>
            <Select
              disabled
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Current milestone map"
              value={milestoneMapName}
              onChange={(event) => setMilestoneMapName(event.target.value)}
            >
                <MenuItem value='VeryEasy'>Very Easy</MenuItem>
                <MenuItem value='Easy'>Easy</MenuItem>
                <MenuItem value='Medium'>Medium</MenuItem>
                <MenuItem value='LargeMedium'>Large Medium</MenuItem>
                <MenuItem value='Hard'>Hard</MenuItem>
                <MenuItem value='ThreeStar'>Three Star</MenuItem>
                <MenuItem value='ThreeStraight'>Three Straight</MenuItem>
            </Select>
        </FormControl>

        <FormControl  sx={{ m: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Number of teams and users to create</InputLabel>
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
        
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          m: 1
        }}>
            <Button onClick={handleClose} sx={{color: colours.darkPurple }} variant="text">CANCEL</Button>
            <Button disabled={!hackathonName} onClick={submitForm} sx={{color: colours.darkPurple }} variant="text">ADD A NEW HACKATHON</Button>
        </Box>
      </DialogContent>
      </Dialog>
  );
}

export default CreateHackathon;
