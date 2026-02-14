import { Component } from 'react'

import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      )
    }

    return this.props.children
  }
}
