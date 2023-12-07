import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCall } from '../../API/index.js';
import { setLoginLoading, setSignupLoading } from '../slice/authSlice.js';
import { URL } from '../../API/constant.js';

export const handleLogin = createAsyncThunk(
  'authPage/handleLogin',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setLoginLoading(true));
      console.log('🚀 ~ file: auth.js:12 ~ data:', data);
      const response = await postCall(URL.LOGIN, data);
      console.log('🚀 ~ file: auth.js:12 ~ response:', response);
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
