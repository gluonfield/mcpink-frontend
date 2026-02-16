import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { useCallback, useEffect, useRef } from 'react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { firebaseAuth } from '@/features/auth/lib/firebase'
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
  disableAutoSelect: () => void
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
  const hadUserRef = useRef(false)

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    try {
      const credential = GoogleAuthProvider.credential(response.credential)
      await signInWithCredential(firebaseAuth, credential)
    } catch (error) {
      logError('Google One Tap sign-in failed', error)
    }
  }, [])

  // Cancel prompt when user becomes authenticated
  useEffect(() => {
    if (user) {
      hadUserRef.current = true
      window.google?.accounts.id.cancel()
    }
  }, [user])

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      window.google?.accounts.id.cancel()
    }
  }, [])

  // Show prompt when unauthenticated
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
      // After sign-out, disable auto-select so the prompt shows the account picker
      // instead of silently trying (and failing) to auto-sign-in
      if (hadUserRef.current) {
        window.google?.accounts.id.disableAutoSelect()
        hadUserRef.current = false
      }
      window.google?.accounts.id.prompt()
    }

    if (window.google?.accounts?.id) {
      initializeOneTap()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = initializeOneTap
    document.head.appendChild(script)
  }, [loading, user, handleCredentialResponse])

  return <div id="google-one-tap" className="fixed top-16 right-4 z-[100]" />
}
