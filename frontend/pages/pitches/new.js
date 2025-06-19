import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { isAuthenticated } from '../../utils/auth';

export default function NewPitch() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_plan: '',
    funding_goal: '',
    equity_offered: '',
    industry: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isAuthenticated()) {
    router.push('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/pitches/', formData);
      router.push('/pitches');
    } catch (err) {
      setError('Failed to create pitch. Please try again.');
      console.error('Pitch creation error:', err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Pitch
          </Typography>
          {error && (
            <Typography color="error" paragraph>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              label="Business Plan"
              name="business_plan"
              value={formData.business_plan}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
            />
            <TextField
              label="Funding Goal ($)"
              name="funding_goal"
              type="number"
              value={formData.funding_goal}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Equity Offered (%)"
              name="equity_offered"
              type="number"
              value={formData.equity_offered}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
            >
              Submit Pitch
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}