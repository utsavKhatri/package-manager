import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Suspense, useEffect, useState } from 'react';
import Loader from './components/common/Loader.jsx';
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import PrivateRoute from './API/PrivateRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/Login.jsx';
import SignUpPage from './pages/Signup.jsx';
import Packages from './pages/Packages.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import UsersPage from './pages/UsersPage.jsx';

import './App.css';
import PayWallPage from './pages/PayWallPage.jsx';

const materialTheme = materialExtendTheme();

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
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
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
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
