import { CaretDown, Info } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface TechnicalToggleProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function TechnicalToggle({ title, children, className }: TechnicalToggleProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('rounded-lg border border-border/50 bg-muted/30', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Info className="size-4 shrink-0" />
        <span className="flex-1">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <CaretDown className="size-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/50 px-4 py-3 text-sm text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
