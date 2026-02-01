import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/get-started')({
  component: GetStartedPage
})

export default function GetStartedPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Get Started</h1>
        <p className="mt-1.5 text-muted-foreground">Learn how to deploy your first MCP server.</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>Coming soon...</p>
      </div>
    </div>
  )
}
