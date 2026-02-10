import { GoogleLogo } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'

export default function LoginButton() {
  const { signIn, loading } = useAuth()

  return (
    <Button onClick={signIn} disabled={loading} size="lg" className="w-full gap-2">
      <GoogleLogo weight="bold" className="size-5" />
      <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
    </Button>
  )
}
