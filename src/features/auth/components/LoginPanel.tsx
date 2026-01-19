import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginButton from '@/features/auth/components/LoginButton'

export default function LoginPanel() {
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, rgb(var(--background-rgb)) 0%, rgba(var(--background-rgb), 0.95) 20%, rgba(var(--background-rgb), 0.7) 40%, transparent 70%)'
        }}
      />

      <Card className="relative z-10 w-full max-w-sm border-border/50 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Welcome to MCP Deploy
          </CardTitle>
          <CardDescription>Deploy MCP servers with ease</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginButton />
          <p className="text-center text-xs text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
