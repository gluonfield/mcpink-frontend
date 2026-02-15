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
  Time: { input: string; output: string }
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

export type DeleteServiceResult = {
  __typename?: 'DeleteServiceResult'
  message: Scalars['String']['output']
  name: Scalars['String']['output']
  serviceId: Scalars['ID']['output']
}

export type EnvVar = {
  __typename?: 'EnvVar'
  key: Scalars['String']['output']
  value: Scalars['String']['output']
}

export type MetricDataPoint = {
  __typename?: 'MetricDataPoint'
  timestamp: Scalars['Time']['output']
  value: Scalars['Float']['output']
}

export type MetricSeries = {
  __typename?: 'MetricSeries'
  dataPoints: Array<MetricDataPoint>
  metric: Scalars['String']['output']
}

export type MetricTimeRange = 'ONE_HOUR' | 'SEVEN_DAYS' | 'SIX_HOURS' | 'THIRTY_DAYS'

export type Mutation = {
  __typename?: 'Mutation'
  createAPIKey: CreateApiKeyResult
  deleteService: DeleteServiceResult
  recheckGithubAppInstallation: Maybe<Scalars['String']['output']>
  revokeAPIKey: Scalars['Boolean']['output']
}

export type MutationCreateApiKeyArgs = {
  name: Scalars['String']['input']
}

export type MutationDeleteServiceArgs = {
  name: Scalars['String']['input']
  project?: InputMaybe<Scalars['String']['input']>
}

export type MutationRevokeApiKeyArgs = {
  id: Scalars['ID']['input']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor: Maybe<Scalars['String']['output']>
  hasNextPage: Scalars['Boolean']['output']
  hasPreviousPage: Scalars['Boolean']['output']
  startCursor: Maybe<Scalars['String']['output']>
}

export type Project = {
  __typename?: 'Project'
  createdAt: Scalars['Time']['output']
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
  ref: Scalars['String']['output']
  services: Array<Service>
  updatedAt: Scalars['Time']['output']
}

export type ProjectConnection = {
  __typename?: 'ProjectConnection'
  nodes: Array<Project>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type Query = {
  __typename?: 'Query'
  listProjects: ProjectConnection
  listResources: ResourceConnection
  listServices: ServiceConnection
  me: Maybe<User>
  myAPIKeys: Array<ApiKey>
  projectDetails: Maybe<Project>
  resourceDetails: Maybe<Resource>
  serviceDetails: Maybe<Service>
  serviceMetrics: ServiceMetrics
}

export type QueryListProjectsArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
}

export type QueryListResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
}

export type QueryListServicesArgs = {
  after?: InputMaybe<Scalars['String']['input']>
  first?: InputMaybe<Scalars['Int']['input']>
}

export type QueryProjectDetailsArgs = {
  id: Scalars['ID']['input']
}

export type QueryResourceDetailsArgs = {
  id: Scalars['ID']['input']
}

export type QueryServiceDetailsArgs = {
  id: Scalars['ID']['input']
}

export type QueryServiceMetricsArgs = {
  serviceId: Scalars['ID']['input']
  timeRange: MetricTimeRange
}

export type Resource = {
  __typename?: 'Resource'
  createdAt: Scalars['Time']['output']
  id: Scalars['ID']['output']
  metadata: Maybe<ResourceMetadata>
  name: Scalars['String']['output']
  project: Maybe<Project>
  projectId: Maybe<Scalars['ID']['output']>
  provider: Scalars['String']['output']
  region: Scalars['String']['output']
  status: Scalars['String']['output']
  type: Scalars['String']['output']
  updatedAt: Scalars['Time']['output']
}

