import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCall } from '../../API/index.js';
import {
  setAuth,
  setLoginLoading,
  setSignupLoading,
} from '../slice/authSlice.js';
import { URL } from '../../API/constant.js';
import { setActiveTab } from '../slice/homeSlice.js';

export const handleLogin = createAsyncThunk(
  'authPage/handleLogin',
  async (
    { redirect, data },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      dispatch(setLoginLoading(true));
      const response = await postCall(URL.LOGIN, data);
      if (response?.token) {
        localStorage.setItem('user', JSON.stringify(response));
        await dispatch(setAuth(true));

        if (response.role) {
          await redirect('/');
        }
      }
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleSignup = createAsyncThunk(
  'authPage/handleSignup',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setSignupLoading(true));
      const response = await postCall(URL.SIGNUP, data);
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const hadnleLogout = createAsyncThunk(
  'authPage/hadnleLogout',
  async (_, { fulfillWithValue, dispatch }) => {
    dispatch(setActiveTab('Home'));
    const response = await postCall(URL.LOGOUT, {}, true);
    return fulfillWithValue(response);
  }
);
