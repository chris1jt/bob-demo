import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { dashboardAPI } from '../services/api';

function StatCard({ title, value, icon, color = '#1976d2' }) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, color }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, patientsData, alertsData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentPatients(5),
        dashboardAPI.getAlerts(),
      ]);

      setStats(statsData.data?.overview || {});
      setRecentPatients(patientsData.data || []);
      setAlerts(alertsData.data || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Error al cargar el dashboard. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pacientes"
            value={stats?.totalPatients || 0}
            icon={<PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Radiografías"
            value={stats?.totalXrays || 0}
            icon={<AssessmentIcon sx={{ fontSize: 40, color: '#0288d1' }} />}
            color="#0288d1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Análisis Realizados"
            value={stats?.totalAnalyses || 0}
            icon={<TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50' }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tratamientos Activos"
            value={stats?.activeTreatments || 0}
            icon={<WarningIcon sx={{ fontSize: 40, color: '#ff9800' }} />}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Patients */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Pacientes Recientes
              </Typography>
              {recentPatients.length === 0 ? (
                <Typography color="text.secondary">
                  No hay pacientes recientes
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentPatients.map((patient, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        backgroundColor: '#f5f7fa',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {patient.p?.name || 'Sin nombre'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {patient.p?.patientId || 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {patient.p?.registrationDate
                          ? new Date(patient.p.registrationDate).toLocaleDateString('es-ES')
                          : 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Alertas Críticas
              </Typography>
              {alerts.length === 0 ? (
                <Alert severity="success">
                  No hay alertas críticas en este momento
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {alerts.slice(0, 5).map((alert, index) => (
                    <Alert key={index} severity="warning">
                      <Typography variant="body2">
                        {alert.message}
                      </Typography>
                      {alert.timestamp && (
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.timestamp).toLocaleString('es-ES')}
                        </Typography>
                      )}
                    </Alert>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

// Made with Bob
