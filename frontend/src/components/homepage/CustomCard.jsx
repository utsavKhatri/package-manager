import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

export default function CustomCard({ type, name, price, image }) {
  const colors = ['danger', 'neutral', 'primary', 'success', 'warning'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Card orientation="vertical" variant="outlined" sx={{ width: '100%' }}>
      <CardOverflow>
        <AspectRatio minHeight={50} maxHeight={150}>
          <img src={image} loading="lazy" alt={Math.random() + name + 'img'} />
        </AspectRatio>
      </CardOverflow>
      <CardContent>
        <Typography fontWeight="md" textColor="success.plainColor">
          {name}
        </Typography>
        <Typography level="body-sm">{price}</Typography>
      </CardContent>
      <CardOverflow
        variant="soft"
        color={randomColor}
        sx={{
          px: 2,
          writingMode: 'horizontal-tb',
          textAlign: 'center',
          fontSize: 'xs',
          fontWeight: 'xl',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          borderTop: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {type}
      </CardOverflow>
    </Card>
  );
}
