const express = require('express');
const router = express.Router();
const mcp = require('../config/mcp');

// GET /api/reports/:patientId - Get reports for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const query = `
      MATCH (p:Patient {patientId: '${patientId}'})-[:HAS_REPORT]->(r:Report)
      RETURN r
      ORDER BY r.generatedDate DESC
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

// POST /api/reports/generate - Generate new report
router.post('/generate', async (req, res) => {
  try {
    const { patientId, type, includeXrays, includeFindings } = req.body;
    
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required'
      });
    }
    
    // Get patient data
    const patientQuery = `
      MATCH (p:Patient {patientId: '${patientId}'})
      OPTIONAL MATCH (p)-[:HAS_XRAY]->(x:XRay)-[:HAS_ANALYSIS]->(a:Analysis)
      OPTIONAL MATCH (a)-[:HAS_FINDING]->(f:DentalFinding)
      OPTIONAL MATCH (p)-[:HAS_TREATMENT_PLAN]->(t:TreatmentPlan)
      RETURN p, 
             collect(DISTINCT x) as xrays,
             collect(DISTINCT a) as analyses,
             collect(DISTINCT f) as findings,
             collect(DISTINCT t) as treatments
    `;
    
    const patientData = await mcp.graphQuery(patientQuery);
    
    if (!patientData || patientData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    const patient = patientData[0];
    
    // Generate report
    const report = {
      reportId: `REP${Date.now()}`,
      patientId,
      type: type || 'comprehensive',
      generatedDate: new Date().toISOString(),
      patient: patient.p,
      summary: {
        totalXrays: patient.xrays?.length || 0,
        totalAnalyses: patient.analyses?.length || 0,
        totalFindings: patient.findings?.length || 0,
        activeTreatments: patient.treatments?.filter(t => t.status === 'active').length || 0
      },
      ...(includeXrays && { xrays: patient.xrays }),
      ...(includeFindings && { findings: patient.findings }),
      treatments: patient.treatments
    };
    
    // Save report to Context Studio
    await mcp.createEntity('Report', report);
    
    res.status(201).json({
      success: true,
      data: report,
      message: 'Report generated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/reports/:id/download - Download report
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    
    const query = `
      MATCH (r:Report {reportId: '${id}'})
      RETURN r
    `;
    
    const result = await mcp.graphQuery(query);
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    const report = result[0].r;
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="report_${id}.json"`);
      res.send(JSON.stringify(report, null, 2));
    } else if (format === 'txt') {
      const txtContent = `
REPORTE DENTAL
==============

Paciente: ${report.patient?.name || 'N/A'}
ID: ${report.patientId}
Fecha: ${report.generatedDate}

RESUMEN:
- Radiografías: ${report.summary?.totalXrays || 0}
- Análisis: ${report.summary?.totalAnalyses || 0}
- Hallazgos: ${report.summary?.totalFindings || 0}
- Tratamientos activos: ${report.summary?.activeTreatments || 0}

Generado por: Dental Clinical Intelligence Platform
      `.trim();
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="report_${id}.txt"`);
      res.send(txtContent);
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid format. Use json or txt'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

// Made with Bob
