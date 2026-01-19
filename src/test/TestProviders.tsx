/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockedProvider } from '@apollo/client/testing'
import { AuthProvider } from '@/features/auth'

interface TestProvidersProps {
  children: React.ReactNode
  mocks?: any[]
}

export default function TestProviders({ children, mocks = [] }: TestProvidersProps) {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthProvider>{children}</AuthProvider>
    </MockedProvider>
  )
}

export function SimpleTestWrapper({ children }: { children: React.ReactNode }) {
  return <TestProviders>{children}</TestProviders>
}
