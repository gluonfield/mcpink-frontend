import { List, X } from '@phosphor-icons/react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAuth, UserProfile } from '@/features/auth'
import ProjectsDropdown from '@/features/shared/components/ProjectsDropdown'
import WorkspaceSelector from '@/features/shared/components/WorkspaceSelector'

export default function Header() {
  const { user, signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isOnboarding = location.pathname.startsWith('/onboarding')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logoTo = user ? '/dashboard' : '/'

  // Simplified header for onboarding
  if (isOnboarding) {
    return (
      <header className="sticky top-0 z-50 h-16 text-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <Link to={logoTo}>
            <img src="/logo_assets/inkdb.png" alt="ink" className="h-5 w-auto invert" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 cursor-pointer text-white hover:bg-white/10 hover:text-white"
            onClick={() => navigate({ to: logoTo })}
          >
            <X className="size-4" />
            <span className="sr-only">Close onboarding</span>
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 h-16 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4">
        {/* Left: Logo */}
        <nav className="flex items-center gap-2">
          <Link to={logoTo}>
            <img src="/logo_assets/inkdb.png" alt="ink" className="h-5 w-auto invert" />
          </Link>
        </nav>

        {/* Center: Nav links (desktop only) */}
        <div className="hidden md:flex flex-1 justify-end gap-1">
          {!user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/features">Features</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/pricing">Pricing</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/docs">Docs</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signIn()
                  await navigate({ to: '/dashboard' })
                }}
                className="cursor-pointer"
              >
                Get Started
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/docs">Docs</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <ProjectsDropdown />
            </>
          )}
        </div>

        {/* Right: Workspace + UserProfile (desktop, authenticated only) */}
        <div className="hidden md:flex items-center gap-1 ml-1">
          {user && <WorkspaceSelector />}
          {user && <UserProfile />}
        </div>

        {/* Mobile hamburger */}
        <div className="ml-auto md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9">
                <List className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] p-0" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex justify-end p-3">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <X className="size-4" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col px-3 pb-4">
                {!user ? (
                  <>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/features" onClick={() => setMobileMenuOpen(false)}>
                        Features
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                        Pricing
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>
                        Docs
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        setMobileMenuOpen(false)
                        await signIn()
                        await navigate({ to: '/dashboard' })
                      }}
                      className="gap-2 cursor-pointer h-9 text-sm mt-2"
                    >
                      Get Started
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="px-3 py-2 text-sm text-muted-foreground truncate">
                      {user.displayName ?? user.email ?? user.githubUsername ?? 'User'}
                    </p>
                    <div className="px-1 pb-1">
                      <WorkspaceSelector />
                    </div>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/projects" onClick={() => setMobileMenuOpen(false)}>
                        Projects
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start h-9 text-sm" asChild>
                      <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>
                        Docs
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-9 text-sm"
                      onClick={async () => {
                        setMobileMenuOpen(false)
                        await signOut()
                        void navigate({ to: '/' })
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
