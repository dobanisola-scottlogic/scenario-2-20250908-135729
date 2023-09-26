import { CssBaseline, ThemeProvider } from '@mui/material';
import Navbar from './components/navbar/Navbar';
import Routing from './routing/Routing';
import { theme } from './theme';

const App = () => (
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routing />
    </ThemeProvider>
  </>
);

export default App;
