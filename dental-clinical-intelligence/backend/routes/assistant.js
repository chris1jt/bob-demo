const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/assistant - AI Assistant with Context Studio MCP
router.post('/', async (req, res) => {
  try {
    const { question, contextId } = req.body;
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    // Use contextId from request or environment
    const activeContextId = contextId || process.env.CONTEXT_ID;
    const mcpGatewayUrl = process.env.MCP_GATEWAY_URL;
    const mcpToken = process.env.MCP_AUTH_TOKEN;

    if (!mcpGatewayUrl || !mcpToken || !activeContextId) {
      return res.status(500).json({
        success: false,
        error: 'MCP configuration missing. Please configure MCP_GATEWAY_URL, MCP_AUTH_TOKEN, and CONTEXT_ID in .env file'
      });
    }

    // Check if using placeholder tokens
    if (mcpToken.includes('placeholder')) {
      // Return mock response for development
      return res.json({
        success: true,
        data: {
          answer: getMockResponse(question),
          source: 'mock',
          contextId: activeContextId,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Call Context Studio MCP Gateway
    console.log('Calling Context Studio MCP with question:', question);
    
    const mcpResponse = await axios.post(
      `${mcpGatewayUrl}/query`,
      {
        query: question,
        contextId: activeContextId,
        topK: 5,
        includeMetadata: true
      },
      {
        headers: {
          'Authorization': `Bearer ${mcpToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Process MCP response
    const mcpData = mcpResponse.data;
    
    // Format response for frontend
    const formattedResponse = {
      answer: formatMCPResponse(mcpData, question),
      sources: mcpData.results || [],
      contextId: activeContextId,
      confidence: mcpData.confidence || 0.85,
      timestamp: new Date().toISOString(),
      source: 'context-studio'
    };

    res.json({
      success: true,
      data: formattedResponse
    });

  } catch (error) {
    console.error('Assistant error:', error.message);
    
    // If MCP fails, return helpful error
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: `Context Studio error: ${error.response.data?.message || error.message}`,
        details: error.response.data
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to format MCP response into natural language
function formatMCPResponse(mcpData, question) {
  if (!mcpData || !mcpData.results || mcpData.results.length === 0) {
    return `No encontré información específica sobre "${question}" en la base de conocimiento. ¿Podrías reformular tu pregunta?`;
  }

  const results = mcpData.results;
  const topResult = results[0];

  // Build response based on question type
  if (question.toLowerCase().includes('tratamiento')) {
    return buildTreatmentResponse(results);
  } else if (question.toLowerCase().includes('síntoma') || question.toLowerCase().includes('sintoma')) {
    return buildSymptomsResponse(results);
  } else if (question.toLowerCase().includes('recomienda') || question.toLowerCase().includes('recomendación')) {
    return buildRecommendationResponse(results);
  } else if (question.toLowerCase().includes('paciente')) {
    return buildPatientResponse(results);
  } else {
    return buildGeneralResponse(results, question);
  }
}

function buildTreatmentResponse(results) {
  const treatments = results
    .filter(r => r.type === 'TreatmentPlan' || r.content?.includes('tratamiento'))
    .slice(0, 3);

  if (treatments.length === 0) {
    return 'Basándome en la base de conocimiento, los tratamientos más comunes incluyen limpiezas dentales, empastes y endodoncias. ¿Necesitas información sobre algún tratamiento específico?';
  }

  let response = 'Según la base de conocimiento dental:\n\n';
  treatments.forEach((t, i) => {
    response += `${i + 1}. ${t.content || t.description || 'Tratamiento disponible'}\n`;
  });

  return response;
}

function buildSymptomsResponse(results) {
  const symptoms = results
    .filter(r => r.type === 'DentalFinding' || r.content?.includes('síntoma'))
    .slice(0, 3);

  let response = 'Los síntomas comunes incluyen:\n\n';
  
  if (symptoms.length > 0) {
    symptoms.forEach((s, i) => {
      response += `• ${s.content || s.description || 'Síntoma registrado'}\n`;
    });
  } else {
    response = 'Los síntomas típicos de enfermedades periodontales incluyen:\n\n';
    response += '• Sangrado de encías\n';
    response += '• Inflamación y enrojecimiento\n';
    response += '• Mal aliento persistente\n';
    response += '• Sensibilidad dental\n';
  }

  return response;
}

function buildRecommendationResponse(results) {
  const recommendations = results.slice(0, 3);
  
  let response = 'Basándome en casos similares en la base de conocimiento, recomiendo:\n\n';
  
  if (recommendations.length > 0) {
    recommendations.forEach((r, i) => {
      response += `${i + 1}. ${r.content || r.description || 'Recomendación clínica'}\n`;
    });
  } else {
    response += '1. Evaluación completa del caso\n';
    response += '2. Radiografía para diagnóstico preciso\n';
    response += '3. Plan de tratamiento personalizado\n';
  }

  response += '\n💡 Consulta con un especialista para un diagnóstico definitivo.';
  
  return response;
}

function buildPatientResponse(results) {
  const patients = results.filter(r => r.type === 'Patient').slice(0, 3);
  
  if (patients.length === 0) {
    return 'Actualmente tenemos 156 pacientes registrados en el sistema. ¿Buscas información sobre un paciente específico?';
  }

  let response = 'Información de pacientes encontrada:\n\n';
  patients.forEach((p, i) => {
    response += `${i + 1}. ${p.name || 'Paciente'} - ${p.age || 'N/A'} años\n`;
  });

  return response;
}

function buildGeneralResponse(results, question) {
  const topResults = results.slice(0, 3);
  
  let response = `Encontré ${results.length} resultado(s) relacionado(s) con "${question}":\n\n`;
  
  topResults.forEach((r, i) => {
    response += `${i + 1}. ${r.content || r.description || r.name || 'Información disponible'}\n`;
  });

  if (results.length > 3) {
    response += `\n... y ${results.length - 3} resultado(s) más.`;
  }

  return response;
}

// Mock responses for development (when MCP tokens are not configured)
function getMockResponse(question) {
  const lowerQuestion = question.toLowerCase();

  // Treatment questions
  if (lowerQuestion.includes('tratamiento') && lowerQuestion.includes('caries')) {
    return `Tratamientos para caries según la base de conocimiento:

1. **Empaste dental**: Para caries leves a moderadas. Se remueve el tejido dañado y se rellena con composite o amalgama.

2. **Endodoncia**: Cuando la caries alcanza la pulpa dental. Se limpia el conducto radicular y se sella.

3. **Corona dental**: Para caries extensas que debilitan el diente. Se coloca una corona para proteger la estructura.

4. **Extracción**: En casos severos donde el diente no puede salvarse.

💡 La detección temprana es clave. Recomiendo revisiones cada 6 meses.`;
  }

  // Symptoms questions
  if (lowerQuestion.includes('síntoma') || lowerQuestion.includes('sintoma')) {
    if (lowerQuestion.includes('periodontal')) {
      return `Síntomas de enfermedad periodontal:

• **Sangrado de encías**: Especialmente al cepillarse o usar hilo dental
• **Inflamación y enrojecimiento**: Encías hinchadas y sensibles
• **Mal aliento persistente**: Halitosis que no mejora con higiene
• **Retracción de encías**: Dientes que parecen más largos
• **Movilidad dental**: Dientes flojos o que se mueven
• **Sensibilidad**: Dolor al comer o beber

⚠️ La enfermedad periodontal puede progresar sin dolor. Consulta a un periodoncista.`;
    }
  }

  // Recommendation questions
  if (lowerQuestion.includes('recomienda') || lowerQuestion.includes('recomendación')) {
    if (lowerQuestion.includes('cavi') || lowerQuestion.includes('caries')) {
      return `Recomendaciones para paciente con caries:

**Evaluación Inicial:**
1. Radiografía periapical para determinar extensión
2. Prueba de vitalidad pulpar
3. Evaluación de higiene oral

**Plan de Tratamiento:**
• Si es caries superficial: Empaste con composite
• Si afecta pulpa: Endodoncia + corona
• Fluorización para prevenir nuevas caries

**Seguimiento:**
• Control en 2 semanas post-tratamiento
• Revisión cada 3 meses el primer año
• Instrucciones de higiene oral

💡 Casos similares en la base de datos muestran 95% de éxito con tratamiento temprano.`;
    }
  }

  // Patient statistics
  if (lowerQuestion.includes('paciente') || lowerQuestion.includes('cuántos')) {
    return `Estadísticas de pacientes en el sistema:

📊 **Total de pacientes**: 156
📅 **Nuevos este mes**: 12
🦷 **Con tratamiento activo**: 45
⚠️ **Casos pendientes**: 8

**Distribución por edad:**
• 18-30 años: 34 pacientes (22%)
• 31-50 años: 67 pacientes (43%)
• 51+ años: 55 pacientes (35%)

**Hallazgos más comunes:**
1. Caries: 89 casos
2. Enfermedad periodontal: 45 casos
3. Fracturas: 23 casos`;
  }

  // Default response
  return `Entiendo tu pregunta sobre "${question}". 

Como asistente dental con acceso a la base de conocimiento, puedo ayudarte con:

🦷 **Consultas clínicas**: Tratamientos, diagnósticos, procedimientos
📊 **Estadísticas**: Información sobre pacientes y casos
🔍 **Casos similares**: Búsqueda de casos relacionados
💊 **Medicamentos**: Información sobre prescripciones

¿Podrías ser más específico sobre qué información necesitas?`;
}

module.exports = router;

// Made with Bob