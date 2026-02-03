export type OnboardingStep =
  | 'welcome'
  | 'mode-select'
  | 'github-app'
  | 'github-repo'
  | 'agent-key'
  | 'complete'

export interface OnboardingStepConfig {
  id: OnboardingStep
  title: string
  description: string
  path: string
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with your setup',
    path: '/onboarding/welcome'
  },
  {
    id: 'mode-select',
    title: 'Choose Mode',
    description: 'Select your deployment mode',
    path: '/onboarding/mode-select'
  },
  {
    id: 'github-app',
    title: 'Github App',
    description: 'Connect your repositories',
    path: '/onboarding/github-app'
  },
  {
    id: 'github-repo',
    title: 'Repo Access',
    description: 'Optional repository permissions',
    path: '/onboarding/github-repo'
  },
  {
    id: 'agent-key',
    title: 'Agent Key',
    description: 'Create your first key',
    path: '/onboarding/agent-key'
  },
  {
    id: 'complete',
    title: 'Complete',
    description: "You're all set!",
    path: '/onboarding/complete'
  }
]

export function getStepIndex(step: OnboardingStep): number {
  return ONBOARDING_STEPS.findIndex(s => s.id === step)
}

export function getNextStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStep)
  if (currentIndex < ONBOARDING_STEPS.length - 1) {
    return ONBOARDING_STEPS[currentIndex + 1].id
  }
  return null
}

export function getPreviousStep(currentStep: OnboardingStep): OnboardingStep | null {
  const currentIndex = getStepIndex(currentStep)
  if (currentIndex > 0) {
    return ONBOARDING_STEPS[currentIndex - 1].id
  }
  return null
}
