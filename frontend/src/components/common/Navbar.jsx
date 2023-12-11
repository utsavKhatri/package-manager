import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Stack, useMediaQuery } from '@mui/material';
import SideDrawer from './SideDrawer';
import { useColorScheme as useMaterialColorScheme } from '@mui/material/styles';
import { useColorScheme as useJoyColorScheme } from '@mui/joy/styles';
import { useDispatch, useSelector } from 'react-redux';
import { hadnleLogout } from '../../redux/asyncThunk/auth';
import { Logout } from '@mui/icons-material';

export default function Navbar({ children }) {
  const dispatch = useDispatch();
  const { mode, setMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  const { role } = useSelector((state) => state.authPage);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isToosmall = useMediaQuery('(max-width: 400px)');
  const handleThemeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
    setJoyMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SideDrawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {role === 'superAdmin'
              ? isMobile
                ? isToosmall ? 'Welcome' :'Welcome Super Admin'
                : 'Welcome Super Admin to Package Manager'
              : 'Package Manager'}
          </Typography>
          <div>
            <IconButton
              color="inherit"
              aria-label="toggle light/dark theme"
              onClick={handleThemeToggle}
              sx={{ ml: 'auto' }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <IconButton
              onClick={() => dispatch(hadnleLogout())}
              color="inherit"
              aria-label="logout"
            >
              <Logout />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Stack direction={'column'} width={'100%'} maxHeight={'100vh'}>
        {children}
      </Stack>
    </Box>
  );
}