export type ResourceConnection = {
  __typename?: 'ResourceConnection'
  nodes: Array<Resource>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type ResourceMetadata = {
  __typename?: 'ResourceMetadata'
  group: Maybe<Scalars['String']['output']>
  hostname: Maybe<Scalars['String']['output']>
  size: Maybe<Scalars['String']['output']>
}

export type Role = 'ADMIN' | 'USER'

export type Service = {
  __typename?: 'Service'
  branch: Scalars['String']['output']
  commitHash: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Time']['output']
  customDomain: Maybe<Scalars['String']['output']>
  customDomainStatus: Maybe<Scalars['String']['output']>
  envVars: Array<EnvVar>
  errorMessage: Maybe<Scalars['String']['output']>
  fqdn: Maybe<Scalars['String']['output']>
  gitProvider: Scalars['String']['output']
  id: Scalars['ID']['output']
  memory: Scalars['String']['output']
  name: Maybe<Scalars['String']['output']>
  port: Scalars['String']['output']
  project: Maybe<Project>
  projectId: Scalars['ID']['output']
  repo: Scalars['String']['output']
  status: ServiceStatus
  updatedAt: Scalars['Time']['output']
  vcpus: Scalars['String']['output']
}

export type ServiceConnection = {
  __typename?: 'ServiceConnection'
  nodes: Array<Service>
  pageInfo: PageInfo
  totalCount: Scalars['Int']['output']
}

export type ServiceMetrics = {
  __typename?: 'ServiceMetrics'
  cpuLimitVCPUs: Scalars['Float']['output']
  cpuUsage: MetricSeries
  memoryLimitMB: Scalars['Float']['output']
  memoryUsageMB: MetricSeries
  networkReceiveBytesPerSec: MetricSeries
  networkTransmitBytesPerSec: MetricSeries
}

export type ServiceStatus = {
  __typename?: 'ServiceStatus'
  build: Scalars['String']['output']
  runtime: Scalars['String']['output']
}

export type User = {
  __typename?: 'User'
  avatarUrl: Maybe<Scalars['String']['output']>
  createdAt: Scalars['Time']['output']
  displayName: Maybe<Scalars['String']['output']>
  email: Maybe<Scalars['String']['output']>
  githubAppInstallationId: Maybe<Scalars['String']['output']>
  githubScopes: Array<Scalars['String']['output']>
  githubUsername: Maybe<Scalars['String']['output']>
  id: Scalars['ID']['output']
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me:
    | {
        __typename?: 'User'
        id: string
        email: string | null | undefined
        displayName: string | null | undefined
        githubUsername: string | null | undefined
        avatarUrl: string | null | undefined
        createdAt: string
        githubAppInstallationId: string | null | undefined
        githubScopes: Array<string>
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
    lastUsedAt: string | null | undefined
    createdAt: string
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
    apiKey: { __typename?: 'APIKey'; id: string; name: string; prefix: string; createdAt: string }
  }
}

export type RevokeApiKeyMutationVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type RevokeApiKeyMutation = { __typename?: 'Mutation'; revokeAPIKey: boolean }

export type RecheckGithubAppInstallationMutationVariables = Exact<{ [key: string]: never }>

export type RecheckGithubAppInstallationMutation = {
  __typename?: 'Mutation'
  recheckGithubAppInstallation: string | null | undefined
}

export type ListProjectsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  after?: InputMaybe<Scalars['String']['input']>
}>

export type ListProjectsQuery = {
  __typename?: 'Query'
  listProjects: {
    __typename?: 'ProjectConnection'
    totalCount: number
    nodes: Array<{
      __typename?: 'Project'
      id: string
      name: string
      ref: string
      createdAt: string
      updatedAt: string
      services: Array<{
        __typename?: 'Service'
        id: string
        name: string | null | undefined
        status: { __typename?: 'ServiceStatus'; build: string; runtime: string }
      }>
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null | undefined
      endCursor: string | null | undefined
    }
  }
}

