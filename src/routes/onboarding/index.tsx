import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingIndexPage
})

export default function OnboardingIndexPage() {
  return <Navigate to="/onboarding/welcome" />
}
