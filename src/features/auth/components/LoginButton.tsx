import { GithubLogoIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'

export default function LoginButton() {
  const { signIn, loading } = useAuth()

  return (
    <Button onClick={signIn} disabled={loading} size="lg" className="w-full gap-2">
      <GithubLogoIcon weight="fill" className="size-5" />
      <span>{loading ? 'Signing in...' : 'SGet Started'}</span>
    </Button>
  )
}
