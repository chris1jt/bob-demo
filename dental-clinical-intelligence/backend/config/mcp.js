const axios = require('axios');

class MCPClient {
  constructor() {
    this.baseURL = process.env.MCP_GATEWAY_URL;
    this.contextId = process.env.CONTEXT_ID;
    this.authToken = process.env.MCP_AUTH_TOKEN;
    this.apiKey = process.env.MCP_API_KEY;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
  }

  async mcpRequest(method, params) {
    try {
      const response = await this.client.post('', {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'MCP request failed');
      }

      return response.data.result;
    } catch (error) {
      console.error('MCP Request Error:', error.message);
      throw error;
    }
  }

  async hybridQuery(query, topK = 10, filters = {}) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-hybrid-query',
      arguments: {
        context_id: this.contextId,
        query,
        top_k: topK,
        filters
      }
    });
  }

  async vectorQuery(query, topK = 5, threshold = 0.7) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-vector-query',
      arguments: {
        context_id: this.contextId,
        query,
        top_k: topK,
        threshold
      }
    });
  }

  async graphQuery(query) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-graph-query',
      arguments: {
        context_id: this.contextId,
        query
      }
    });
  }

  async createEntity(entityType, data) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-create-entity',
      arguments: {
        context_id: this.contextId,
        entity_type: entityType,
        data
      }
    });
  }

  async updateEntity(entityType, entityId, data) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-update-entity',
      arguments: {
        context_id: this.contextId,
        entity_type: entityType,
        entity_id: entityId,
        data
      }
    });
  }

  async validateEntity(entityType, data) {
    return this.mcpRequest('tools/call', {
      name: 'context-broker-validate-entity',
      arguments: {
        context_id: this.contextId,
        entity_type: entityType,
        data
      }
    });
  }
}

module.exports = new MCPClient();

// Made with Bob
