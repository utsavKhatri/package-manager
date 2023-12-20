import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/asyncThunk/profile';
import { Box } from '@mui/material';

import Loader from '../components/common/Loader';
import Navbar from '../components/common/Navbar';

const ProfileCard = lazy(() => import('../components/profile/ProfileCard'));
const ProfilePlanCard = lazy(() =>
  import('../components/profile/ProfilePlanCard')
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profileLoading, profileData } = useSelector(
    (state) => state.profilePage
  );
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <Navbar>
      <Suspense fallback={<Loader />}>
        {profileLoading ? (
          <Loader diff />
        ) : profileData ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              my: 5,
              mx: {
                xs: 1,
                sm: 4,
              },
              flexDirection: 'column',
            }}
          >
            <ProfileCard
              key={'profile-card'}
              email={profileData.email}
              name={profileData.name}
              isAdmin={profileData.isAdmin}
              lastLoginAt={profileData.lastLoginAt}
              selfRegister={profileData.selfRegister}
              id={profileData._id}
            />
            {profileData?.package && (
              <ProfilePlanCard
                duration={profileData?.package?.package?.duration}
                name={profileData?.package?.package?.name}
                id={profileData?.package?.package?._id}
                price={profileData?.package?.package?.price}
                enrolledAt={profileData?.package?.enrolledAt}
                expiredAt={profileData?.package?.expiredAt}
                key={'plan-card-profile'}
              />
            )}
          </Box>
        ) : null}
      </Suspense>
    </Navbar>
  );
};

export default ProfilePage;
