import { createSlice } from '@reduxjs/toolkit';
import { handleLogin, handleSignup } from '../asyncThunk/auth';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  isAuthenticated: user?.token ? true : false,
  role: '',
  loginLoading: false,
  signupLoading: false,
  isRegistered: false,
};
export const authSlice = createSlice({
  name: 'authPage',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setLoginLoading: (state, action) => {
      state.loginLoading = action.payload;
    },
    setSignupLoading: (state, action) => {
      state.signupLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.fulfilled, (state, action) => {
        if(action.payload?.token) {
          localStorage.setItem('user', JSON.stringify(action.payload));
          state.isAuthenticated = true;
        }
        state.role = action.payload.role;
        state.loginLoading = false;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.role = '';
        state.loginLoading = false;
      })
      .addCase(handleSignup.fulfilled, (state, action) => {
        state.isRegistered = true;
        state.signupLoading = false;
      })
      .addCase(handleSignup.rejected, (state, action) => {
        state.isRegistered = false;
        state.signupLoading = false;
      });
  },
});

export const { setAuth, setRole, setLoginLoading, setSignupLoading } =
  authSlice.actions;

export default authSlice.reducer;
