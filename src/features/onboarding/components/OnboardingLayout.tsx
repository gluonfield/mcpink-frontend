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
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-transparent">
      {/* Content Overlay */}
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-8">
        {/* Card Container */}
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
              {/* Glass Card */}
              <div
                ref={cardRef}
                className="relative rounded-2xl border border-white/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl md:p-10"
              >
                {/* Inner glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative">{children}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
