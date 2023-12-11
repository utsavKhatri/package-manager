import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setAssignPackageLoading,
  setChangePasswordLoading,
  setProfileLoading,
} from '../slice/profileSlice';
import { getCall, postCall } from '../../API';
import { URL } from '../../API/constant';

export const fetchProfile = createAsyncThunk(
  'profilePage/fetchProfile',
  async (_, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setProfileLoading(true));
      const response = await getCall(URL.ME, true);
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const packageAssign = createAsyncThunk(
  'profilePage/packageAssign',
  async (
    { data, profilePage },
    { rejectWithValue, fulfillWithValue, dispatch }
  ) => {
    try {
      dispatch(setAssignPackageLoading(true));
      const response = await postCall(URL.ASSIGN_PACKAGE, data, true);

      if (profilePage) {
        dispatch(fetchProfile());
      }

      if (response?.url) {
        return (window.location.href = response.url);
      }
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);

export const handleChangePassword = createAsyncThunk(
  'profilePage/handleChangePassword',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setChangePasswordLoading(true));
      const response = await postCall(URL.CHANGE_PASSWORD, data, true);

      dispatch(fetchProfile());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
