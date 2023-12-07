import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MULink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CustomBtn from '../components/Buttons/CustomBtn';
import { FormControlLabel, FormHelperText, Input, Switch } from '@mui/material';
import { handleValidation } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { handleSignup } from '../redux/asyncThunk/auth';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& input:-webkit-autofill': {
    WebkitBoxShadow:
      theme.palette.mode === 'dark'
        ? '0 0 0 100px #111111 inset'
        : '0 0 0 100px #fafafa inset',
    WebkitTextFillColor: theme.palette.text.primary,
    caretColor: theme.palette.primary.main,
    borderRadius: 'inherit',
    '&:focus': {
      borderColor: theme.palette.text.primary,
    },
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark' ? '#90f9b9' : '#0089fa',
  },
  '& input::selection': {
    backgroundColor: theme.palette.mode === 'dark' ? '#292929' : '#abd9ff',
  },
}));

const SignUpLink = styled(MULink)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.mode === 'dark' ? '#90f9b9' : '#0089fa',
  },
}));

const CustomContainer = styled(Box)(({ theme }) => ({
  marginTop: 8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#202127' : 'white',
  padding: '20px',
  borderRadius: '6px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? 'rgba(50, 50, 50, 0.3) 0px 13px 27px -5px, rgba(38, 40, 48, 0.25) 0px 8px 16px -8px'
      : 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.1) 0px 8px 16px -8px',
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow:
      theme.palette.mode === 'dark'
        ? 'rgba(32, 33, 39, 0.25) 0px 50px 100px -20px, #202127 0px 30px 60px -30px'
        : 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px',
  },
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isRegistered, signupLoading } = useSelector(
    (state) => state.authPage
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const isAdmin = formData.get('role') === 'on' ? true : false;
    const isValid = handleValidation({ name, email, password });

    if (!isValid) {
      return;
    }

    try {
      // console.log({ name, email, password, isAdmin });
      const response = await dispatch(handleSignup({ name, email, password, isAdmin }));
      
      console.log(response);

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CustomContainer>
        <Avatar sx={{ m: 1, backgroundColor: '#ff499e' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                autoComplete="given-name"
                name="name"
                required
                fullWidth
                id="fullName"
                label="Full Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                name="role"
                control={
                  <Android12Switch
                    defaultChecked
                    color="warning"
                    aria-label="role-switch"
                  />
                }
                label="Admin"
              />
            </Grid>
          </Grid>
          <CustomBtn
            type="submit"
            fullWidth
            size="medium"
            disabled={signupLoading}
            variant="contained"
          >
            Sign Up
          </CustomBtn>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <SignUpLink component={Link} to="/login" variant="body1">
                {'Already have an account? Sign in'}
              </SignUpLink>
            </Grid>
          </Grid>
        </Box>
      </CustomContainer>
    </Container>
  );
}