export type ProjectDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type ProjectDetailsQuery = {
  __typename?: 'Query'
  projectDetails:
    | {
        __typename?: 'Project'
        id: string
        name: string
        ref: string
        createdAt: string
        updatedAt: string
        services: Array<{
          __typename?: 'Service'
          id: string
          name: string | null | undefined
          repo: string
          branch: string
          errorMessage: string | null | undefined
          fqdn: string | null | undefined
          memory: string
          vcpus: string
          createdAt: string
          updatedAt: string
          status: { __typename?: 'ServiceStatus'; build: string; runtime: string }
        }>
      }
    | null
    | undefined
}

export type ListServicesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>
  after?: InputMaybe<Scalars['String']['input']>
}>

export type ListServicesQuery = {
  __typename?: 'Query'
  listServices: {
    __typename?: 'ServiceConnection'
    totalCount: number
    nodes: Array<{
      __typename?: 'Service'
      id: string
      name: string | null | undefined
      repo: string
      branch: string
      errorMessage: string | null | undefined
      fqdn: string | null | undefined
      memory: string
      vcpus: string
      createdAt: string
      updatedAt: string
      status: { __typename?: 'ServiceStatus'; build: string; runtime: string }
    }>
    pageInfo: {
      __typename?: 'PageInfo'
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string | null | undefined
      endCursor: string | null | undefined
    }
  }
}

export type ServiceDetailsQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type ServiceDetailsQuery = {
  __typename?: 'Query'
  serviceDetails:
    | {
        __typename?: 'Service'
        id: string
        name: string | null | undefined
        repo: string
        branch: string
        errorMessage: string | null | undefined
        fqdn: string | null | undefined
        port: string
        gitProvider: string
        commitHash: string | null | undefined
        memory: string
        vcpus: string
        customDomain: string | null | undefined
        customDomainStatus: string | null | undefined
        createdAt: string
        updatedAt: string
        status: { __typename?: 'ServiceStatus'; build: string; runtime: string }
        envVars: Array<{ __typename?: 'EnvVar'; key: string; value: string }>
      }
    | null
    | undefined
}

export type ServiceMetricsQueryVariables = Exact<{
  serviceId: Scalars['ID']['input']
  timeRange: MetricTimeRange
}>

export type ServiceMetricsQuery = {
  __typename?: 'Query'
  serviceMetrics: {
    __typename?: 'ServiceMetrics'
    memoryLimitMB: number
    cpuLimitVCPUs: number
    cpuUsage: {
      __typename?: 'MetricSeries'
      metric: string
      dataPoints: Array<{ __typename?: 'MetricDataPoint'; timestamp: string; value: number }>
    }
    memoryUsageMB: {
      __typename?: 'MetricSeries'
      metric: string
      dataPoints: Array<{ __typename?: 'MetricDataPoint'; timestamp: string; value: number }>
    }
    networkReceiveBytesPerSec: {
      __typename?: 'MetricSeries'
      metric: string
      dataPoints: Array<{ __typename?: 'MetricDataPoint'; timestamp: string; value: number }>
    }
    networkTransmitBytesPerSec: {
      __typename?: 'MetricSeries'
      metric: string
      dataPoints: Array<{ __typename?: 'MetricDataPoint'; timestamp: string; value: number }>
    }
  }
}

export const MeDocument = gql`
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
export const RecheckGithubAppInstallationDocument = gql`
  mutation RecheckGithubAppInstallation {
    recheckGithubAppInstallation
  }
`
export type RecheckGithubAppInstallationMutationFn = ApolloReactCommon.MutationFunction<
  RecheckGithubAppInstallationMutation,
  RecheckGithubAppInstallationMutationVariables
>

/**
 * __useRecheckGithubAppInstallationMutation__
 *
 * To run a mutation, you first call `useRecheckGithubAppInstallationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRecheckGithubAppInstallationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [recheckGithubAppInstallationMutation, { data, loading, error }] = useRecheckGithubAppInstallationMutation({
 *   variables: {
 *   },
 * });
 */
export function useRecheckGithubAppInstallationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RecheckGithubAppInstallationMutation,
    RecheckGithubAppInstallationMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RecheckGithubAppInstallationMutation,
    RecheckGithubAppInstallationMutationVariables
  >(RecheckGithubAppInstallationDocument, options)
}
export type RecheckGithubAppInstallationMutationHookResult = ReturnType<
  typeof useRecheckGithubAppInstallationMutation
>
export type RecheckGithubAppInstallationMutationResult =
  ApolloReactCommon.MutationResult<RecheckGithubAppInstallationMutation>
export type RecheckGithubAppInstallationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RecheckGithubAppInstallationMutation,
  RecheckGithubAppInstallationMutationVariables
>
export const ListProjectsDocument = gql`
  query ListProjects($first: Int, $after: String) {
    listProjects(first: $first, after: $after) {
      nodes {
        id
        name
        ref
        services {
          id
          name
          status {
            build
            runtime
          }
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

/**
 * __useListProjectsQuery__
 *
 * To run a query within a React component, call `useListProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListProjectsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useListProjectsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ListProjectsQuery, ListProjectsQueryVariables>(
    ListProjectsDocument,
    options
  )
}
export function useListProjectsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ListProjectsQuery, ListProjectsQueryVariables>(
    ListProjectsDocument,
    options
  )
}
export function useListProjectsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ListProjectsQuery, ListProjectsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ListProjectsQuery, ListProjectsQueryVariables>(
    ListProjectsDocument,
    options
  )
}
export type ListProjectsQueryHookResult = ReturnType<typeof useListProjectsQuery>
export type ListProjectsLazyQueryHookResult = ReturnType<typeof useListProjectsLazyQuery>
export type ListProjectsSuspenseQueryHookResult = ReturnType<typeof useListProjectsSuspenseQuery>
export type ListProjectsQueryResult = ApolloReactCommon.QueryResult<
  ListProjectsQuery,
  ListProjectsQueryVariables
>
export const ProjectDetailsDocument = gql`
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
        status {
          build
          runtime
        }
        errorMessage
        fqdn
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

/**
 * __useProjectDetailsQuery__
 *
 * To run a query within a React component, call `useProjectDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectDetailsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ProjectDetailsQuery,
    ProjectDetailsQueryVariables
  > &
    ({ variables: ProjectDetailsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ProjectDetailsQuery, ProjectDetailsQueryVariables>(
    ProjectDetailsDocument,
    options
  )
}
export function useProjectDetailsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ProjectDetailsQuery,
    ProjectDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ProjectDetailsQuery, ProjectDetailsQueryVariables>(
    ProjectDetailsDocument,
    options
  )
}
export function useProjectDetailsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ProjectDetailsQuery, ProjectDetailsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ProjectDetailsQuery, ProjectDetailsQueryVariables>(
    ProjectDetailsDocument,
    options
  )
}
export type ProjectDetailsQueryHookResult = ReturnType<typeof useProjectDetailsQuery>
export type ProjectDetailsLazyQueryHookResult = ReturnType<typeof useProjectDetailsLazyQuery>
export type ProjectDetailsSuspenseQueryHookResult = ReturnType<
  typeof useProjectDetailsSuspenseQuery
>
export type ProjectDetailsQueryResult = ApolloReactCommon.QueryResult<
  ProjectDetailsQuery,
  ProjectDetailsQueryVariables
