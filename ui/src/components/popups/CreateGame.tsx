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

import { useCreateGameMutation } from '~/api/api';
import MapSelect from '~/components/common/MapSelect';
import PlayerSelect from '~/components/common/PlayerSelect';
import { commonStyles, popupStyles } from '~/components/commonStyles';
import { useAppDispatch } from '~/hooks';
import { CreateGameRequest } from '~/interfaces/CreateGameRequest';
import { PopupProps } from '~/interfaces/PopupProps';
import { setSnackbarState } from '~/slices/snackbarSlice';

interface CreateGameProps extends PopupProps {
  hackathonId: string;
}

const CreateGame = ({ isOpen, hackathonId, setIsOpen }: CreateGameProps) => {
  const dispatch = useAppDispatch();

  const [createGame, { isLoading: isCreating }] = useCreateGameMutation();

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [mapName, setMapName] = useState<string>('');
  const [namePlayer1, setNamePlayer1] = useState<string>('');
  const [namePlayer2, setNamePlayer2] = useState<string>('');
  const [namePlayer3, setNamePlayer3] = useState<string>('');
  const [namePlayer4, setNamePlayer4] = useState<string>('');

  const handleClose = () => {
    clearForm();
    setIsOpen(false);
  };

  const clearForm = () => {
    setMapName('');
    setNamePlayer1('');
    setNamePlayer2('');
    setNamePlayer3('');
    setNamePlayer4('');
    setFormError(undefined);
  };

  const handleCreateGame = () => {
    setFormError(undefined);

    const createGameRequest: CreateGameRequest = {
      hackathonId: hackathonId,
      map: mapName,
      teams: [namePlayer1, namePlayer2, namePlayer3, namePlayer4].filter(
        Boolean
      ),
    };

    createGame(createGameRequest)
      .unwrap()
      .then(() => {
        dispatch(
          setSnackbarState({
            isOpen: true,
            message: 'Game created successfully!',
          })
        );
        handleClose();
      })
      .catch((createError: unknown) => {
        const { status } = createError as { status: number };

        if (status === 400) {
          setFormError('Error creating game - bad request');
        } else {
          setFormError('Error creating game - internal server error');
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormError(undefined);

    handleCreateGame();

    return false;
  };

  return (
    <>
      <Dialog onClose={handleClose} open={isOpen}>
        <DialogContent sx={popupStyles.dialogContentStyle}>
          <Typography sx={commonStyles.spacingStyle} role='dialogHeading'>
            Add a new game
          </Typography>

          <form onSubmit={handleSubmit}>
            <PlayerSelect
              hackathonId={hackathonId}
              includeTeams={true}
              isOptional={false}
              playerName={namePlayer1}
              playerNumber={1}
              setPlayerName={setNamePlayer1}
            />

            <PlayerSelect
              hackathonId={hackathonId}
              includeTeams={true}
              isOptional={false}
              playerName={namePlayer2}
              playerNumber={2}
              setPlayerName={setNamePlayer2}
            />

            <PlayerSelect
              hackathonId={hackathonId}
              includeTeams={true}
              isOptional={true}
              playerName={namePlayer3}
              playerNumber={3}
              setPlayerName={setNamePlayer3}
            />

            <PlayerSelect
              hackathonId={hackathonId}
              includeTeams={true}
              isOptional={true}
              playerName={namePlayer4}
              playerNumber={4}
              setPlayerName={setNamePlayer4}
            />

            <MapSelect
              labelText='Select map'
              mapName={mapName}
              setMapName={setMapName}
              required
            />

            <Box sx={popupStyles.popupBoxStyle}>
              <Button onClick={handleClose}>Cancel</Button>

              <Button
                disabled={
                  !mapName || !namePlayer1 || !namePlayer2 || isCreating
                }
                type='submit'
              >
                Add a new game
              </Button>
            </Box>
          </form>

          {formError && (
            <Alert severity='error' sx={commonStyles.alertStyle}>
              {formError}
            </Alert>
          )}

          {isCreating && <LinearProgress />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateGame;
