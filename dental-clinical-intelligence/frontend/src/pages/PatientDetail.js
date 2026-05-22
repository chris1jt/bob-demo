import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { patientAPI } from '../services/api';

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPatientDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getById(id);
      setPatient(response.data);
    } catch (err) {
      console.error('Error loading patient:', err);
      setError('Error al cargar información del paciente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPatientDetail();
  }, [loadPatientDetail]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
          Volver
        </Button>
        <Alert severity="error">{error || 'Paciente no encontrado'}</Alert>
      </Box>
    );
  }

  const patientData = patient.p || patient;

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patients')} sx={{ mb: 2 }}>
        Volver a Pacientes
      </Button>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
        Detalles del Paciente
      </Typography>

      <Grid container spacing={3}>
        {/* Patient Info */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Información Personal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Nombre</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {patientData.name || 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">ID Paciente</Typography>
                  <Typography variant="body1">{patientData.patientId || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Edad</Typography>
                  <Typography variant="body1">{patientData.age || 'N/A'} años</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Género</Typography>
                  <Typography variant="body1">{patientData.gender || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{patientData.email || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Teléfono</Typography>
                  <Typography variant="body1">{patientData.phone || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Estado</Typography>
                  <Chip 
                    label={patientData.status || 'Activo'} 
                    color="success" 
                    size="small" 
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Historial Médico
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Fecha de Registro</Typography>
                  <Typography variant="body1">
                    {patientData.registrationDate 
                      ? new Date(patientData.registrationDate).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Última Visita</Typography>
                  <Typography variant="body1">
                    {patientData.lastVisit 
                      ? new Date(patientData.lastVisit).toLocaleDateString('es-ES')
                      : 'N/A'}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Radiografías
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {patient.xrays?.length || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Tratamientos
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#0288d1', fontWeight: 600 }}>
                    {patient.treatments?.length || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* X-rays Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Radiografías Recientes
              </Typography>
              {!patient.xrays || patient.xrays.length === 0 ? (
                <Typography color="text.secondary">
                  No hay radiografías registradas
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {patient.xrays.slice(0, 4).map((xray, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: '#f5f7fa',
                          borderRadius: 1,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Radiografía #{index + 1}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {xray.xrayDate 
                            ? new Date(xray.xrayDate).toLocaleDateString('es-ES')
                            : 'Fecha no disponible'}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PatientDetail;

// Made with Bob
