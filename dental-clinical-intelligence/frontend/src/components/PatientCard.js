import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function PatientCard({ patient }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'success';
      case 'pending':
      case 'pendiente':
        return 'warning';
      case 'inactive':
      case 'inactivo':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: '#1976d2',
              width: 56,
              height: 56,
              mr: 2,
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {patient.name || 'Sin nombre'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {patient.patientId || 'N/A'}
            </Typography>
          </Box>
          <Chip
            label={patient.status || 'Activo'}
            color={getStatusColor(patient.status)}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {patient.age || 'N/A'} años
            </Typography>
          </Box>

          {patient.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary" noWrap>
                {patient.email}
              </Typography>
            </Box>
          )}

          {patient.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {patient.phone}
              </Typography>
            </Box>
          )}
        </Box>

        {patient.lastVisit && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary">
              Última visita: {new Date(patient.lastVisit).toLocaleDateString('es-ES')}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          size="small"
          variant="contained"
          fullWidth
          onClick={() => navigate(`/patients/${patient.patientId}`)}
        >
          Ver Detalles
        </Button>
      </CardActions>
    </Card>
  );
}

export default PatientCard;

// Made with Bob
