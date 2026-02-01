import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

interface AnimatedCheckmarkProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export default function AnimatedCheckmark({
  checked,
  onChange,
  label,
  className
}: AnimatedCheckmarkProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50',
        checked && 'border-primary/50 bg-primary/5',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <motion.div
          className={cn(
            'flex size-5 items-center justify-center rounded border-2 transition-colors',
            checked ? 'border-primary bg-primary' : 'border-muted-foreground/50 bg-background'
          )}
          animate={{ scale: checked ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="size-3 text-primary-foreground"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: checked ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}
