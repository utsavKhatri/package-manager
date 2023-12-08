import * as React from 'react';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import { IconButton } from '@mui/joy';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../redux/slice/homeSlice';

const listItems = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Packages',
    link: '/packages',
  },
  {
    text: 'Users',
    link: '/users',
  },
  {
    text: 'Profile',
    link: '/profile',
  },
];

const userListItems = [
  {
    text: 'Users',
    link: '/users',
  },
  {
    text: 'Profile',
    link: '/profile',
  },
];

export default function SideDrawer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { activeTab } = useSelector((state) => state.homePage);
  const { role } = useSelector((state) => state.authPage);
  const handleTabClick = (text, link) => {
    navigate(link);
    dispatch(setActiveTab(text));
  };
  return (
    <React.Fragment>
      <IconButton
        aria-label="menu-drawer"
        sx={{
          mr: 2,
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'black' : '#135aa0',
          },
        }}
        onClick={() => setOpen(true)}
      >
        <MenuOpenIcon
          sx={{
            color: 'white',
          }}
        />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-content': {
            md: {
              borderRadius: '15px',
              margin: '20px',
              maxHeight: 'calc(100vh - 45px)',
            },
          },
          '--Drawer-transitionDuration': open ? '0.4s' : '0.2s',
          '--Drawer-transitionFunction': open
            ? 'cubic-bezier(0.79,0.14,0.15,0.86)'
            : 'cubic-bezier(0.77,0,0.18,1)',
        }}
      >
        <Box role="presentation" sx={{ p: 2 }}>
          <List>
            {(role === 'businessUser' ? userListItems : listItems).map(
              (text) => (
                <ListItem key={text.text + Math.random()}>
                  <ListItemButton
                    selected={activeTab === text.text}
                    sx={{
                      transition: 'padding 0.2s ease-out',
                      '&.Mui-selected': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? 'white' : '#1976D2',
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? 'black' : 'white',
                        paddingBlock: '8px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        transition: 'all 0.3s cubic-bezier(0.3, 0.07, 0, 1.09)',
                      },
                      '&:hover': {
                        borderRadius: '8px',
                        paddingBlock: '8px',
                        fontSize: '16px',
                      },
                    }}
                    onClick={() => handleTabClick(text.text, text.link)}
                  >
                    {text.text}
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
