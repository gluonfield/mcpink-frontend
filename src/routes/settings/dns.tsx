import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/settings/dns')({
  beforeLoad: () => {
    throw redirect({ to: '/dns' })
  },
  component: () => null
})
