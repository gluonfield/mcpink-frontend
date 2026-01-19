import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const GRAPHQL_HTTP_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8081/graphql'
const GRAPHQL_WS_ENDPOINT = GRAPHQL_HTTP_ENDPOINT.replace('http', 'ws')

const httpLink = createHttpLink({
  uri: GRAPHQL_HTTP_ENDPOINT,
  credentials: 'include'
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_WS_ENDPOINT
  })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
})

export default apolloClient
