import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Suspense, lazy, useEffect, useState } from 'react';
import Loader from './components/common/Loader.jsx';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import PrivateRoute from './API/PrivateRoute.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/Login.jsx'));
const SignUpPage = lazy(() => import('./pages/Signup.jsx'));
const Packages = lazy(() => import('./pages/Packages.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'));
const PayWallPage = lazy(() => import('./pages/PayWallPage.jsx'));

import './App.css';
import { useSelector } from 'react-redux';

const materialTheme = materialExtendTheme();

function App() {
  const [mounted, setMounted] = useState(false);
  const { role } = useSelector((state) => state.authPage);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  const allowedPaths = {
    businessUser: ['/', '/profile', '/update-package'],
    admin: ['/', '/users', '/profile', '/packages'],
    superAdmin: ['/', '/packages'],
  };
  return (
    <Suspense fallback={<Loader />}>
      <MaterialCssVarsProvider
        defaultMode="system"
        theme={{ [MATERIAL_THEME_ID]: materialTheme }}
      >
        <JoyCssVarsProvider defaultMode="system">
          <CssBaseline enableColorScheme />
          <Toaster position="top-center" reverseOrder={false} />
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <PrivateRoute allowedPaths={allowedPaths[role]} role={role} />
                }
              >
                <Route
                  path="/"
                  element={role !== 'admin' ? <UsersPage /> : <HomePage />}
                />
                <Route path="/packages" element={<Packages />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/update-package" element={<PayWallPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Routes>
          </BrowserRouter>
        </JoyCssVarsProvider>
      </MaterialCssVarsProvider>
    </Suspense>
  );
}

export default App;
