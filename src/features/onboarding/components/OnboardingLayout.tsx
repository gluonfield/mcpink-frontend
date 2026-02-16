import { AnimatePresence, motion } from 'framer-motion'

import { useOnboardingTransition } from '../hooks'
import type { OnboardingStep } from '../types'

interface OnboardingLayoutProps {
  currentStep: OnboardingStep
  children: React.ReactNode
  wide?: boolean
}

const cardVariants = {
  enter: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  center: {
    opacity: 1,
    scale: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 1,
    y: 0
  }
}

export default function OnboardingLayout({
  currentStep,
  children,
  wide = false
}: OnboardingLayoutProps) {
  const { cardRef } = useOnboardingTransition()

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-transparent">
      <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8">
        <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <div
                ref={cardRef}
                className="onboarding-card relative rounded-lg border border-white/[0.08] bg-neutral-950/80 p-8 text-white shadow-2xl backdrop-blur-xl md:p-10"
              >
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
