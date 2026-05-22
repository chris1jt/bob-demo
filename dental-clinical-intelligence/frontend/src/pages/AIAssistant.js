import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import ChatInterface from '../components/ChatInterface';
import { assistantAPI } from '../services/api';

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);

      // Call Assistant API with Context Studio MCP
      const response = await assistantAPI.ask(message);

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data?.answer || response.data?.message || 'Lo siento, no pude procesar tu pregunta.',
        timestamp: new Date().toISOString(),
        source: response.data?.source || 'unknown',
        confidence: response.data?.confidence
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al comunicarse con el asistente. Por favor, intenta de nuevo.');
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
        Asistente de IA Dental
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={loading}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Info Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                ¿Cómo puedo ayudarte?
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Consultas de Pacientes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pregunta sobre información de pacientes, historiales y registros
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Análisis Clínicos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Obtén análisis y recomendaciones basadas en hallazgos
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Casos Similares
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Busca casos similares en la base de datos
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Tratamientos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Consulta sobre planes de tratamiento y procedimientos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ejemplos de Preguntas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ p: 1, backgroundColor: '#f5f7fa', borderRadius: 1 }}>
                  "¿Cuántos pacientes hay en el sistema?"
                </Typography>
                <Typography variant="body2" sx={{ p: 1, backgroundColor: '#f5f7fa', borderRadius: 1 }}>
                  "Busca casos similares de caries en molares"
                </Typography>
                <Typography variant="body2" sx={{ p: 1, backgroundColor: '#f5f7fa', borderRadius: 1 }}>
                  "¿Qué tratamientos son recomendados para fracturas dentales?"
                </Typography>
                <Typography variant="body2" sx={{ p: 1, backgroundColor: '#f5f7fa', borderRadius: 1 }}>
                  "Muéstrame los últimos 5 pacientes registrados"
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AIAssistant;

// Made with Bob
