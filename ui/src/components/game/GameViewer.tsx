import { Box, CircularProgress, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetHackathonGameQuery, useGetHackathonQuery } from '~/api/api';
import Breadcrumb from '~/components/common/Breadcrumb';
import { CommonContainer } from '~/components/common/CommonContainer';
import { viewerStyles } from '~/components/commonStyles';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { ContainerRole } from '~/enums/ContainerRole';
import { colours } from '~/theme';
import { getGameTitle } from '~/utils/game-utils';
import GameDetails from './GameDetails';

const GameViewer = () => {
  const { gameId, id } = useParams();

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
              <Breadcrumb
                breadcrumbLevel={BreadcrumbLevel.GAME}
                hackathon={hackathon}
                gameTitle={gameTitle}
              />

              <Grid item xs={12}>
                <Box sx={viewerStyles.commonBoxStyles}>
                  Game selection placeholder
                </Box>
              </Grid>

              <Grid container item xs={12} md={11} spacing={2}>
                <GameDetails />
                <Grid item xs={12}>
                  <Box
                    sx={{ ...viewerStyles.commonBoxStyles, height: '25rem' }}
                  >
                    Playback placeholder
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={viewerStyles.commonBoxStyles}>
                    Player count chart placeholder
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} md={1} direction='column'>
                <Box sx={{ ...viewerStyles.commonBoxStyles, height: '31rem' }}>
                  Collectables chart placeholder
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CommonContainer>
    </>
  );
};

export default GameViewer;
