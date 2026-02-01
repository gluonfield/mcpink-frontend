import { Check } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

import { getStepIndex, ONBOARDING_STEPS, type OnboardingStep } from '../types'
import { cn } from '@/lib/utils'

interface OnboardingStepperProps {
  currentStep: OnboardingStep
}

const AMBER_COLOR = '#f59e0b'

export default function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const currentIndex = getStepIndex(currentStep)

  return (
    <div className="flex items-center justify-center gap-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md">
      {ONBOARDING_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isLast = index === ONBOARDING_STEPS.length - 1

        return (
          <div key={step.id} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: isCurrent ? 1 : 0.85,
                opacity: isCompleted || isCurrent ? 1 : 0.4
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative"
            >
              {/* Glow effect for current step - amber only */}
              {isCurrent && (
                <motion.div
                  layoutId="step-glow"
                  className="absolute -inset-1 rounded-full opacity-50 blur-md"
                  style={{ backgroundColor: AMBER_COLOR }}
                  transition={{ duration: 0.5 }}
                />
              )}

              <motion.div
                className={cn(
                  'relative flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && 'text-white',
                  !isCompleted && !isCurrent && 'bg-white/10 text-white/50'
                )}
                style={{
                  backgroundColor: isCurrent ? AMBER_COLOR : undefined
                }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Check className="size-4" weight="bold" />
                  </motion.div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
            </motion.div>

            {/* Connector line */}
            {!isLast && (
              <div className="relative mx-1 h-0.5 w-6 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={false}
                  animate={{
                    width: isCompleted ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 bg-green-500"
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
