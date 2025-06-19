import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Typography, Button } from '@mui/material';
import Link from 'next/link';
import { isAuthenticated, getUserType } from '../utils/auth';
import api from '../utils/api';

export default function Home() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const authenticated = isAuthenticated();
  const userType = getUserType();

  useEffect(() => {
    const fetchPitches = async () => {
      try {
        const response = await api.get('/pitches/');
        setPitches(response.data);
      } catch (error) {
        console.error('Error fetching pitches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPitches();
  }, []);

  return (
    <Layout>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Startup Pitch Platform
      </Typography>
      
      {authenticated && (
        <Typography variant="body1" paragraph>
          You are logged in as a {userType}.
        </Typography>
      )}

      {!authenticated && (
        <Typography variant="body1" paragraph>
          Connect with innovative startups or find investors for your business idea.
        </Typography>
      )}

      {authenticated && userType === 'founder' && (
        <Link href="/pitches/new" passHref>
          <Button variant="contained" color="primary" sx={{ mb: 3 }}>
            Create New Pitch
          </Button>
        </Link>
      )}

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        Featured Pitches
      </Typography>

      {loading ? (
        <Typography>Loading pitches...</Typography>
      ) : (
        pitches.slice(0, 3).map((pitch) => (
          <PitchCard key={pitch.id} pitch={pitch} />
        ))
      )}

      <Link href="/pitches" passHref>
        <Button variant="outlined" sx={{ mt: 2 }}>
          View All Pitches
        </Button>
      </Link>
    </Layout>
  );
}