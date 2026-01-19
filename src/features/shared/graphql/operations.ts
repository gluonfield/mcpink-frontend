import { gql } from '@apollo/client'

// Auth Operations
export const ME_QUERY = gql`
  query Me {
    me {
      id
      githubUsername
      avatarUrl
      createdAt
      hasFlyioCredentials
      deploymentProviders {
        provider
        organization
        hasCredentials
        createdAt
      }
    }
  }
`

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

// Fly.io Operations (deprecated - use deployment provider operations)
export const UPDATE_FLYIO_CREDENTIALS_MUTATION = gql`
  mutation UpdateFlyioCredentials($token: String!, $organization: String!) {
    updateFlyioCredentials(token: $token, organization: $organization)
  }
`

export const REMOVE_FLYIO_CREDENTIALS_MUTATION = gql`
  mutation RemoveFlyioCredentials {
    removeFlyioCredentials
  }
`

// Deployment Provider Operations
export const UPDATE_DEPLOYMENT_PROVIDER_MUTATION = gql`
  mutation UpdateDeploymentProvider($input: DeploymentProviderInput!) {
    updateDeploymentProvider(input: $input)
  }
`

export const REMOVE_DEPLOYMENT_PROVIDER_MUTATION = gql`
  mutation RemoveDeploymentProvider($provider: DeploymentProvider!) {
    removeDeploymentProvider(provider: $provider)
  }
`

// Example Operations
export const EXAMPLE_FRAGMENT = gql`
  fragment ExampleFragment on Example {
    id
    email
  }
`

export const GET_EXAMPLE_QUERY = gql`
  query GetExample {
    example {
      ...ExampleFragment
    }
  }
  ${EXAMPLE_FRAGMENT}
`
