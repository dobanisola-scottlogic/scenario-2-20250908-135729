import { Box, Button, CircularProgress, Grid } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetHackathonGameQuery, useGetHackathonQuery } from '~/api/api';
import CollectablesChart from '~/components/charts/CollectablesChart';
import Breadcrumb from '~/components/common/Breadcrumb';
import { CommonContainer } from '~/components/common/CommonContainer';
import { viewerStyles } from '~/components/commonStyles';
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

              <Grid container item xs={12} md={11} spacing={2}>
                <GameDetails game={hackathonGameData.game} />
                <Grid item xs={12}>
                  {hackathonGameData && (
                    <GamePlayback
                      gameResult={hackathonGameData}
                      height={hackathonGameData.game.map.height}
                      width={hackathonGameData.game.map.width}
                      setGameState={setGameState}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={viewerStyles.commonBoxStyles}>
                    Player count chart placeholder
                    {/* <h1>
                      Phase={gameState?.phase} Players=
                      {gameState?.players?.length}
                    </h1>
                    {gameState?.teams.map((team, index) => (
                      <Chip
                        key={index}
                        sx={{
                          ...viewerStyles.chipStyles,
                          backgroundColor: getTeamColour(team.teamIndex),
                        }}
                        label={team.playerCount}
                      ></Chip>
                    ))} */}
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} md={1} direction='column'>
                <CollectablesChart
                  collectablesCount={gameState?.collectables?.length ?? 0}
                />
              </Grid>
            </>
          )}
        </Grid>
      </CommonContainer>
    </>
  );
};

export default GameViewer;
