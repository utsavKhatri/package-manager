import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDashboard,
  fetchPackages,
  handleCreatePackage,
  handleDeletePackage,
  handleEditPackage,
} from '../asyncThunk/home';

const initialState = {
  activeTab: 'Home',
  packages: [],
  currentPage: 1,
  totalPage: 1,
  totalCount: 0,
  pageSize: 10,
  packageLoading: false,
  deletePackageLoading: false,
  createPackageLoading: false,
  editPackageLoading: false,
  dashboardLoading: false,
  dashboardData: null,
};
export const homeSlice = createSlice({
  name: 'homePage',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setPackageLoading: (state, action) => {
      state.packageLoading = action.payload;
    },
    setDeletePackageLoading: (state, action) => {
      state.deletePackageLoading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setCreatePackageLoading: (state, action) => {
      state.createPackageLoading = action.payload;
    },
    setEditPackageLoading: (state, action) => {
      state.editPackageLoading = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.dashboardLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.packageLoading = false;
        console.log(action.payload);
        state.currentPage = action.payload.currentPage;
        state.totalPage = action.payload.totalPage;
        state.totalCount = action.payload.totalCount;
        state.pageSize = action.payload.pageSize;
        state.packages = action.payload.packages;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.packageLoading = false;
      })
      .addCase(handleDeletePackage.fulfilled, (state, action) => {
        state.deletePackageLoading = false;
      })
      .addCase(handleDeletePackage.rejected, (state, action) => {
        state.deletePackageLoading = false;
      })
      .addCase(handleCreatePackage.fulfilled, (state, action) => {
        state.createPackageLoading = false;
      })
      .addCase(handleCreatePackage.rejected, (state, action) => {
        state.createPackageLoading = false;
      })
      .addCase(handleEditPackage.fulfilled, (state, action) => {
        state.editPackageLoading = false;
      })
      .addCase(handleEditPackage.rejected, (state, action) => {
        state.editPackageLoading = false;
      }).addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload;
      }).addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = null;
      })
  },
});

export const {
  setActiveTab,
  setPackageLoading,
  setDeletePackageLoading,
  setCurrentPage,
  setTotalPage,
  setTotalCount,
  setPageSize,
  setCreatePackageLoading,
  setEditPackageLoading,
  setDashboardLoading
} = homeSlice.actions;

export default homeSlice.reducer;
