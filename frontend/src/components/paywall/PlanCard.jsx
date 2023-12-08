import * as React from 'react';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { currencyFormat } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { packageAssign } from '../../redux/asyncThunk/profile';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PlanCard({ name, price, duration, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { assignPackageLoading } = useSelector((state) => state.profilePage);

  const hadnlePackageAssign = async () => {
    try {
      const data = {
        userId: JSON.parse(localStorage.getItem('user'))?.id,
        packageId: id,
      };

      if (!data.userId) {
        return toast.error('Please login to continue');
      }

      return dispatch(packageAssign({ redirect: (e) => navigate(e), data }));
    } catch (error) {
      console.log(error);
    }
  };

  const chipText = (price) => {
    const thresholds = [
      { threshold: 500, label: 'Basic' },
      { threshold: 1000, label: 'Standard' },
      { threshold: 2000, label: 'Premium' },
    ];

    const selectedThreshold = thresholds.find(
      ({ threshold }) => price < threshold
    );
    return selectedThreshold ? selectedThreshold.label : 'Ultimate';
  };

  return (
    <Card
      size="lg"
      sx={{
        maxWidth: 500,
        marginInline: 'auto',
      }}
      variant="outlined"
    >
      <Chip size="sm" variant="outlined" color="neutral">
        {chipText(price)}
      </Chip>
      <Typography level="h2">{name}</Typography>
      <Divider inset="none" />
      <CardActions>
        <Typography level="title-lg" sx={{ mr: 'auto' }}>
          {currencyFormat(price)}
          <Typography fontSize="sm" textColor="text.tertiary">
            / {duration} Days
          </Typography>
        </Typography>
        <Button
          variant="soft"
          color="neutral"
          endDecorator={<KeyboardArrowRight />}
          disabled={assignPackageLoading}
          onClick={hadnlePackageAssign}
        >
          Start now
        </Button>
      </CardActions>
    </Card>
  );
}
