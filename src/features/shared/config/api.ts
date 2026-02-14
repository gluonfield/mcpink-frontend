const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8081/graphql'

// Derive base API URL by stripping /graphql from the endpoint
export const API_BASE_URL = GRAPHQL_ENDPOINT.replace(/\/graphql$/, '')
