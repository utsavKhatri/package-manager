import {
  Container,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../redux/asyncThunk/home';
import Loader from '../components/common/Loader';
import PlanCard from '../components/paywall/PlanCard';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const PayWallPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { packages, packageLoading } = useSelector((state) => state.homePage);
  useEffect(() => {
    dispatch(fetchPackages());
    const searchParams = new URLSearchParams(location.search);
    const successMessage = searchParams.get('error');

    if (successMessage) {
      toast.error(successMessage, { duration: 5000 });
    }
  }, [dispatch, location.search]);

  return packageLoading ? (
    <Loader />
  ) : (
    <Stack direction={'column'} padding={3}>
      <Typography variant="h4" textAlign={'center'} fontWeight={'bold'} mb={3}>
        Your Subscription is Expired
      </Typography>
      <Typography variant="body2" textAlign={'center'} mb={3}>
        Select the plan that is right for you
      </Typography>
      <Grid container spacing={3} justifyContent={'center'}>
        {packages?.map((item) => (
          <Grid
            key={item._id}
            item
            xs={12}
            md={6}
            lg={4}
            justifyContent={'center'}
          >
            <PlanCard
              id={item._id}
              name={item.name}
              price={item.price}
              duration={item.duration}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default PayWallPage;
