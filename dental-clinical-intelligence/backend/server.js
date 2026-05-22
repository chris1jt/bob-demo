const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const patientRoutes = require('./routes/patients');
const dentalRecordRoutes = require('./routes/dentalRecords');
const aiRoutes = require('./routes/ai');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const assistantRoutes = require('./routes/assistant');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/dental-records', dentalRecordRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🦷 Dental Clinical Intelligence Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      patients: '/api/patients',
      dentalRecords: '/api/dental-records',
      ai: '/api/ai',
      reports: '/api/reports',
      dashboard: '/api/dashboard'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🦷 Dental Clinical Intelligence Platform API            ║
║                                                           ║
║  Server running on: http://localhost:${PORT}              ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║  Context ID: ${process.env.CONTEXT_ID}              ║
║                                                           ║
║  Ready to serve! 🚀                                       ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;

// Made with Bob
