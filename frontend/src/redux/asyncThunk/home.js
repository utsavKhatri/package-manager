import { createAsyncThunk } from '@reduxjs/toolkit';
import { delCall, getCall, postCall, putCall } from '../../API';
import { URL } from '../../API/constant';
import {
  setCreatePackageLoading,
  setDashboardLoading,
  setDeletePackageLoading,
  setEditPackageLoading,
  setPackageLoading,
} from '../slice/homeSlice';
export const fetchPackages = createAsyncThunk(
  'homePage/fetchPackages',
  async (_, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      dispatch(setPackageLoading(true));

      const page = getState().homePage.currentPage;
      const pageSize = getState().homePage.pageSize;

      const response = await getCall(
        `${URL.GET_PACKAGES}?page=${page}&pageSize=${pageSize}`,
        true
      );
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleCreatePackage = createAsyncThunk(
  'homePage/handleCreatePackage',
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setCreatePackageLoading(true));
      const response = await postCall(URL.ADD_PACKAGE, data, true);
      dispatch(fetchPackages());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleEditPackage = createAsyncThunk(
  'homePage/handleEditPackage',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setEditPackageLoading(true));
      const response = await putCall(`${URL.EDIT_PACKAGE}${id}`, data, true);
      dispatch(fetchPackages());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const handleDeletePackage = createAsyncThunk(
  'homePage/handleDeletePackage',
  async (id, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setDeletePackageLoading(true));
      const response = await delCall(`${URL.DELETE_PACKAGE}${id}`, true);
      dispatch(fetchPackages());
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
export const fetchDashboard = createAsyncThunk(
  'homePage/fetchDashboard',
  async (_, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      dispatch(setDashboardLoading(true));
      const response = await getCall(URL.DASHBOARD, true);
      return fulfillWithValue(response);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error occurred');
    }
  }
);
