import { createSlice } from '@reduxjs/toolkit';
import { fetchProfile, handleChangePassword, packageAssign } from '../asyncThunk/profile';

const initialState = {
  profileData: null,
  profileLoading: false,
  assignPackageLoading: false,
  changePasswordLoading: false,
};

export const profileSlice = createSlice({
  name: 'profilePage',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.profileLoading = action.payload;
    },
    setAssignPackageLoading: (state, action) => {
      state.assignPackageLoading = action.payload;
    },
    setChangePasswordLoading: (state, action) => {
      state.changePasswordLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
        state.profileLoading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileData = null;
      })
      .addCase(packageAssign.fulfilled, (state, action) => {
        state.assignPackageLoading = false;
      })
      .addCase(packageAssign.rejected, (state, action) => {
        state.assignPackageLoading = false;
      }).addCase(handleChangePassword.fulfilled, (state, action) => {
        state.changePasswordLoading = false;
      }).addCase(handleChangePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
      })
  },
});

export const { setProfileData, setProfileLoading, setAssignPackageLoading, setChangePasswordLoading } =
  profileSlice.actions;

export default profileSlice.reducer;
