import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/features/shared/graphql/schema.graphqls',
  documents: ['src/features/shared/graphql/operations.ts'],
  generates: {
    'src/features/shared/graphql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: false,
        enumsAsTypes: true,
        dedupeOperationSuffix: true,
        omitOperationSuffix: false,
        gqlImport: '@apollo/client#gql',
        apolloReactHooksImportFrom: '@apollo/client',
        apolloReactCommonImportFrom: '@apollo/client',
        reactApolloVersion: 3,
        addDocBlocks: true,
        maybeValue: 'T | null | undefined',
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false
        },
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
          Time: 'string'
        }
      }
    }
  },
  ignoreNoDocuments: true
}

export default config
