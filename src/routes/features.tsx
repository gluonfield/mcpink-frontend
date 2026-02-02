import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features')({
  component: FeaturesPage
})

export default function FeaturesPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Features</h1>
        <p className="text-muted-foreground text-lg">TBD</p>
      </div>
    </div>
  )
}
