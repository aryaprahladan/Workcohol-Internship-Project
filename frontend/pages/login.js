import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import Layout from '../components/Layout';
import api from '../utils/api';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login/', formData);
      localStorage.setItem('token', response.data.key);
      router.push('/');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" paragraph>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
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
              Login
            </Button>
          </form>
          <Typography>
            Don't have an account?{' '}
            <Link href="/register" style={{ textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}