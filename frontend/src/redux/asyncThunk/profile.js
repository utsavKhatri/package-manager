import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setAssignPackageLoading,
  setProfileLoading,
} from '../slice/profileSlice';
import { getCall, postCall } from '../../API';
import { URL } from '../../API/constant';

export const fetchProfile = createAsyncThunk(
  'profilePage/fetchProfile',
  async (_, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      console.log(123123123);
      dispatch(setProfileLoading(true));
      const response = await getCall(URL.ME, true);
      console.log(response, 'asdsad');
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const packageAssign = createAsyncThunk(
  'profilePage/packageAssign',
  async (
    { redirect, data },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      dispatch(setAssignPackageLoading(true));
      const response = await postCall(URL.ASSIGN_PACKAGE, data, true);
      if (response?.url) {
        return (window.location.href = response.url);
      }
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
