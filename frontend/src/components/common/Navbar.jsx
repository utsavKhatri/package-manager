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
import { Stack } from '@mui/material';
import SideDrawer from './SideDrawer';
import { useColorScheme as useMaterialColorScheme } from '@mui/material/styles';
import { useColorScheme as useJoyColorScheme } from '@mui/joy/styles';
import { useDispatch } from 'react-redux';
import { hadnleLogout } from '../../redux/asyncThunk/auth';

export default function Navbar({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const { mode, setMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  const handleThemeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
    setJoyMode(mode === 'dark' ? 'light' : 'dark');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SideDrawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Package Manager
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
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={() => dispatch(hadnleLogout())}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Stack direction={'column'} width={'100%'} maxHeight={'100vh'}>
        {children}
      </Stack>
    </Box>
  );
}
