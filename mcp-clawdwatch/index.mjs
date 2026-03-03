#!/usr/bin/env node

// ClawdWatch MCP Server - stdio transport for LM Studio
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({
  name: 'clawdwatch',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

const tools = [
  {
    name: 'clawdwatch_status',
    description: 'Get ClawdWatch service status',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'clawdwatch_flights',
    description: 'Get flight data from conflict regions',
    inputSchema: { 
      type: 'object', 
      properties: { 
        region: { type: 'string', description: 'Optional region name' }
      }
    }
  },
  {
    name: 'clawdwatch_news',
    description: 'Get news from Reuters, Al Jazeera, AP',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'clawdwatch_conflict',
    description: 'Get conflict zone data (11 regions)',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'clawdwatch_regions',
    description: 'List all 21 tracked regions',
    inputSchema: { type: 'object', properties: {} }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const baseUrl = 'http://localhost:3444';
    let data;
    
    switch (name) {
      case 'clawdwatch_status':
        data = await fetch(`${baseUrl}/status`).then(r => r.json());
        break;
      case 'clawdwatch_flights':
        data = args.region 
          ? await fetch(`${baseUrl}/flights/${args.region}`).then(r => r.json())
          : await fetch(`${baseUrl}/flights`).then(r => r.json());
        break;
      case 'clawdwatch_news':
        data = await fetch(`${baseUrl}/news`).then(r => r.json());
        break;
      case 'clawdwatch_conflict':
        data = await fetch(`${baseUrl}/conflict`).then(r => r.json());
        break;
      case 'clawdwatch_regions':
        data = await fetch(`${baseUrl}/regions`).then(r => r.json());
        break;
      default:
        return { content: [{ type: 'text', text: 'Unknown tool' }] };
    }
    
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${error.message}` }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('ClawdWatch MCP server running');
