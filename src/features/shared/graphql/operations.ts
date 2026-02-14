import { gql } from '@apollo/client'

// Auth Operations
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      displayName
      githubUsername
      avatarUrl
      createdAt
      githubAppInstallationId
      githubScopes
    }
  }
`

// API Key Operations
export const MY_API_KEYS_QUERY = gql`
  query MyAPIKeys {
    myAPIKeys {
      id
      name
      prefix
      lastUsedAt
      createdAt
    }
  }
`

export const CREATE_API_KEY_MUTATION = gql`
  mutation CreateAPIKey($name: String!) {
    createAPIKey(name: $name) {
      apiKey {
        id
        name
        prefix
        createdAt
      }
      secret
    }
  }
`

export const REVOKE_API_KEY_MUTATION = gql`
  mutation RevokeAPIKey($id: ID!) {
    revokeAPIKey(id: $id)
  }
`

export const RECHECK_GITHUB_APP_MUTATION = gql`
  mutation RecheckGithubAppInstallation {
    recheckGithubAppInstallation
  }
`

// Project Operations
export const LIST_PROJECTS_QUERY = gql`
  query ListProjects($first: Int, $after: String) {
    listProjects(first: $first, after: $after) {
      nodes {
        id
        name
        ref
        services {
          id
          name
          buildStatus
          runtimeStatus
        }
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const PROJECT_DETAILS_QUERY = gql`
  query ProjectDetails($id: ID!) {
    projectDetails(id: $id) {
      id
      name
      ref
      services {
        id
        name
        repo
        branch
        buildStatus
        runtimeStatus
        errorMessage
        fqdn
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`

// Service Operations
export const LIST_SERVICES_QUERY = gql`
  query ListServices($first: Int, $after: String) {
    listServices(first: $first, after: $after) {
      nodes {
        id
        name
        repo
        branch
        buildStatus
        runtimeStatus
        errorMessage
        fqdn
        memory
        vcpus
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`

export const SERVICE_DETAILS_QUERY = gql`
  query ServiceDetails($id: ID!) {
    serviceDetails(id: $id) {
      id
      name
      repo
      branch
      buildStatus
      runtimeStatus
      errorMessage
      envVars {
        key
        value
      }
      fqdn
      memory
      vcpus
      createdAt
      updatedAt
    }
  }
`

export const SERVICE_METRICS_QUERY = gql`
  query ServiceMetrics($serviceId: ID!, $timeRange: MetricTimeRange!) {
    serviceMetrics(serviceId: $serviceId, timeRange: $timeRange) {
      cpuUsage {
        metric
        dataPoints {
          timestamp
          value
        }
      }
      memoryUsageMB {
        metric
        dataPoints {
          timestamp
          value
        }
      }
      networkReceiveBytesPerSec {
        metric
        dataPoints {
          timestamp
          value
        }
      }
      networkTransmitBytesPerSec {
        metric
        dataPoints {
          timestamp
          value
        }
      }
      memoryLimitMB
      cpuLimitVCPUs
    }
  }
`
