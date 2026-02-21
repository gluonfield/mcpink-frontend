import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Header from '@/features/shared/components/Header'
import TestProviders from '@/test/TestProviders'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className
  }: {
    children: React.ReactNode
    to: string
    className?: string
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' })
}))

describe('Header', () => {
  it('renders logo', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    expect(screen.getByAltText('ink')).toBeInTheDocument()
  })

  it('has correct navigation structure', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('shows navigation links when user is not authenticated', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
  })
})
