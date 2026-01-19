# Claude AI Assistant Rules

## Project Context

This is a TanStack Start project with React, TypeScript, Tailwind CSS v4, ESLint, Prettier, and Vitest.

## Key Rules to Remember

- ✅ Always use `export default function ComponentName() {}`
- ✅ Use `@/` imports, never relative `../`
- ✅ Organize features in `src/features/feature-name/`
- ✅ No `any` types, prefer `unknown`
- ✅ Alphabetical import ordering
- ✅ Use pnpm only, never npm/yarn

## Development Guidelines

### 🚨 Code Quality Workflow (MANDATORY)

**ALWAYS run these commands after making significant changes:**

```bash
pnpm typecheck  # ✅ CRITICAL - Check TypeScript errors
pnpm lint       # ✅ CRITICAL - Fix code quality issues
pnpm test       # ✅ CRITICAL - Ensure tests pass
```

**Pre-commit hooks will enforce these automatically, but run manually during development!**

### Code Style

- Follow the ESLint and Prettier configurations
- Use single quotes for strings
- No trailing commas (updated config)
- 2-space indentation
- 100 character line width

### React Patterns

- Functional components only
- Use hooks for state management
- Prefer composition over inheritance
- Keep components small and focused

### File Organization

```
src/
├── features/
│   ├── shared/           # Shared components, hooks, utils
│   │   ├── components/
│   │   └── graphql/      # GraphQL setup and operations
│   │       ├── client.ts
│   │       ├── codegen.ts
│   │       ├── operations.ts
│   │       ├── schema.graphqls
│   │       ├── graphql.ts (generated)
│   │       └── index.ts
│   └── feature-name/     # Feature-specific code
│       ├── index.ts      # Exports all feature modules
│       ├── types.ts      # Feature types (directly in root)
│       ├── components/
│       ├── hooks/        # Includes context providers
│       ├── lib/          # Configuration and utilities
│       └── utils/
├── routes/               # TanStack Router routes
├── test/                 # Test utilities and setup
└── styles.css           # Global styles
```

### Feature Export Pattern

Each feature should have an `index.ts` file that exports all public modules:

```typescript
// src/features/feature-name/index.ts
export * from './components'
export * from './hooks'
export * from './types'
export * from './utils'
export { default as FeatureProvider } from './context/FeatureProvider'
```

This allows clean imports from other parts of the application:

```typescript
import { useFeature, FeatureComponent, FeatureProvider } from '@/features/feature-name'
```

### Import Organization

1. External libraries (React, TanStack, etc.)
2. Internal modules using `@/` prefix
3. Relative imports only for same directory

### TypeScript Best Practices

- Explicit return types for functions
- Interface over type when possible
- Use `unknown` instead of `any`
- Proper error handling with typed errors

### Testing Strategy

- Unit tests for utilities and hooks
- Integration tests for components
- Use React Testing Library patterns
- Mock external dependencies

## Commands Reference

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm typecheck` - Run TypeScript checks
- `pnpm lint` - Run ESLint with fixes
- `pnpm format` - Format code with Prettier

## Tools Configured

- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **Tailwind CSS v4** - Utility-first CSS
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing framework
- **Husky** - Git hooks for code quality
