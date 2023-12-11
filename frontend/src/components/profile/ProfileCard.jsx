import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import EditUser from '../users/EditUser';
import ChangePassword from './ChangePassword';

export default function ProfileCard({
  name,
  email,
  lastLoginAt,
  isAdmin,
  selfRegister,
  id,
}) {
  return (
    <Card
      orientation="horizontal"
      sx={{
        flex: 1,
        width: '100%',
        maxWidth: {
          xs: 'full',
          md: 450,
        },
        marginInline: 'auto',
        flexWrap: 'wrap',
        [`& > *`]: {
          '--stack-point': '500px',
          minWidth:
            'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
        },
        overflow: 'auto',
      }}
    >
      <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
          srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography fontSize="xl" fontWeight="lg">
              {name}
            </Typography>
            <Typography
              level="body-sm"
              fontWeight="lg"
              textColor="text.tertiary"
            >
              {email}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: {
                xs: 'space-between',
                sm: 'flex-end',
              },
              gap: 2,
            }}
          >
            <Box>
              <EditUser
                userData={{ name, email, _id: id, isAdmin }}
                updateProfile={true}
              />
            </Box>
            <Box>
              <ChangePassword />
            </Box>
          </Box>
        </Box>
        <Sheet
          sx={{
            bgcolor: 'background.level1',
            borderRadius: 'sm',
            p: 1.5,
            my: 1.5,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 2,
            '& > div': { flex: 1 },
          }}
        >
          <div>
            <Typography level="body-xs" fontWeight="lg">
              Role
            </Typography>
            <Typography fontWeight="lg">
              {isAdmin ? 'Admin' : 'Business User'}
            </Typography>
          </div>
          <div>
            <Typography level="body-xs" fontWeight="lg">
              Registration Type
            </Typography>
            <Typography fontWeight="lg">
              {selfRegister ? 'Self Register' : 'Admin Invited'}
            </Typography>
          </div>
          <div>
            <Typography level="body-xs" fontWeight="lg">
              Last login
            </Typography>
            <Typography fontWeight="lg">
              {new Date(lastLoginAt).toLocaleDateString()}
            </Typography>
          </div>
        </Sheet>
      </CardContent>
    </Card>
  );
}
