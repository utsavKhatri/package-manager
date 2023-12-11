import { Grid, Stack, Typography } from '@mui/material';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../redux/asyncThunk/home';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const PlanCard = lazy(() => import('../components/paywall/PlanCard'));

const PayWallPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { packages, packageLoading } = useSelector((state) => state.homePage);
  const [updateOnce, setUpdateOnce] = useState(false);
  const [packageId, setPackageId] = useState('');
  useEffect(() => {
    dispatch(fetchPackages());
    const searchParams = new URLSearchParams(location.search);
    const successMessage = searchParams.get('error');

    if (successMessage) {
      toast.error(successMessage, { duration: 5000 });
      searchParams.delete('error');
    }

    const selfUser = searchParams.get('self');
    const packageId = searchParams.get('packageId');
    if (selfUser && packageId) {
      setUpdateOnce(true);
      setPackageId(packageId);
    }
  }, [dispatch, location.search]);

  return packageLoading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Stack direction={'column'} padding={3}>
        <Typography
          variant="h4"
          textAlign={'center'}
          fontWeight={'bold'}
          mb={3}
        >
          {updateOnce
            ? 'Want to change your plan?'
            : 'Your Subscription is Expired'}
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
                packageId={packageId}
                profilePage={updateOnce}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Suspense>
  );
};

export default PayWallPage;
