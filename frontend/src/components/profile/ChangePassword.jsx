import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { handleChangePassword } from '../../redux/asyncThunk/profile';

export default function ChangePassword() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { changePasswordLoading } = useSelector((state) => state.profilePage);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.target);
      const newPassword = formData.get('newPassword');
      const oldPassword = formData.get('oldPassword');

      if (newPassword !== oldPassword) {
        toast.error('New password and old password should be same');
        return;
      }

      if (newPassword.length < 8) {
        toast.error('Password should be at least 8 characters long');
        return;
      }

      await dispatch(
        handleChangePassword({
          oldPassword,
          newPassword,
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
      <Button
        aria-label="change-pass-btn"
        role="button"
        variant="outlined"
        onClick={() => handleClickOpen()}
      >
        Change Password
      </Button>

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
          Change Password
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
              name="oldPassword"
              label="Old Password"
              type="password"
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              name="newPassword"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={changePasswordLoading} autoFocus>
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
