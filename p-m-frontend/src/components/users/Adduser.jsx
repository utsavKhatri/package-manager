import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { FormControlLabel, Switch, styled } from '@mui/material';
import { useState } from 'react';
import { handleCreateUser } from '../../redux/asyncThunk/users';

const CustomAddAccBtn = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  backgroundColor: theme.palette.mode === 'dark' ? '#3ab1e8' : '#67c8f5',
  color: theme.palette.mode === 'dark' ? '#1c2e5e' : '#005b85',
  boxShadow:
    theme.palette.mode === 'light' &&
    'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',
  fontWeight: 'bold',
  padding: '7px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'white' : '#1682c9',
    color: theme.palette.mode === 'dark' ? 'black' : '#8adaff',
    boxShadow:
      theme.palette.mode === 'light'
        ? 'rgba(0, 91, 133, 0.1) 0px 4px 16px, rgba(0, 91, 133, 0.1) 0px 8px 24px, rgba(0, 91, 133, 0.1) 0px 16px 56px;'
        : 'rgba(255, 255, 255, 0.3) 0px 18px 50px -10px;',
  },
}));

export default function AddUser() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { createUserLoading } = useSelector((state) => state.homePage);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const isAdmin = formData.get('isAdmin') === 'on';

      await dispatch(
        handleCreateUser({
          name,
          email,
          isAdmin,
        })
      );

      setOpen(false);
    } catch (error) {
      toast.error(error.resonse.data.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CustomAddAccBtn
        aria-label="Add User"
        aria-describedby='add-user-btn'
        role="button"
        variant="contained"
        onClick={() => handleClickOpen()}
        sx={{
          width: {
            xs: '100%',
            sm: 'auto',
          },
        }}
      >
        Add User
      </CustomAddAccBtn>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        sx={{
          backdropFilter: 'blur(8px)',
          '& .MuiDialog-paper': {
            padding: 1,
            borderRadius: '10px',
            boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.1)',
          },
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" variant="h6">
          Add User
        </DialogTitle>
        <Box component={'form'} onSubmit={handleSubmit} marginTop={0}>
          <DialogContent
            sx={{
              paddingBlock: 0,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email"
              type="email"
              required
              fullWidth
              variant="outlined"
            />
            <FormControl margin="dense" fullWidth>
              <FormControlLabel
                name="isAdmin"
                control={
                  <Switch
                    defaultChecked
                    color="warning"
                    aria-label="isAdmin-switch"
                  />
                }
                label="Add as Admin"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={createUserLoading} autoFocus>
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
