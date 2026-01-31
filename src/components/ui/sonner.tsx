import { CheckCircle, Info, Spinner, Warning, XCircle } from '@phosphor-icons/react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

export default function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" weight="fill" />,
        info: <Info className="size-4" weight="fill" />,
        warning: <Warning className="size-4" weight="fill" />,
        error: <XCircle className="size-4" weight="fill" />,
        loading: <Spinner className="size-4 animate-spin" />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
