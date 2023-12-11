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
import { handleEditPackage } from '../../redux/asyncThunk/home';
import { useState } from 'react';

export default function EditPackage({ packageData }) {
  const { _id, name, price, duration, status } = packageData;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { editPackageLoading } = useSelector((state) => state.homePage);

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
      const price = formData.get('price');
      const status = formData.get('status') === 'on';
      const duration = formData.get('duration');
      await dispatch(
        handleEditPackage({
          id: _id,
          data: {
            name,
            price,
            status,
            duration,
          },
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
        aria-describedby="edit-pack-btn"
        aria-label="edit-pack-btn"
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
          Update Package
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
              label="Package Name"
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
              label="Price"
              type="number"
              defaultValue={price}
              fullWidth
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              name="duration"
              label="Duration"
              type="number"
              defaultValue={duration}
              fullWidth
              required
              variant="outlined"
            />
            <FormControl margin="dense" fullWidth>
              <FormControlLabel
                name="status"
                control={
                  <Switch
                    defaultChecked={status}
                    color="warning"
                    aria-label="status-switch"
                  />
                }
                label="Status"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={editPackageLoading} autoFocus>
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
