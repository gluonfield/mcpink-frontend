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

// App Operations
export const LIST_APPS_QUERY = gql`
  query ListApps($first: Int, $after: String) {
    listApps(first: $first, after: $after) {
      nodes {
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

export const APP_DETAILS_QUERY = gql`
  query AppDetails($id: ID!) {
    appDetails(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`
