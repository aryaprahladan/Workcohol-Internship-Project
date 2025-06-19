import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import PitchCard from '../../components/PitchCard';
import { Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import api from '../../utils/api';
import { isAuthenticated, getUserType } from '../../utils/auth';

export default function PitchesList() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          All Pitches
        </Typography>
        {isAuthenticated() && userType === 'founder' && (
          <Link href="/pitches/new" passHref>
            <Button variant="contained" color="primary">
              Create New Pitch
            </Button>
          </Link>
        )}
      </Box>

      {loading ? (
        <Typography>Loading pitches...</Typography>
      ) : pitches.length === 0 ? (
        <Typography>No pitches found.</Typography>
      ) : (
        pitches.map((pitch) => <PitchCard key={pitch.id} pitch={pitch} />)
      )}
    </Layout>
  );
}