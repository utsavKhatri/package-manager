import React, { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../redux/asyncThunk/profile';
import Loader from '../components/common/Loader';
import { Box, Container } from '@mui/material';
import ProfileCard from '../components/profile/ProfileCard';
import PlanCard from '../components/paywall/PlanCard';
import ProfilePlanCard from '../components/profile/ProfilePlanCard';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profileLoading, profileData } = useSelector(
    (state) => state.profilePage
  );
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  console.log(profileData, 'profileData');

  return (
    <Navbar>
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
          />
          <ProfilePlanCard
            duration={profileData?.package?.package?.duration}
            name={profileData?.package?.package?.name}
            id={profileData?.package?.package?._id}
            price={profileData?.package?.package?.price}
            enrolledAt={profileData?.package?.enrolledAt}
            expiredAt={profileData?.package?.expiredAt}
            key={'plan-card-profile'}
          />
        </Box>
      ) : null}
    </Navbar>
  );
};

export default ProfilePage;
