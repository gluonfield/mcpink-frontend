import { AnimatePresence, motion } from 'framer-motion'

import type { OnboardingStep } from '../types'
import OnboardingStepper from './OnboardingStepper'

interface OnboardingLayoutProps {
  currentStep: OnboardingStep
  children: React.ReactNode
  wide?: boolean
}

const cardVariants = {
  enter: {
    rotateY: 15,
    x: 100,
    opacity: 0,
    scale: 0.95
  },
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: {
    rotateY: -15,
    x: -100,
    opacity: 0,
    scale: 0.95
  }
}

export default function OnboardingLayout({
  currentStep,
  children,
  wide = false
}: OnboardingLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-transparent">
      {/* Content Overlay */}
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-8">
        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <OnboardingStepper currentStep={currentStep} />
        </motion.div>

        {/* 3D Perspective Card Container */}
        <div
          className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}
          style={{ perspective: '1200px' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Glass Card */}
              <div className="relative rounded-2xl border border-white/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl md:p-10">
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
