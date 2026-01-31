import { useMutation } from '@apollo/client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { ME_QUERY, RECHECK_GITHUB_APP_MUTATION } from '@/features/shared/graphql/operations'

export const Route = createFileRoute('/githubapp/success')({
  component: GitHubAppSuccessPage
})

export default function GitHubAppSuccessPage() {
  const navigate = useNavigate()
  const [recheckInstallation] = useMutation(RECHECK_GITHUB_APP_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
    awaitRefetchQueries: true
  })

  useEffect(() => {
    const handleInstallation = async () => {
      await recheckInstallation()
      void navigate({ to: '/settings/access' })
    }
    void handleInstallation()
  }, [recheckInstallation, navigate])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <Spinner className="h-6 w-6" />
    </div>
  )
}
