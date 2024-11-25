import { store } from './Store';
import { Provider } from 'react-redux';
import { lightTheme } from './utils/Theme';
import * as ReactDOM from 'react-dom/client';
import ApplicationValidator from './ApplicationValidator';
import { CssBaseline, ThemeProvider } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <Provider store={store}>
      <ApplicationValidator />
    </Provider>
  </ThemeProvider>
);
