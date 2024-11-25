import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  Skeleton,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import MenuActionBar from './MenuActionBar';
import { darkTheme, lightTheme } from '../../utils/Theme';
import { DarkModeRounded, LightModeOutlined, LogoutRounded, MenuOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../LandingPage/authSlice';
import { profileActions } from '../Profile/profileSlice';
import { useTheme } from '@emotion/react';

const Layout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const smScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up('sm'));
  const lgScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up('lg'));

  const { loading, profileDetails } = useSelector((state) => state.profile);

  const [openDrawer, setOpenDrawer] = useState(lgScreenSizeAndHigher ? true : false);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
    dispatch(profileActions.getFavItems({ limit: 10 }));
  };
  const handleDrawerClose = () => setOpenDrawer(false);

  const handleLogout = () => {
    dispatch(authActions.getLogout());
    localStorage.clear();
    window.location.href = '/';
  };

  const handleAppearance = () => {
    const draftData = { ...profileDetails, appearance: !profileDetails.appearance || false };
    dispatch(profileActions.updateProfileDetails({ draftData }));
  };

  useEffect(() => {
    dispatch(profileActions.getProfileDetails());
  }, []);

  if (loading) {
    return <Skeleton height="100vh" />;
  }

  return (
    <ThemeProvider theme={profileDetails.appearance ? darkTheme : lightTheme}>
      <CssBaseline />
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress color="inherit" />
          </Box>
        }
      >
        <AppBar elevation={0}>
          <Toolbar>
            <IconButton size="small" onClick={handleDrawerOpen}>
              <MenuOutlined fontSize="small" />
            </IconButton>
            <Typography variant="h6" color="text.secondary" sx={{ flexGrow: 1 }}>
              AssetAlert
            </Typography>
            <Stack direction="row" spacing="0.1rem">
              {!smScreenSizeAndHigher ? (
                <>
                  <IconButton size="small" onClick={handleAppearance}>
                    {profileDetails?.appearance ? (
                      <LightModeOutlined fontSize="small" />
                    ) : (
                      <DarkModeRounded fontSize="small" />
                    )}
                  </IconButton>
                  <IconButton size="small" onClick={handleLogout}>
                    <LogoutRounded fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton size="small" onClick={() => handleAppearance()}>
                    {profileDetails?.appearance ? (
                      <LightModeOutlined fontSize="small" />
                    ) : (
                      <DarkModeRounded fontSize="small" />
                    )}
                  </IconButton>
                  <Tooltip title="log out">
                    <IconButton size="small" onClick={handleLogout}>
                      <LogoutRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack sx={{ marginTop: '5rem', marginBottom: '1rem' }}>
          <MenuActionBar
            openDrawer={openDrawer}
            handleDrawerClose={handleDrawerClose}
            smScreenSizeAndHigher={smScreenSizeAndHigher}
            lgScreenSizeAndHigher={lgScreenSizeAndHigher}
          />
          <Stack flexGrow={1}>
            <Container maxWidth="md">
              <Outlet />
            </Container>
          </Stack>
        </Stack>
      </Suspense>
    </ThemeProvider>
  );
};

export default Layout;
