import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/get-started')({
  component: GetStartedPage
})

export default function GetStartedPage() {
  return <Navigate to="/onboarding/welcome" />
}
