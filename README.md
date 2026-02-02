# Template Frontend

Where the best agents are forged.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

## 📦 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Router**: [TanStack Router](https://tanstack.com/router) - Type-safe routing
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Code Quality**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged)

## 🛠️ Development Commands

### Core Commands

```bash
pnpm dev              # Start development server (port 3000)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm serve            # Preview production build
```

### Code Quality

```bash
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint with auto-fix
pnpm lint:check       # Run ESLint without fixing
pnpm format           # Format code with Prettier
pnpm format:check     # Check Prettier formatting
```

### Testing

```bash
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Run tests with coverage report
```

## 🏗️ Project Structure

```
src/
├── features/              # Feature-based organization
│   ├── shared/           # Shared components, hooks, utils
│   │   └── components/   # Reusable UI components
│   └── feature-name/     # Feature-specific code
│       ├── components/   # Feature components
│       ├── hooks/        # Feature hooks
│       ├── types/        # Feature types
│       └── utils/        # Feature utilities
├── routes/               # TanStack Router file-based routes
├── test/                 # Test setup and utilities
└── styles.css           # Global styles
```

## 📝 Development Guidelines

### Code Style

- **Components**: Use `export default function ComponentName() {}`
- **Imports**: Always use `@/` absolute imports, never relative `../`
- **Types**: Prefer `unknown` over `any`
- **Formatting**: Single quotes, no semicolons, trailing commas

### Import Organization

```tsx
// 1. External libraries
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

// 2. Internal modules with @/ prefix
import Header from '@/features/shared/components/Header'
import { useAuth } from '@/features/auth/hooks/useAuth'
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `Header.tsx`)
- **Hooks**: `camelCase.ts` starting with `use` (e.g., `useAuth.ts`)
- **Utils**: `camelCase.ts` (e.g., `formatDate.ts`)
- **Types**: `camelCase.types.ts` (e.g., `user.types.ts`)
- **Tests**: `ComponentName.test.tsx` or in `__tests__/` folders

## 🧪 Testing Strategy

### Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '@/features/shared/components/Header'

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
```

### Test Organization

- Unit tests for utilities and hooks
- Integration tests for components
- Place tests in `__tests__/` folders or use `.test.tsx` suffix
- Mock external dependencies appropriately

## 🔧 Code Quality Automation

### Pre-commit Hooks

Every commit automatically runs:

1. **Type checking** - Ensures TypeScript compilation
2. **Tests** - Runs full test suite
3. **Linting** - ESLint with auto-fix
4. **Formatting** - Prettier code formatting

### ESLint Rules

- React Hooks dependency checking
- Import order enforcement
- TypeScript strict rules
- Unused variable detection
- Floating promise detection

## 🚀 Deployment

### Build Process

```bash
pnpm build    # Creates optimized production build
pnpm start    # Serves production build
```

### Environment Setup

- **Node.js**: >=22.12.0
- **Package Manager**: pnpm >=8.0.0

## 🔍 Troubleshooting

### Common Issues

**TypeScript Errors**

```bash
pnpm typecheck  # Check for type errors
```

**Linting Issues**

```bash
pnpm lint       # Auto-fix most issues
pnpm lint:check # See all issues
```

**Test Failures**

```bash
pnpm test:watch # Debug in watch mode
pnpm test:ui    # Use visual test runner
```

**Import Errors**

- Always use `@/` for absolute imports
- Check `tsconfig.json` paths configuration
- Restart TypeScript server in VS Code

## 📚 Learn More

### TanStack Ecosystem

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)

### Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Inspiration

- https://tympanus.net/codrops/2019/11/05/creative-webgl-image-transitions/
- https://tympanus.net/Development/SlideshowAnimations/index11.html
- https://freefrontend.com/javascript-scroll-effects/
- https://www.sliderrevolution.com/templates/portal-effect-hero-slider/
