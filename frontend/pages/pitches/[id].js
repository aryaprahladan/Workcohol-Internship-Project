import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Typography, Button, Box, Card, CardContent, Chip, TextField } from '@mui/material';
import Layout from '../../../components/Layout';
import api from '../../../utils/api';
import { isAuthenticated, getUserType } from '../../../utils/auth';

export default function PitchDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const userType = getUserType();

  useEffect(() => {
    if (!id) return;

    const fetchPitch = async () => {
      try {
        const response = await api.get(`/pitches/${id}/`);
        setPitch(response.data);
      } catch (err) {
        console.error('Error fetching pitch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPitch();
  }, [id]);

  const handleInvest = async () => {
    if (!investmentAmount) {
      setError('Please enter an investment amount');
      return;
    }

    try {
      await api.post(`/pitches/${id}/invest/`, {
        amount: investmentAmount,
        message,
      });
      router.push('/pitches');
    } catch (err) {
      setError('Failed to submit investment. Please try again.');
      console.error('Investment error:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Typography>Loading...</Typography>
      </Layout>
    );
  }

  if (!pitch) {
    return (
      <Layout>
        <Typography>Pitch not found</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {pitch.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={`$${pitch.funding_goal}`} />
            <Chip label={`${pitch.equity_offered}% equity`} />
            <Chip label={pitch.industry} />
            <Chip label={pitch.status} color="primary" />
          </Box>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography paragraph>{pitch.description}</Typography>
          <Typography variant="h6" gutterBottom>
            Business Plan
          </Typography>
          <Typography paragraph>{pitch.business_plan}</Typography>
        </CardContent>
      </Card>

      {isAuthenticated() && userType === 'investor' && pitch.status === 'submitted' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Interested in Investing?
          </Typography>
          {error && (
            <Typography color="error" paragraph>
              {error}
            </Typography>
          )}
          <TextField
            label="Investment Amount ($)"
            type="number"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message (Optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleInvest}
            sx={{ mt: 2 }}
          >
            Submit Investment Interest
          </Button>
        </Box>
      )}
    </Layout>
  );
}