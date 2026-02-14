export { default as AnimatedBackground } from './components/AnimatedBackground'
export { default as AnimatedCheckmark } from './components/AnimatedCheckmark'
export { default as OnboardingLayout } from './components/OnboardingLayout'
export { default as TechnicalToggle } from './components/TechnicalToggle'
export { default as WebGLTransitionBackground } from './components/WebGLTransitionBackground'
export { OnboardingTransitionProvider } from './hooks/OnboardingTransitionContext'
export {
  clearOnboardingState,
  getOnboardingReturnStep,
  getStoredOnboardingStep,
  isOnboardingOAuthMode,
  setOnboardingOAuthMode,
  useOnboardingStep
} from './hooks/useOnboardingStep'
export { fireConfetti } from './lib/confetti'
export { ONBOARDING_STEPS } from './types'
export type { OnboardingStep } from './types'