>
export const ListServicesDocument = gql`
  query ListServices($first: Int, $after: String) {
    listServices(first: $first, after: $after) {
      nodes {
        id
        name
        repo
        branch
        status {
          build
          runtime
        }
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

/**
 * __useListServicesQuery__
 *
 * To run a query within a React component, call `useListServicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListServicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListServicesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useListServicesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<ListServicesQuery, ListServicesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ListServicesQuery, ListServicesQueryVariables>(
    ListServicesDocument,
    options
  )
}
export function useListServicesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ListServicesQuery, ListServicesQueryVariables>(
    ListServicesDocument,
    options
  )
}
export function useListServicesSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ListServicesQuery, ListServicesQueryVariables>(
    ListServicesDocument,
    options
  )
}
export type ListServicesQueryHookResult = ReturnType<typeof useListServicesQuery>
export type ListServicesLazyQueryHookResult = ReturnType<typeof useListServicesLazyQuery>
export type ListServicesSuspenseQueryHookResult = ReturnType<typeof useListServicesSuspenseQuery>
export type ListServicesQueryResult = ApolloReactCommon.QueryResult<
  ListServicesQuery,
  ListServicesQueryVariables
>
export const ServiceDetailsDocument = gql`
  query ServiceDetails($id: ID!) {
    serviceDetails(id: $id) {
      id
      name
      repo
      branch
      status {
        build
        runtime
      }
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

/**
 * __useServiceDetailsQuery__
 *
 * To run a query within a React component, call `useServiceDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useServiceDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServiceDetailsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useServiceDetailsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ServiceDetailsQuery,
    ServiceDetailsQueryVariables
  > &
    ({ variables: ServiceDetailsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ServiceDetailsQuery, ServiceDetailsQueryVariables>(
    ServiceDetailsDocument,
    options
  )
}
export function useServiceDetailsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ServiceDetailsQuery,
    ServiceDetailsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ServiceDetailsQuery, ServiceDetailsQueryVariables>(
    ServiceDetailsDocument,
    options
  )
}
export function useServiceDetailsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ServiceDetailsQuery, ServiceDetailsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ServiceDetailsQuery, ServiceDetailsQueryVariables>(
    ServiceDetailsDocument,
    options
  )
}
export type ServiceDetailsQueryHookResult = ReturnType<typeof useServiceDetailsQuery>
export type ServiceDetailsLazyQueryHookResult = ReturnType<typeof useServiceDetailsLazyQuery>
export type ServiceDetailsSuspenseQueryHookResult = ReturnType<
  typeof useServiceDetailsSuspenseQuery
>
export type ServiceDetailsQueryResult = ApolloReactCommon.QueryResult<
  ServiceDetailsQuery,
  ServiceDetailsQueryVariables
>
export const ServiceMetricsDocument = gql`
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

/**
 * __useServiceMetricsQuery__
 *
 * To run a query within a React component, call `useServiceMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useServiceMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServiceMetricsQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *      timeRange: // value for 'timeRange'
 *   },
 * });
 */
export function useServiceMetricsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ServiceMetricsQuery,
    ServiceMetricsQueryVariables
  > &
    ({ variables: ServiceMetricsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ServiceMetricsQuery, ServiceMetricsQueryVariables>(
    ServiceMetricsDocument,
    options
  )
}
export function useServiceMetricsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ServiceMetricsQuery,
    ServiceMetricsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ServiceMetricsQuery, ServiceMetricsQueryVariables>(
    ServiceMetricsDocument,
    options
  )
}
export function useServiceMetricsSuspenseQuery(
  baseOptions?:
    | ApolloReactHooks.SkipToken
    | ApolloReactHooks.SuspenseQueryHookOptions<ServiceMetricsQuery, ServiceMetricsQueryVariables>
) {
  const options =
    baseOptions === ApolloReactHooks.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useSuspenseQuery<ServiceMetricsQuery, ServiceMetricsQueryVariables>(
    ServiceMetricsDocument,
    options
  )
}
export type ServiceMetricsQueryHookResult = ReturnType<typeof useServiceMetricsQuery>
export type ServiceMetricsLazyQueryHookResult = ReturnType<typeof useServiceMetricsLazyQuery>
export type ServiceMetricsSuspenseQueryHookResult = ReturnType<
  typeof useServiceMetricsSuspenseQuery
>
export type ServiceMetricsQueryResult = ApolloReactCommon.QueryResult<
  ServiceMetricsQuery,
  ServiceMetricsQueryVariables
>
