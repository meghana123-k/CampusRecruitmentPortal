import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalStudents: 0,
    myJobs: 0,
    receivedApplications: 0,
    shortlistedCandidates: 0,
    availableJobs: 0,
    myApplications: 0,
    interviews: 0,
  });
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const res = await fetch('/api/dashboard'); // replace with your API endpoint
  //       const data = await res.json();
  //       setDashboardData(data);
  //     } catch (error) {
  //       console.error('Failed to fetch dashboard data', error);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/v1/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch');
        }
  
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
  
    fetchDashboardData();
  }, []);
  

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return 'Admin Dashboard';
      case UserRole.RECRUITER:
        return 'Recruiter Dashboard';
      case UserRole.STUDENT:
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Users</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Jobs</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Jobs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Applications</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Applications
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Students</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Students
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case UserRole.RECRUITER:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">My Jobs</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">{dashboardData.myJobs}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted Jobs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Applications</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">{dashboardData.receivedApplications}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Received Applications
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Candidates</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">{dashboardData.shortlistedCandidates}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shortlisted Candidates
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Quick Actions</Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="small"
                      onClick={() => navigate('/recruiter/post-job')}
                    >
                      Post New Job
                    </Button>

                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Manage your job postings and review applications from students.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case UserRole.STUDENT:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <WorkIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Available Jobs</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Positions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">My Applications</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applications Submitted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Interviews</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">0</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled Interviews
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Job Search</Typography>
                    <Button
                      variant="contained"
                      startIcon={<WorkIcon />}
                      size="small"
                      onClick={() => navigate('/student/jobs')}
                    >
                      Browse Jobs
                    </Button>

                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Explore available job opportunities and apply to positions that match your skills.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Recruitment Portal
          </Typography>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {getDashboardTitle()}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user?.firstName} {user?.lastName}!
          </Typography>
        </Box>

        {/* Dashboard Content */}
        {getDashboardContent()}
      </Container>
    </Box>
  );
};

export default DashboardPage;
