import { Button, CircularProgress, Grid, Stack } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHackathonGameQuery, useGetHackathonQuery } from '~/api/api';
import CollectablesChart from '~/components/charts/CollectablesChart';
import PlayersChart from '~/components/charts/PlayersChart';
import Breadcrumb from '~/components/common/Breadcrumb';
import { CommonContainer } from '~/components/common/CommonContainer';
import GameResultDataGrid from '~/components/dataGrids/GameResultDataGrid';
import GameDetails from '~/components/game/GameDetails';
import GamePlayback from '~/components/game/GamePlayback';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { ContainerRole } from '~/enums/ContainerRole';
import { colours } from '~/theme';
import { getGameTitle } from '~/utils/game-utils';

const GameViewer = () => {
  const { gameId, id } = useParams();
  const [gameState, setGameState] = useState<ParsedGameState>();
  const [isAvailableGamesShown, setIsAvailableGamesShown] = useState(false);

  const { data: hackathon, isLoading, isError } = useGetHackathonQuery(id!);

  const {
    data: hackathonGameData,
    isLoading: isGameLoading,
    isError: isGameError,
  } = useGetHackathonGameQuery(gameId!);

  const loadedDataSuccessfully =
    hackathon && hackathonGameData && !isError && !isGameError;

  const gameTitle =
    hackathonGameData && getGameTitle(hackathonGameData.game.teams);

  return (
    <>
      <CommonContainer containerRole={ContainerRole.DASHBOARD}>
        <Grid container spacing={2}>
          {!loadedDataSuccessfully && (
            <>
              {isGameLoading || (isLoading && <CircularProgress />)}
              {isError ||
                (isGameError && (
                  <p style={{ color: colours.errorRed }}>
                    Failed to fetch data. Please try again later.
                  </p>
                ))}
            </>
          )}

          {loadedDataSuccessfully && (
            <>
              <Grid container item xs={12}>
                <Grid item xs={10}>
                  <Breadcrumb
                    breadcrumbLevel={BreadcrumbLevel.GAME}
                    hackathon={hackathon}
                    gameTitle={gameTitle}
                  />
                </Grid>
                <Grid item xs={2} container justifyContent='flex-end'>
                  <Button
                    variant='outlined'
                    onClick={() =>
                      setIsAvailableGamesShown(!isAvailableGamesShown)
                    }
                  >
                    Available Games
                  </Button>
                </Grid>
              </Grid>

              {isAvailableGamesShown && id && (
                <Grid container item xs={12}>
                  <GameResultDataGrid hackathonId={id} customHeight={350} />
                </Grid>
              )}

              <Stack
                direction='row'
                alignItems='flex-end'
                justifyContent='center'
                spacing={1}
                sx={{ mt: 2 }}
              >
                {hackathonGameData && (
                  <Stack direction='column' spacing={1}>
                    <GameDetails game={hackathonGameData.game} />
                    <GamePlayback
                      gameResult={hackathonGameData}
                      height={hackathonGameData.game.map.height}
                      width={hackathonGameData.game.map.width}
                      setGameState={setGameState}
                    />
                  </Stack>
                )}
                <CollectablesChart
                  collectablesCount={gameState?.collectables?.length ?? 0}
                />
              </Stack>

              <Stack
                direction='row'
                sx={{ height: '200px', mt: 2, width: '100%' }}
              >
                {gameState && (
                  <PlayersChart
                    gameState={gameState}
                    teamData={hackathonGameData.game.teams}
                  />
                )}
              </Stack>
            </>
          )}
        </Grid>
      </CommonContainer>
    </>
  );
};

export default GameViewer;
