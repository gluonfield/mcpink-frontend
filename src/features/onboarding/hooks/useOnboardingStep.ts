import { useNavigate } from '@tanstack/react-router'
import { useCallback, useContext, useEffect } from 'react'

import { getNextStep, getPreviousStep, ONBOARDING_STEPS, type OnboardingStep } from '../types'
import { OnboardingTransitionContext } from './OnboardingTransitionContext'

const ONBOARDING_STEP_KEY = 'onboarding_step'
const ONBOARDING_RETURN_KEY = 'onboarding_return'
const ONBOARDING_OAUTH_KEY = 'onboarding_oauth'

export function useOnboardingStep(currentStep: OnboardingStep) {
  const navigate = useNavigate()
  const transitionContext = useContext(OnboardingTransitionContext)

  useEffect(() => {
    localStorage.setItem(ONBOARDING_STEP_KEY, currentStep)
  }, [currentStep])

  const navigateWithTransition = useCallback(
    (path: string) => {
      const doNavigate = () => void navigate({ to: path })

      if (transitionContext?.triggerTransition) {
        transitionContext.triggerTransition(doNavigate)
      } else {
        doNavigate()
      }
    },
    [navigate, transitionContext]
  )

  const goToNext = useCallback(() => {
    const nextStep = getNextStep(currentStep)
    if (nextStep) {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === nextStep)
      if (stepConfig) {
        navigateWithTransition(stepConfig.path)
      }
    }
  }, [currentStep, navigateWithTransition])

  const goToPrevious = useCallback(() => {
    const prevStep = getPreviousStep(currentStep)
    if (prevStep) {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === prevStep)
      if (stepConfig) {
        navigateWithTransition(stepConfig.path)
      }
    }
  }, [currentStep, navigateWithTransition])

  const goToStep = useCallback(
    (step: OnboardingStep) => {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === step)
      if (stepConfig) {
        navigateWithTransition(stepConfig.path)
      }
    },
    [navigateWithTransition]
  )

  const setReturnStep = useCallback((step: OnboardingStep) => {
    localStorage.setItem(ONBOARDING_RETURN_KEY, step)
  }, [])

  const completeOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STEP_KEY)
    localStorage.removeItem(ONBOARDING_RETURN_KEY)

    const doNavigate = () => void navigate({ to: '/' })

    if (transitionContext?.triggerTransition) {
      transitionContext.triggerTransition(doNavigate)
    } else {
      doNavigate()
    }
  }, [navigate, transitionContext])

  return {
    currentStep,
    goToNext,
    goToPrevious,
    goToStep,
    setReturnStep,
    completeOnboarding,
    hasNext: getNextStep(currentStep) !== null,
    hasPrevious: getPreviousStep(currentStep) !== null
  }
}

export function getStoredOnboardingStep(): OnboardingStep | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ONBOARDING_STEP_KEY) as OnboardingStep | null
}

export function getOnboardingReturnStep(): OnboardingStep | null {
  if (typeof window === 'undefined') return null
  const step = localStorage.getItem(ONBOARDING_RETURN_KEY) as OnboardingStep | null
  if (step) {
    localStorage.removeItem(ONBOARDING_RETURN_KEY)
  }
  return step
}

export function clearOnboardingState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ONBOARDING_STEP_KEY)
  localStorage.removeItem(ONBOARDING_RETURN_KEY)
  localStorage.removeItem(ONBOARDING_OAUTH_KEY)
}

export function setOnboardingOAuthMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  if (enabled) {
    localStorage.setItem(ONBOARDING_OAUTH_KEY, 'true')
  } else {
    localStorage.removeItem(ONBOARDING_OAUTH_KEY)
  }
}

export function isOnboardingOAuthMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ONBOARDING_OAUTH_KEY) === 'true'
}
