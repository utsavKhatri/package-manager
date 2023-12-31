import { configureStore } from '@reduxjs/toolkit';
import homeSliceReducer from './slice/homeSlice';
import authSliceReducer from './slice/authSlice';
import userSliceReducer from './slice/userSlice';
import profileSliceReducer from './slice/profileSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
  reducer: {
    homePage: homeSliceReducer,
    authPage: authSliceReducer,
    userPage: userSliceReducer,
    profilePage: profileSliceReducer,
  },
});
