import {
    Box,
    CircularProgress
} from "@mui/material";

function Loader() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            m: 1
          }}>
          <CircularProgress />
        </Box>
  );
}

export default Loader;
