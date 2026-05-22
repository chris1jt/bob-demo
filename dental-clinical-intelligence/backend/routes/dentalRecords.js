const express = require('express');
const router = express.Router();
const mcp = require('../config/mcp');

// GET /api/dental-records/:patientId - Get dental records for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const query = `
      MATCH (p:Patient {patientId: '${patientId}'})-[:HAS_XRAY]->(x:XRay)
      OPTIONAL MATCH (x)-[:HAS_ANALYSIS]->(a:Analysis)
      OPTIONAL MATCH (a)-[:HAS_FINDING]->(f:DentalFinding)
      RETURN x, a, collect(f) as findings
      ORDER BY x.xrayDate DESC
    `;
    
    const result = await mcp.graphQuery(query);
    
    res.json({
      success: true,
      data: result,
      patientId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/dental-records - Create new dental record
router.post('/', async (req, res) => {
  try {
    const recordData = req.body;
    
    const result = await mcp.createEntity('XRay', recordData);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Dental record created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/dental-records/:id/xrays - Get X-rays for a record
router.get('/:id/xrays', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      MATCH (x:XRay {xrayId: '${id}'})
      RETURN x
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

// POST /api/dental-records/:id/analysis - Analyze X-ray
router.post('/:id/analysis', async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, findings, confidence } = req.body;
    
    const analysisData = {
      xrayId: id,
      diagnosis,
      confidence,
      analysisDate: new Date().toISOString(),
      findings
    };
    
    const result = await mcp.createEntity('Analysis', analysisData);
    
    // Create findings
    if (findings && findings.length > 0) {
      for (const finding of findings) {
        await mcp.createEntity('DentalFinding', {
          ...finding,
          analysisId: result.analysisId
        });
      }
    }
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Analysis created successfully'
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
