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
      }
      totalCount
    }
  }
`

export const LIST_PROJECTS_AND_SERVICES_QUERY = gql`
  query ListProjectsAndServices($first: Int, $after: String) {
    listProjects(first: $first, after: $after) {
      nodes {
        id
        name
        ref
        services {
          id
          name
          status
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
        status
        errorMessage
        fqdn
        customDomain
        memory
        vcpus
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
        status
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
      status
      errorMessage
      envVars {
        key
        value
      }
      fqdn
      port
      gitProvider
      commitHash
      memory
      vcpus
      customDomain
      customDomainStatus
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

// Hosted Zone Operations
export const LIST_HOSTED_ZONES_QUERY = gql`
  query ListHostedZones {
    listHostedZones {
      id
      zone
      status
      error
      dnsRecords {
        host
        type
        value
        verified
      }
      records {
        id
        name
        type
        content
        ttl
        managed
        createdAt
      }
      createdAt
    }
  }
`

export const CREATE_HOSTED_ZONE_MUTATION = gql`
  mutation CreateHostedZone($zone: String!) {
    createHostedZone(zone: $zone) {
      zoneId
      zone
      status
      dnsRecords {
        host
        type
        value
        verified
      }
    }
  }
`

export const VERIFY_HOSTED_ZONE_MUTATION = gql`
  mutation VerifyHostedZone($zone: String!) {
    verifyHostedZone(zone: $zone) {
      zoneId
      zone
      status
      message
      dnsRecords {
        host
        type
        value
        verified
      }
    }
  }
`

export const DELETE_HOSTED_ZONE_MUTATION = gql`
  mutation DeleteHostedZone($zone: String!) {
    deleteHostedZone(zone: $zone) {
      zoneId
      message
    }
  }
`

export const ADD_DNS_RECORD_MUTATION = gql`
  mutation AddDnsRecord(
    $zone: String!
    $name: String!
    $type: String!
    $content: String!
    $ttl: Int
  ) {
    addDnsRecord(zone: $zone, name: $name, type: $type, content: $content, ttl: $ttl) {
      id
      name
      type
      content
      ttl
      managed
      createdAt
    }
  }
`

export const DELETE_DNS_RECORD_MUTATION = gql`
  mutation DeleteDnsRecord($zone: String!, $recordId: ID!) {
    deleteDnsRecord(zone: $zone, recordId: $recordId)
  }
`
