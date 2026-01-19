import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Header from '@/features/shared/components/Header'
import TestProviders from '@/test/TestProviders'

// Mock TanStack Router Link component
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
  )
}))

describe('Header', () => {
  it('renders navigation links', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('has correct navigation structure', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('flex', 'items-center', 'gap-1')
  })

  it('shows sign in link when user is not authenticated', () => {
    render(
      <TestProviders>
        <Header />
      </TestProviders>
    )

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument()
  })
})
