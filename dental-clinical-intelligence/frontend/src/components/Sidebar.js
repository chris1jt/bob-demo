import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pacientes', icon: <PeopleIcon />, path: '/patients' },
  { text: 'Asistente IA', icon: <SmartToyIcon />, path: '/ai-assistant' },
  { text: 'Planes de Tratamiento', icon: <AssignmentIcon />, path: '/treatment-plans' },
];

function Sidebar({ open }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    borderLeft: '4px solid #1976d2',
                    '& .MuiListItemIcon-root': {
                      color: '#1976d2',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#1976d2',
                      fontWeight: 600,
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#546e7a' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: '#546e7a' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Configuración"
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;

// Made with Bob
