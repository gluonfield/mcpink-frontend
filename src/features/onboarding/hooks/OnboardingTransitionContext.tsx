import React, { createContext, useCallback, useContext, useRef, useState } from 'react'

import { useDisintegrate } from './useDisintegrate'

interface OnboardingTransitionContextValue {
  cardRef: React.RefObject<HTMLDivElement | null>
  isTransitioning: boolean
  triggerTransition: (onNavigate: () => void) => void
}

export const OnboardingTransitionContext = createContext<OnboardingTransitionContextValue | null>(
  null
)

export function OnboardingTransitionProvider({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { disintegrate } = useDisintegrate()
  const pendingNavigateRef = useRef<(() => void) | null>(null)

  const triggerTransition = useCallback(
    (onNavigate: () => void) => {
      if (isTransitioning) {
        pendingNavigateRef.current = onNavigate
        return
      }

      const card = cardRef.current
      if (!card) {
        onNavigate()
        return
      }

      setIsTransitioning(true)

      // Small delay to ensure React has finished any pending renders
      requestAnimationFrame(() => {
        void disintegrate(card, {
          duration: 800,
          onComplete: () => {
            onNavigate()
            setTimeout(() => {
              setIsTransitioning(false)
              if (pendingNavigateRef.current) {
                const pending = pendingNavigateRef.current
                pendingNavigateRef.current = null
                pending()
              }
            }, 50)
          }
        })
      })
    },
    [disintegrate, isTransitioning]
  )

  return (
    <OnboardingTransitionContext.Provider value={{ cardRef, isTransitioning, triggerTransition }}>
      {children}
    </OnboardingTransitionContext.Provider>
  )
}

export function useOnboardingTransition() {
  const context = useContext(OnboardingTransitionContext)
  if (!context) {
    throw new Error('useOnboardingTransition must be used within OnboardingTransitionProvider')
  }
  return context
}
