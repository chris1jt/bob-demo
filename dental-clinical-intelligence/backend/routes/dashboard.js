const express = require('express');
const router = express.Router();
const mcp = require('../config/mcp');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Mock data for development
    const mockStats = {
      overview: {
        totalPatients: 156,
        totalXrays: 342,
        totalAnalyses: 298,
        totalFindings: 187,
        activeTreatments: 45
      },
      findingsBySeverity: [
        { severity: 'Leve', count: 89 },
        { severity: 'Moderada', count: 67 },
        { severity: 'Severa', count: 31 }
      ],
      recentActivity: [],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dashboard/recent-patients - Get recent patients
router.get('/recent-patients', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Mock recent patients
    const mockPatients = [
      { patientId: 'P001', name: 'María García', age: 34, lastVisit: new Date().toISOString() },
      { patientId: 'P002', name: 'Juan Pérez', age: 45, lastVisit: new Date(Date.now() - 86400000).toISOString() },
      { patientId: 'P003', name: 'Ana López', age: 28, lastVisit: new Date(Date.now() - 172800000).toISOString() },
      { patientId: 'P004', name: 'Carlos Ruiz', age: 52, lastVisit: new Date(Date.now() - 259200000).toISOString() },
      { patientId: 'P005', name: 'Laura Martínez', age: 39, lastVisit: new Date(Date.now() - 345600000).toISOString() }
    ].slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: mockPatients
    });
  } catch (error) {
    console.error('Recent patients error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dashboard/pending-cases - Get pending cases
router.get('/pending-cases', async (req, res) => {
  try {
    const query = `
      MATCH (a:Analysis)
      WHERE a.status = 'pending' OR a.status IS NULL
      OPTIONAL MATCH (a)<-[:HAS_ANALYSIS]-(x:XRay)<-[:HAS_XRAY]-(p:Patient)
      RETURN a, x, p
      ORDER BY a.analysisDate DESC
      LIMIT 20
    `;
    
    const result = await mcp.graphQuery(query);
    
    res.json({
      success: true,
      data: result,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dashboard/trends - Get trends data
router.get('/trends', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const daysAgo = parseInt(period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    const query = `
      MATCH (a:Analysis)
      WHERE a.analysisDate >= '${startDate.toISOString()}'
      RETURN 
        date(a.analysisDate) as date,
        count(*) as count
      ORDER BY date DESC
    `;
    
    const trends = await mcp.graphQuery(query);
    
    res.json({
      success: true,
      data: trends,
      period: `${daysAgo} days`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dashboard/alerts - Get system alerts
router.get('/alerts', async (req, res) => {
  try {
    // Mock alerts
    const mockAlerts = [
      {
        type: 'critical_finding',
        severity: 'high',
        message: 'Fractura dental severa detectada en paciente María García',
        patientId: 'P001',
        timestamp: new Date().toISOString()
      },
      {
        type: 'pending_treatment',
        severity: 'medium',
        message: 'Tratamiento de endodoncia pendiente para Juan Pérez',
        patientId: 'P002',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        type: 'follow_up',
        severity: 'low',
        message: 'Seguimiento requerido para Ana López',
        patientId: 'P003',
        timestamp: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: mockAlerts,
      count: mockAlerts.length
    });
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
