import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

function ChatInterface({ onSendMessage, messages = [], loading = false }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f7fa',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
            }}
          >
            <SmartToyIcon sx={{ fontSize: 64, mb: 2, color: '#1976d2' }} />
            <Typography variant="h6">Asistente de IA Dental</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Pregúntame sobre pacientes, tratamientos o casos clínicos
            </Typography>
          </Box>
        )}

        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.role === 'user' ? '#1976d2' : '#0288d1',
                width: 36,
                height: 36,
              }}
            >
              {message.role === 'user' ? (
                <PersonIcon fontSize="small" />
              ) : (
                <SmartToyIcon fontSize="small" />
              )}
            </Avatar>

            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                backgroundColor: message.role === 'user' ? '#e3f2fd' : '#ffffff',
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
              {message.timestamp && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {new Date(message.timestamp).toLocaleTimeString('es-ES')}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#0288d1', width: 36, height: 36 }}>
              <SmartToyIcon fontSize="small" />
            </Avatar>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <CircularProgress size={20} />
            </Paper>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            variant="outlined"
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatInterface;

// Made with Bob
