import React, { useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../redux/asyncThunk/home';
import { Container, Grid, Typography } from '@mui/material';
import Loader from '../components/common/Loader';
import CustomCard from '../components/homepage/CustomCard';
import { Card, CardContent } from '@mui/joy';
import { currencyFormat } from '../utils';
import Most_cheap_pack from '../assets/most_cheap.jpeg';
import Most_exp_pack from '../assets/most_exp.jpeg';
import Most_exp_user from '../assets/most_exp_user.jpeg';
import Most_selling from '../assets/top_selling_pack.jpeg';

const TotalCountCard = ({ title, count, color }) => {
  return (
    <Card variant="soft" color={color}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h2">{count}</Typography>
        <Typography>{title}</Typography>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();

  const { dashboardLoading, dashboardData } = useSelector(
    (state) => state.homePage
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <Navbar>
      <Container>
        {dashboardLoading ? (
          <Loader diff />
        ) : dashboardData ? (
          <Grid container spacing={2} my={3}>
            <Grid item xs={12} md={6}>
              <TotalCountCard
                title={'Packages'}
                count={dashboardData?.totalCount.packages}
                color={'primary'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TotalCountCard
                title={'Users'}
                color={'warning'}
                count={dashboardData?.totalCount.users}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomCard
                image={Most_selling}
                type={'highestSellingPackage'}
                price={`name: ${dashboardData?.highestSellingPackage[0]?.packageDetails[0]?.name} count: ${dashboardData?.highestSellingPackage[0]?.count}`}
                name={`Price: ${currencyFormat(
                  dashboardData?.highestSellingPackage[0]?.packageDetails[0]
                    ?.price
                )}`}
                key={'highestSellingPackage-1'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomCard
                image={Most_exp_user}
                type={'mostExpensiveUser'}
                name={`User: ${dashboardData?.mostExpensiveUser?.name}`}
                price={`Price: ${currencyFormat(
                  dashboardData?.mostExpensiveUser?.package?.price
                )}`}
                key={'mostExpensiveUser-1'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomCard
                image={Most_cheap_pack}
                type={'cheapestPackage'}
                name={`Name: ${dashboardData?.cheapestPackage?.name}`}
                price={`Price: ${currencyFormat(
                  dashboardData?.cheapestPackage?.price
                )}`}
                key={'cheapestPackage-1'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomCard
                image={Most_exp_pack}
                type={'mostExpensivePackage'}
                name={`Name: ${dashboardData?.mostExpensivePackage?.name}`}
                price={`Price: ${currencyFormat(
                  dashboardData?.mostExpensivePackage?.price
                )}`}
                key={'mostExpensivePackage-1'}
              />
            </Grid>
          </Grid>
        ) : (
          <h1>No data found</h1>
        )}
      </Container>
    </Navbar>
  );
};

export default HomePage;
