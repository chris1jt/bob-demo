import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PatientCard from '../components/PatientCard';
import { patientAPI } from '../services/api';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getAll();
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Error al cargar pacientes. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPatients();
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const response = await patientAPI.search(searchQuery);
      setPatients(response.data || []);
    } catch (err) {
      console.error('Error searching patients:', err);
      setError('Error en la búsqueda. Por favor, intenta de nuevo.');
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
          Pacientes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => alert('Funcionalidad de agregar paciente próximamente')}
        >
          Nuevo Paciente
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar pacientes por nombre, ID o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searching && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'white',
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron pacientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer paciente para comenzar'}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Mostrando {patients.length} paciente{patients.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {patients.map((patient, index) => (
              <Grid item xs={12} sm={6} md={4} key={patient.p?.patientId || index}>
                <PatientCard patient={patient.p || patient} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export default PatientList;

// Made with Bob
