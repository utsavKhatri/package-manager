import { createSlice } from '@reduxjs/toolkit';
import { hadnleLogout, handleLogin, handleSignup } from '../asyncThunk/auth';

const initialState = {
  isAuthenticated:
    JSON.parse(localStorage.getItem('user'))?.token !== null ? true : false,
  role: JSON.parse(localStorage.getItem('user'))?.role || '',
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
        Promise.all([
          (state.isAuthenticated = true),
          (state.role = action.payload.role),
          (state.loginLoading = false),
        ]);
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
      })
      .addCase(hadnleLogout.fulfilled, (state, action) => {
        localStorage.removeItem('user');
        state.isAuthenticated = false;
        state.role = '';
      });
  },
});

export const { setAuth, setRole, setLoginLoading, setSignupLoading } =
  authSlice.actions;

export default authSlice.reducer;
