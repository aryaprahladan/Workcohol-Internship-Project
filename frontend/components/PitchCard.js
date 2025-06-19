import { Card, CardContent, Typography, Button, CardActions, Chip } from '@mui/material';
import Link from 'next/link';

export default function PitchCard({ pitch }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {pitch.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {pitch.description.substring(0, 150)}...
        </Typography>
        <div style={{ marginTop: '10px' }}>
          <Chip label={`$${pitch.funding_goal}`} size="small" sx={{ mr: 1 }} />
          <Chip label={`${pitch.equity_offered}% equity`} size="small" sx={{ mr: 1 }} />
          <Chip label={pitch.industry} size="small" />
        </div>
      </CardContent>
      <CardActions>
        <Link href={`/pitches/${pitch.id}`} passHref>
          <Button size="small">View Details</Button>
        </Link>
      </CardActions>
    </Card>
  );
}