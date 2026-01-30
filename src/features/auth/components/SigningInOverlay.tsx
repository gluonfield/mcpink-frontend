import { GithubLogo } from '@phosphor-icons/react'

import { Spinner } from '@/components/ui/spinner'

interface SigningInOverlayProps {
  visible: boolean
}

export function SigningInOverlay({ visible }: SigningInOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="flex items-center justify-center size-16 rounded-full bg-card border border-border shadow-lg">
          <GithubLogo weight="fill" className="size-8 text-foreground" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="size-4" />
          <span>Connecting to GitHub...</span>
        </div>
      </div>
    </div>
  )
}
