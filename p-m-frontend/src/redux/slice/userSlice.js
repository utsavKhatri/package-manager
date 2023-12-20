import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  handleCreateUser,
  handleDeleteUser,
  handleEditUser,
} from '../asyncThunk/users';

const initialState = {
  users: [],
  currentPage: 1,
  totalPage: 1,
  totalCount: 0,
  pageSize: 10,
  usersLoading: false,
  deleteUserLoading: false,
  createUserLoading: false,
  editUserLoading: false,
};
export const userSlice = createSlice({
  name: 'userPage',
  initialState,
  reducers: {
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
    setUsersLoading: (state, action) => {
      state.usersLoading = action.payload;
    },
    setDeleteUserLoading: (state, action) => {
      state.deleteUserLoading = action.payload;
    },
    setCreateUserLoading: (state, action) => {
      state.createUserLoading = action.payload;
    },
    setEditUserLoading: (state, action) => {
      state.editUserLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.currentPage = action.payload.currentPage;
        state.totalPage = action.payload.totalPage;
        state.totalCount = action.payload.totalCount;
        state.pageSize = action.payload.pageSize;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
      })
      .addCase(handleCreateUser.fulfilled, (state, action) => {
        state.createUserLoading = false;
      })
      .addCase(handleCreateUser.rejected, (state, action) => {
        state.createUserLoading = false;
      })
      .addCase(handleEditUser.fulfilled, (state, action) => {
        state.editUserLoading = false;
      })
      .addCase(handleEditUser.rejected, (state, action) => {
        state.editUserLoading = false;
      })
      .addCase(handleDeleteUser.fulfilled, (state, action) => {
        state.deleteUserLoading = false;
      })
      .addCase(handleDeleteUser.rejected, (state, action) => {
        state.deleteUserLoading = false;
      });
  },
});

export const {
  setCreateUserLoading,
  setCurrentPage,
  setDeleteUserLoading,
  setEditUserLoading,
  setPageSize,
  setTotalCount,
  setTotalPage,
  setUsersLoading,
} = userSlice.actions;

export default userSlice.reducer;
