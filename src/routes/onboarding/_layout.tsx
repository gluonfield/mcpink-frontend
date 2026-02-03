import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { OnboardingTransitionProvider, WebGLTransitionBackground } from '@/features/onboarding'
import type { OnboardingStep } from '@/features/onboarding/types'

export const Route = createFileRoute('/onboarding/_layout')({
  component: OnboardingLayout
})

// Map route paths to step IDs
function getStepFromPath(pathname: string): OnboardingStep {
  if (pathname.includes('mode-select')) return 'mode-select'
  if (pathname.includes('github-app')) return 'github-app'
  if (pathname.includes('github-repo')) return 'github-repo'
  if (pathname.includes('agent-key')) return 'agent-key'
  if (pathname.includes('complete')) return 'complete'
  return 'welcome'
}

export default function OnboardingLayout() {
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(() =>
    getStepFromPath(location.pathname)
  )
  const [previousStep, setPreviousStep] = useState<OnboardingStep | null>(null)
  const lastPathRef = useRef(location.pathname)

  // Track route changes and update steps
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      const newStep = getStepFromPath(location.pathname)
      const oldStep = getStepFromPath(lastPathRef.current)

      if (newStep !== oldStep) {
        setPreviousStep(oldStep)
        setCurrentStep(newStep)
      }

      lastPathRef.current = location.pathname
    }
  }, [location.pathname])

  return (
    <OnboardingTransitionProvider>
      <WebGLTransitionBackground currentStep={currentStep} previousStep={previousStep} />
      {/* Subtle dim overlay */}
      <div className="fixed inset-0 z-[1] bg-black/50" />
      <div className="relative z-10 min-h-screen">
        <Outlet />
      </div>
    </OnboardingTransitionProvider>
  )
}
