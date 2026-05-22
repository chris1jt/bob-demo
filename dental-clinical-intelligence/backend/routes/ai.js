const express = require('express');
const router = express.Router();
const mcp = require('../config/mcp');

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }
    
    // Mock responses for development (until MCP tokens are configured)
    const mockResponses = {
      'pacientes': 'Actualmente tenemos 156 pacientes registrados en el sistema. 12 tienen citas pendientes esta semana.',
      'radiografías': 'Se han realizado 342 radiografías este mes. Las más comunes son panorámicas (45%) y periapicales (35%).',
      'tratamientos': 'Los tratamientos más frecuentes son: limpiezas dentales (40%), empastes (25%), y endodoncias (15%).',
      'caries': 'Se han detectado 89 casos de caries en el último mes. El 60% son caries interproximales.',
      'fracturas': 'Hay 23 casos de fracturas dentales registrados. La mayoría requieren coronas o reconstrucciones.',
      'default': `Entiendo tu pregunta sobre "${message}". Como asistente dental, puedo ayudarte con:\n\n• Consultas de pacientes\n• Análisis de radiografías\n• Recomendaciones de tratamiento\n• Búsqueda de casos similares\n\n¿En qué más puedo ayudarte?`
    };
    
    // Find matching response
    let responseText = mockResponses.default;
    const lowerMessage = message.toLowerCase();
    
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(key)) {
        responseText = value;
        break;
      }
    }
    
    // Try to use MCP if tokens are configured, otherwise use mock
    let contextData = [];
    try {
      if (process.env.MCP_AUTH_TOKEN && !process.env.MCP_AUTH_TOKEN.includes('placeholder')) {
        contextData = await mcp.hybridQuery(message, 5);
      }
    } catch (mcpError) {
      console.log('MCP not available, using mock data:', mcpError.message);
    }
    
    // Format response
    const response = {
      message: responseText,
      context: contextData,
      timestamp: new Date().toISOString(),
      mode: contextData.length > 0 ? 'mcp' : 'mock'
    };
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/ai/recommendations - Get treatment recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { patientId, findings } = req.body;
    
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required'
      });
    }
    
    // Get patient data
    const patientQuery = `
      MATCH (p:Patient {patientId: '${patientId}'})
      OPTIONAL MATCH (p)-[:HAS_XRAY]->(x:XRay)-[:HAS_ANALYSIS]->(a:Analysis)-[:HAS_FINDING]->(f:DentalFinding)
      RETURN p, collect(DISTINCT f) as findings
    `;
    
    const patientData = await mcp.graphQuery(patientQuery);
    
    // Search for similar cases
    const similarCases = await mcp.vectorQuery(
      `paciente con hallazgos similares: ${findings?.join(', ') || 'general'}`,
      5,
      0.7
    );
    
    // Generate recommendations
    const recommendations = {
      patientId,
      recommendations: [
        {
          type: 'treatment',
          priority: 'high',
          description: 'Tratamiento recomendado basado en hallazgos',
          similarCases: similarCases.length
        }
      ],
      similarCases,
      generatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/ai/analyze-case - Analyze clinical case
router.post('/analyze-case', async (req, res) => {
  try {
    const { patientId, symptoms, findings } = req.body;
    
    // Search for similar cases using vector search
    const searchQuery = `${symptoms || ''} ${findings?.join(' ') || ''}`.trim();
    const similarCases = await mcp.vectorQuery(searchQuery, 10, 0.6);
    
    // Get treatment patterns
    const treatmentQuery = `
      MATCH (f:DentalFinding)-[:REQUIRES_TREATMENT]->(t:TreatmentPlan)
      WHERE f.type IN [${findings?.map(f => `'${f}'`).join(',') || ''}]
      RETURN t, count(*) as frequency
      ORDER BY frequency DESC
      LIMIT 5
    `;
    
    const treatments = await mcp.graphQuery(treatmentQuery);
    
    const analysis = {
      patientId,
      similarCases: similarCases.slice(0, 5),
      recommendedTreatments: treatments,
      confidence: similarCases.length > 0 ? 0.85 : 0.5,
      analyzedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/ai/search-similar - Search similar cases
router.post('/search-similar', async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const results = await mcp.vectorQuery(query, topK, 0.7);
    
    res.json({
      success: true,
      data: results,
      query,
      count: results.length
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
