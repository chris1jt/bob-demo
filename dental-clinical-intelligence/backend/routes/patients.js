const express = require('express');
const router = express.Router();
const mcp = require('../config/mcp');

// GET /api/patients - List all patients
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Mock patients data
    const mockPatients = [
      { patientId: 'P001', name: 'María García', age: 34, gender: 'Femenino', email: 'maria.garcia@email.com', phone: '555-0101', status: 'Activo', lastVisit: new Date().toISOString() },
      { patientId: 'P002', name: 'Juan Pérez', age: 45, gender: 'Masculino', email: 'juan.perez@email.com', phone: '555-0102', status: 'Activo', lastVisit: new Date(Date.now() - 86400000).toISOString() },
      { patientId: 'P003', name: 'Ana López', age: 28, gender: 'Femenino', email: 'ana.lopez@email.com', phone: '555-0103', status: 'Activo', lastVisit: new Date(Date.now() - 172800000).toISOString() },
      { patientId: 'P004', name: 'Carlos Ruiz', age: 52, gender: 'Masculino', email: 'carlos.ruiz@email.com', phone: '555-0104', status: 'Activo', lastVisit: new Date(Date.now() - 259200000).toISOString() },
      { patientId: 'P005', name: 'Laura Martínez', age: 39, gender: 'Femenino', email: 'laura.martinez@email.com', phone: '555-0105', status: 'Activo', lastVisit: new Date(Date.now() - 345600000).toISOString() },
      { patientId: 'P006', name: 'Roberto Sánchez', age: 61, gender: 'Masculino', email: 'roberto.sanchez@email.com', phone: '555-0106', status: 'Activo', lastVisit: new Date(Date.now() - 432000000).toISOString() },
      { patientId: 'P007', name: 'Patricia Gómez', age: 33, gender: 'Femenino', email: 'patricia.gomez@email.com', phone: '555-0107', status: 'Activo', lastVisit: new Date(Date.now() - 518400000).toISOString() },
      { patientId: 'P008', name: 'Miguel Torres', age: 47, gender: 'Masculino', email: 'miguel.torres@email.com', phone: '555-0108', status: 'Activo', lastVisit: new Date(Date.now() - 604800000).toISOString() }
    ];
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = mockPatients.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockPatients.length
      }
    });
  } catch (error) {
    console.error('Patients list error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/patients/search - Search patients
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    // Mock search - filter by name
    const mockPatients = [
      { patientId: 'P001', name: 'María García', age: 34, gender: 'Femenino', status: 'Activo' },
      { patientId: 'P002', name: 'Juan Pérez', age: 45, gender: 'Masculino', status: 'Activo' },
      { patientId: 'P003', name: 'Ana López', age: 28, gender: 'Femenino', status: 'Activo' },
      { patientId: 'P004', name: 'Carlos Ruiz', age: 52, gender: 'Masculino', status: 'Activo' }
    ];
    
    const searchLower = q.toLowerCase();
    const filtered = mockPatients.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.patientId.toLowerCase().includes(searchLower)
    );
    
    res.json({
      success: true,
      data: result,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/patients/:id - Get patient details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      MATCH (p:Patient {patientId: '${id}'})
      OPTIONAL MATCH (p)-[:HAS_XRAY]->(x:XRay)
      OPTIONAL MATCH (p)-[:HAS_TREATMENT_PLAN]->(t:TreatmentPlan)
      RETURN p, collect(DISTINCT x) as xrays, collect(DISTINCT t) as treatments
    `;
    
    const result = await mcp.graphQuery(query);
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/patients - Create new patient
router.post('/', async (req, res) => {
  try {
    const patientData = req.body;
    
    // Validate data
    const validation = await mcp.validateEntity('Patient', patientData);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    // Create patient
    const result = await mcp.createEntity('Patient', patientData);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Patient created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await mcp.updateEntity('Patient', id, updateData);
    
    res.json({
      success: true,
      data: result,
      message: 'Patient updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/patients/:id/history - Get patient dental history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      MATCH (p:Patient {patientId: '${id}'})
      OPTIONAL MATCH (p)-[:HAS_XRAY]->(x:XRay)-[:HAS_ANALYSIS]->(a:Analysis)
      OPTIONAL MATCH (a)-[:HAS_FINDING]->(f:DentalFinding)
      RETURN p, x, a, collect(f) as findings
      ORDER BY a.analysisDate DESC
    `;
    
    const result = await mcp.graphQuery(query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
