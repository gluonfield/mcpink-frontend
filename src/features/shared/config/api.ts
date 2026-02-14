const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8081/graphql'

// Derive base API URL by stripping /graphql from the endpoint
export const API_BASE_URL = GRAPHQL_ENDPOINT.replace(/\/graphql$/, '')

// MCP OAuth base URL - OAuth endpoints live on the MCP server, not the GraphQL API
const MCP_DOMAIN = import.meta.env.VITE_MCP_DOMAIN || 'https://mcp.ml.ink/mcp'
export const MCP_OAUTH_BASE_URL = new URL(MCP_DOMAIN).origin
