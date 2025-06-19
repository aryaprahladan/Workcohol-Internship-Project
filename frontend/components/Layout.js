import { Container, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { isAuthenticated, logout, getUserType } from '../utils/auth';

export default function Layout({ children }) {
  const authenticated = isAuthenticated();
  const userType = getUserType();

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Startup Pitch Platform
            </Link>
          </Typography>
          {authenticated ? (
            <>
              {userType === 'founder' && (
                <Link href="/pitches/new" passHref>
                  <Button color="inherit">Create Pitch</Button>
                </Link>
              )}
              <Link href="/pitches" passHref>
                <Button color="inherit">Browse Pitches</Button>
              </Link>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
    </>
  );
}