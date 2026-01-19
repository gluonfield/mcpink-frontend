import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { vi } from 'vitest'

export const mockApolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000/graphql'
})

export const mockUseGetExampleQuery = vi.fn(() => ({
  data: {
    example: {
      id: '1',
      email: 'test@example.com'
    }
  },
  loading: false,
  error: null
}))

vi.mock('@/features/shared/graphql', () => ({
  useGetExampleQuery: mockUseGetExampleQuery
}))

export { MockedProvider, ApolloProvider }
