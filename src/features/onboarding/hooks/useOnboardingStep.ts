import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect } from 'react'

import { getNextStep, getPreviousStep, ONBOARDING_STEPS, type OnboardingStep } from '../types'

const ONBOARDING_STEP_KEY = 'onboarding_step'
const ONBOARDING_RETURN_KEY = 'onboarding_return'

export function useOnboardingStep(currentStep: OnboardingStep) {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem(ONBOARDING_STEP_KEY, currentStep)
  }, [currentStep])

  const goToNext = useCallback(() => {
    const nextStep = getNextStep(currentStep)
    if (nextStep) {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === nextStep)
      if (stepConfig) {
        void navigate({ to: stepConfig.path })
      }
    }
  }, [currentStep, navigate])

  const goToPrevious = useCallback(() => {
    const prevStep = getPreviousStep(currentStep)
    if (prevStep) {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === prevStep)
      if (stepConfig) {
        void navigate({ to: stepConfig.path })
      }
    }
  }, [currentStep, navigate])

  const goToStep = useCallback(
    (step: OnboardingStep) => {
      const stepConfig = ONBOARDING_STEPS.find(s => s.id === step)
      if (stepConfig) {
        void navigate({ to: stepConfig.path })
      }
    },
    [navigate]
  )

  const setReturnStep = useCallback((step: OnboardingStep) => {
    localStorage.setItem(ONBOARDING_RETURN_KEY, step)
  }, [])

  const completeOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STEP_KEY)
    localStorage.removeItem(ONBOARDING_RETURN_KEY)
    void navigate({ to: '/' })
  }, [navigate])

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
}
