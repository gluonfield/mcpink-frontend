import { motion } from 'framer-motion'

import { getStepIndex, ONBOARDING_STEPS, type OnboardingStep } from '../types'

interface OnboardingStepperProps {
  currentStep: OnboardingStep
}

export default function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const currentIndex = getStepIndex(currentStep)

  return (
    <div className="flex items-center justify-center gap-2">
      {ONBOARDING_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <motion.div
            key={step.id}
            initial={false}
            animate={{
              scale: isCurrent ? 1 : 0.8,
              opacity: isCompleted || isCurrent ? 1 : 0.3
            }}
            transition={{ duration: 0.2 }}
            className={`size-2 rounded-full ${
              isCompleted || isCurrent ? 'bg-white' : 'bg-white/30'
            }`}
          />
        )
      })}
    </div>
  )
}
