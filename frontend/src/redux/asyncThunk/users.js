import { createAsyncThunk } from '@reduxjs/toolkit';
import { delCall, getCall, postCall, putCall } from '../../API';
import {
  setCreateUserLoading,
  setDeleteUserLoading,
  setEditUserLoading,
  setUsersLoading,
} from '../slice/userSlice';
import { URL } from '../../API/constant';
export const fetchUsers = createAsyncThunk(
  'homePage/fetchUsers',
  async (_, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      dispatch(setUsersLoading(true));

      const page = getState().userPage.currentPage;
      const pageSize = getState().userPage.pageSize;

      const response = await getCall(
        `${URL.GET_USERS}?page=${page}&pageSize=${pageSize}`,
        true
      );
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleCreateUser = createAsyncThunk(
  'homePage/handleCreateUser',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setCreateUserLoading(true));
      const response = await postCall(URL.ADD_USER, data, true);
      dispatch(fetchUsers());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleEditUser = createAsyncThunk(
  'homePage/handleEditUser',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setEditUserLoading(true));
      const response = await putCall(`${URL.EDIT_USER}${id}`, data, true);
      dispatch(fetchUsers());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleDeleteUser = createAsyncThunk(
  'homePage/handleDeleteUser',
  async (id, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setDeleteUserLoading(true));
      const response = await delCall(`${URL.DELETE_USER}${id}`, true);
      dispatch(fetchUsers());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
