import { gql } from '@apollo/client'
import * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
export type Maybe<T> = T | null | undefined
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Time: { input: any; output: any }
}

export type ApiKey = {
  __typename?: 'APIKey'
  createdAt: Scalars['Time']['output']
  id: Scalars['ID']['output']
  lastUsedAt: Maybe<Scalars['Time']['output']>
  name: Scalars['String']['output']
  prefix: Scalars['String']['output']
}

export type CreateApiKeyResult = {
  __typename?: 'CreateAPIKeyResult'
  apiKey: ApiKey
  secret: Scalars['String']['output']
}

export type Example = {
  __typename?: 'Example'
  email: Scalars['String']['output']
  id: Scalars['ID']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  createAPIKey: CreateApiKeyResult
  revokeAPIKey: Scalars['Boolean']['output']
}

export type MutationCreateApiKeyArgs = {
  name: Scalars['String']['input']
}

export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input']
}

export type Query = {
  __typename?: 'Query'
  example: Example
  me: Maybe<User>
  myAPIKeys: Array<ApiKey>
}

export type User = {
  __typename?: 'User'
  avatarUrl: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Time']['output']
  githubUsername: Scalars['String']['output']
  id: Scalars['ID']['output']
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me:
    | {
        __typename?: 'User'
        id: string
        githubUsername: string
        avatarUrl: string | null | undefined
        createdAt: any
      }
    | null
    | undefined
}

export type MyApiKeysQueryVariables = Exact<{ [key: string]: never }>

export type MyApiKeysQuery = {
  __typename?: 'Query'
  myAPIKeys: Array<{
    __typename?: 'APIKey'
    id: string
    name: string
    prefix: string
    lastUsedAt: any | null | undefined
    createdAt: any
  }>
}

export type CreateApiKeyMutationVariables = Exact<{
  name: Scalars['String']['input']
}>

export type CreateApiKeyMutation = {
  __typename?: 'Mutation'
  createAPIKey: {
    __typename?: 'CreateAPIKeyResult'
    secret: string
    apiKey: { __typename?: 'APIKey'; id: string; name: string; prefix: string; createdAt: any }
  }
}

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RevokeApiKeyMutation = { __typename?: 'Mutation'; revokeAPIKey: boolean }

export type ExampleFragment = { __typename?: 'Example'; id: string; email: string }

export type GetExampleQueryVariables = Exact<{ [key: string]: never }>

export type GetExampleQuery = {
  __typename?: 'Query'
  example: { __typename?: 'Example'; id: string; email: string }
}

export const ExampleFragmentDoc = gql`
  fragment ExampleFragment on Example {
    id
    email
  }
`
export const MeDocument = gql`
  query Me {
    me {
      id
      githubUsername
      avatarUrl
      createdAt
    }
  }
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>
export const MyApiKeysDocument = gql`
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

/**
 * __useMyApiKeysQuery__
 *
 * To run a query within a React component, call `useMyApiKeysQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyApiKeysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyApiKeysQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyApiKeysQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MyApiKeysQuery, MyApiKeysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<MyApiKeysQuery, MyApiKeysQueryVariables>(
    MyApiKeysDocument,
    options
  )
}
export function useMyApiKeysLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MyApiKeysQuery, MyApiKeysQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<MyApiKeysQuery, MyApiKeysQueryVariables>(
    MyApiKeysDocument,
    options
  )
}
export function useMyApiKeysSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<MyApiKeysQuery, MyApiKeysQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<MyApiKeysQuery, MyApiKeysQueryVariables>(
    MyApiKeysDocument,
    options
  )
}
export type MyApiKeysQueryHookResult = ReturnType<typeof useMyApiKeysQuery>
export type MyApiKeysLazyQueryHookResult = ReturnType<typeof useMyApiKeysLazyQuery>
export type MyApiKeysSuspenseQueryHookResult = ReturnType<typeof useMyApiKeysSuspenseQuery>
export type MyApiKeysQueryResult = ApolloReactCommon.QueryResult<
  MyApiKeysQuery,
  MyApiKeysQueryVariables
>
export const CreateApiKeyDocument = gql`
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
export type CreateApiKeyMutationFn = ApolloReactCommon.MutationFunction<
  CreateApiKeyMutation,
  CreateApiKeyMutationVariables
>

/**
 * __useCreateApiKeyMutation__
 *
 * To run a mutation, you first call `useCreateApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApiKeyMutation, { data, loading, error }] = useCreateApiKeyMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateApiKeyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateApiKeyMutation,
    CreateApiKeyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<CreateApiKeyMutation, CreateApiKeyMutationVariables>(
    CreateApiKeyDocument,
    options
  )
}
export type CreateApiKeyMutationHookResult = ReturnType<typeof useCreateApiKeyMutation>
export type CreateApiKeyMutationResult = ApolloReactCommon.MutationResult<CreateApiKeyMutation>
export type CreateApiKeyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateApiKeyMutation,
  CreateApiKeyMutationVariables
>
export const RevokeApiKeyDocument = gql`
  mutation RevokeAPIKey($id: ID!) {
    revokeAPIKey(id: $id)
  }
`
export type RevokeApiKeyMutationFn = ApolloReactCommon.MutationFunction<
  RevokeApiKeyMutation,
  RevokeApiKeyMutationVariables
>

/**
 * __useRevokeApiKeyMutation__
 *
 * To run a mutation, you first call `useRevokeApiKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeApiKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeApiKeyMutation, { data, loading, error }] = useRevokeApiKeyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRevokeApiKeyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RevokeApiKeyMutation,
    RevokeApiKeyMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<RevokeApiKeyMutation, RevokeApiKeyMutationVariables>(
    RevokeApiKeyDocument,
    options
  )
}
export type RevokeApiKeyMutationHookResult = ReturnType<typeof useRevokeApiKeyMutation>
export type RevokeApiKeyMutationResult = ApolloReactCommon.MutationResult<RevokeApiKeyMutation>
export type RevokeApiKeyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RevokeApiKeyMutation,
  RevokeApiKeyMutationVariables
>
export const GetExampleDocument = gql`
  query GetExample {
    example {
      ...ExampleFragment
    }
  }
  ${ExampleFragmentDoc}
`

/**
 * __useGetExampleQuery__
 *
 * To run a query within a React component, call `useGetExampleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExampleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExampleQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetExampleQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<GetExampleQuery, GetExampleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetExampleQuery, GetExampleQueryVariables>(
    GetExampleDocument,
    options
  )
}
export function useGetExampleLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetExampleQuery, GetExampleQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetExampleQuery, GetExampleQueryVariables>(
    GetExampleDocument,
    options
  )
}
export function useGetExampleSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<GetExampleQuery, GetExampleQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<GetExampleQuery, GetExampleQueryVariables>(
    GetExampleDocument,
    options
  )
}
export type GetExampleQueryHookResult = ReturnType<typeof useGetExampleQuery>
export type GetExampleLazyQueryHookResult = ReturnType<typeof useGetExampleLazyQuery>
export type GetExampleSuspenseQueryHookResult = ReturnType<typeof useGetExampleSuspenseQuery>
export type GetExampleQueryResult = ApolloReactCommon.QueryResult<
  GetExampleQuery,
  GetExampleQueryVariables
>
