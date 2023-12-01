import { Box, Grid } from '@mui/material';
import { viewerStyles } from '~/components/commonStyles';

const GameDetails = () => {
  return (
    <>
      <Grid item xs={12} md={2}>
        <Box sx={viewerStyles.commonBoxStyles}>Map details</Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Box sx={viewerStyles.commonBoxStyles}>
          Player details (p1 vs p2) placeholder
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <Box sx={viewerStyles.commonBoxStyles}>Date time details</Box>
      </Grid>
    </>
  );
};

export default GameDetails;
