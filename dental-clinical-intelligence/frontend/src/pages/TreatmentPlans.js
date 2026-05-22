import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

function TreatmentPlans() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
        Planes de Tratamiento
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              textAlign: 'center',
            }}
          >
            <ConstructionIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Funcionalidad en Desarrollo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              La sección de Planes de Tratamiento estará disponible próximamente.
              Aquí podrás gestionar y visualizar todos los planes de tratamiento de tus pacientes.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Próximamente:</strong> Gestión completa de planes de tratamiento, 
          seguimiento de procedimientos, y recomendaciones automáticas basadas en IA.
        </Typography>
      </Alert>
    </Box>
  );
}

export default TreatmentPlans;

// Made with Bob
