import { gql } from '@apollo/client'

// Auth Operations
export const ME_QUERY = gql`
  query Me {
    me {
      id
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
