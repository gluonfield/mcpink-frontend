import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { useCallback, useEffect } from 'react'

import { firebaseAuth } from '@/features/auth/lib/firebase'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { logError } from '@/features/shared/utils/logger'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

interface CredentialResponse {
  credential: string
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string
    callback: (response: CredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
    itp_support?: boolean
    use_fedcm_for_prompt?: boolean
    context?: 'signin' | 'signup' | 'use'
    prompt_parent_id?: string
  }) => void
  prompt: () => void
  cancel: () => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId
      }
    }
  }
}

export default function GoogleOneTap() {
  const { user, loading } = useAuth()

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential)
      await signInWithCredential(firebaseAuth, credential)
    } catch (error) {
      logError('Google One Tap sign-in failed', error)
    }
  }, [])

  useEffect(() => {
    if (loading || user || !GOOGLE_CLIENT_ID) return

    const initializeOneTap = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        prompt_parent_id: 'google-one-tap',
        auto_select: true,
        cancel_on_tap_outside: false,
        itp_support: true,
        use_fedcm_for_prompt: true,
        context: 'signin'
      })
      window.google?.accounts.id.prompt()
    }

    if (window.google?.accounts?.id) {
      initializeOneTap()
      return () => {
        window.google?.accounts.id.cancel()
      }
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = initializeOneTap
    document.head.appendChild(script)

    return () => {
      window.google?.accounts.id.cancel()
    }
  }, [loading, user, handleCredentialResponse])

  return <div id="google-one-tap" className="fixed top-16 right-4 z-[100]" />
}
