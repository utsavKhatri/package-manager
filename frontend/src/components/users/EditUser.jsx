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
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import IconButton from '@mui/material/IconButton';
import { FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import { handleEditUser } from '../../redux/asyncThunk/users';

export default function EditUser({ userData, updateProfile = false }) {
  const { _id, name, email, isAdmin } = userData;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { editUserLoading } = useSelector((state) => state.homePage);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const hadnleEditPackges = async (event) => {
    try {
      event.preventDefault();

      const formData = new FormData(event.target);
      const name = formData.get('name');
      const email = formData.get('email');
      const isAdmin = formData.get('isAdmin') === 'on';

      await dispatch(
        handleEditUser({
          id: _id,
          data: {
            name,
            email,
            isAdmin,
          },
          updateProfile,
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
      <IconButton
        aria-label="edit-trans-btn"
        role="button"
        onClick={() => handleClickOpen()}
      >
        <EditTwoToneIcon />
      </IconButton>

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
          Update {updateProfile ? 'Profile' : 'User'}
        </DialogTitle>
        <Box component={'form'} onSubmit={hadnleEditPackges} marginTop={0}>
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
              defaultValue={name}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              name="price"
              label="Email"
              type="email"
              defaultValue={email}
              fullWidth
              required
              variant="outlined"
            />
            <FormControl margin="dense" fullWidth>
              <FormControlLabel
                name="status"
                control={
                  <Switch
                    defaultChecked={isAdmin}
                    color="warning"
                    aria-label="isAdmin-switch"
                  />
                }
                label="Admin"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={editUserLoading} autoFocus>
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
