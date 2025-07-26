import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Gavel as GavelIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation as useLocationContext } from '../../contexts/LocationContext';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { address } = useLocationContext();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Sourcing Hub', icon: <StoreIcon />, path: '/sourcing' },
    { text: 'Group Buys', icon: <ShoppingCartIcon />, path: '/groupbuys' },
    { text: 'Bidding', icon: <GavelIcon />, path: '/bidding' },
    { text: 'Orders', icon: <ReceiptIcon />, path: '/orders' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Modern App Bar */}
      <AppBar 
        position="fixed" 
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(120deg, #2A6E9A 0%, #A7D8F0 100%)',
          boxShadow: '0 8px 32px -4px rgba(42,110,154,0.18)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(167,216,240,0.18)',
          transition: 'background 0.4s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              fontSize: '2rem',
              letterSpacing: 1,
              background: 'linear-gradient(90deg, #A7D8F0 0%, #2A6E9A 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 12px #A7D8F0',
              filter: 'drop-shadow(0 2px 8px #2A6E9A22)',
              transition: 'font-size 0.2s',
              cursor: 'pointer',
              userSelect: 'none',
              '&:hover': {
                opacity: 0.85,
                textShadow: '0 4px 16px #A7D8F0',
              },
            }}
          >
            Haat B2B
          </Typography>

          {/* Location Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.25)',
              boxShadow: '0 2px 8px rgba(42,110,154,0.08)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
              minWidth: 120,
              transition: 'background 0.3s',
            }}
          >
            <LocationIcon sx={{ mr: 1, fontSize: 18, color: '#2A6E9A' }} />
            <Typography
              variant="body2"
              sx={{
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 600,
                color: '#2A6E9A',
                letterSpacing: 0.5,
              }}
            >
              {address?.area || 'Set Location'}
            </Typography>
          </Box>

          {/* Notifications */}
          <IconButton
            color="inherit"
            sx={{
              mr: 1,
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(42,110,154,0.08)',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                background: 'rgba(255,255,255,0.32)',
              },
              transition: 'background 0.3s',
            }}
          >
            <Badge
              badgeContent={3}
              sx={{
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #A7D8F0 0%, #2A6E9A 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px #A7D8F044',
                },
              }}
            >
              <NotificationsIcon sx={{ color: '#2A6E9A' }} />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'linear-gradient(135deg, #A7D8F0 0%, #2A6E9A 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              border: '2.5px solid rgba(167,216,240,0.22)',
              boxShadow: '0 2px 8px #2A6E9A22',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.08)',
                boxShadow: '0 8px 24px #A7D8F044',
              },
            }}
            onClick={() => navigate('/profile')}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleMenuClick(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          pb: 2,
          px: 2,
          background: 'linear-gradient(120deg, #E5F3FF 0%, #A7D8F0 100%)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
