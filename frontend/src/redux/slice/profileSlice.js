import { createSlice } from '@reduxjs/toolkit';
import { fetchProfile, packageAssign } from '../asyncThunk/profile';

const initialState = {
  profileData: null,
  profileLoading: false,
  assignPackageLoading: false,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log('profile a', action.payload);
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
      });
  },
});

export const { setProfileData, setProfileLoading, setAssignPackageLoading } =
  profileSlice.actions;

export default profileSlice.reducer;
