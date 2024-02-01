import { CircularProgress, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useGetHackathonQuery } from '~/api/api';
import Breadcrumb from '~/components/common/Breadcrumb';
import { CommonContainer } from '~/components/common/CommonContainer';
import SnackbarAlert from '~/components/common/SnackbarAlert';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { ContainerRole } from '~/enums/ContainerRole';
import { colours } from '~/theme';
import GameResultList from './lists/GameResultList';
import TeamList from './lists/TeamList';

const HackathonDetails = () => {
  const { id } = useParams();

  const {
    data: hackathon,
    isLoading,
    isError,
    error,
  } = useGetHackathonQuery(id!);

  const hasLoadedData = !isLoading && !isError && hackathon;

  return (
    <>
      <SnackbarAlert />

      <CommonContainer containerRole={ContainerRole.DASHBOARD}>
        <Grid container spacing={2}>
          {!hasLoadedData && (
            <Grid item xs={12}>
              <Typography
                sx={{
                  display: 'inline-flex',
                  fontWeight: 'normal',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={15} sx={{ ml: 1, mt: 0.5 }} />
                ) : isError &&
                  'originalStatus' in error &&
                  error.originalStatus === 404 ? (
                  <span style={{ color: colours.errorRed }}>
                    This hackathon does not exist. Please create a new
                    hackathon.
                  </span>
                ) : (
                  !hackathon && (
                    <span style={{ color: colours.errorRed }}>
                      Failed to fetch hackathon. Please try again later.
                    </span>
                  )
                )}
              </Typography>
            </Grid>
          )}

          {hasLoadedData && (
            <>
              <Breadcrumb
                breadcrumbLevel={BreadcrumbLevel.HACKATHON}
                hackathon={hackathon}
              />
              <Grid item xs={3}>
                <TeamList hackathonId={id!} />
              </Grid>
              <Grid item xs={9}>
                <GameResultList hackathonId={id!} />
              </Grid>
            </>
          )}
        </Grid>
      </CommonContainer>
    </>
  );
};

export default HackathonDetails;
