import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserLogin } from '../types';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<UserLogin>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 3,
            }}
          >
            <LoginIcon sx={{ fontSize: 40, marginRight: 2, color: 'primary.main' }} />
            <Typography component="h1" variant="h4" color="primary">
              Campus Recruit
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" gutterBottom>
            Sign In
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Welcome back! Please sign in to your account to continue.
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/register"
              fullWidth
              variant="outlined"
              startIcon={<RegisterIcon />}
              disabled={isLoading}
            >
              Create New Account
            </Button>
          </Box>

          {/* Demo Credentials */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, width: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admin: admin@campusrecruit.com / admin123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student: student@example.com / student123
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recruiter: recruiter@example.com / recruiter123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
