import { GithubLogo, List, X } from '@phosphor-icons/react'
import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useAuth, UserProfile } from '@/features/auth'

export default function Header() {
  const { user, signIn } = useAuth()
  const location = useLocation()
  const isOnboarding = location.pathname.startsWith('/onboarding')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Simplified header for onboarding
  if (isOnboarding) {
    return (
      <header className="sticky top-0 z-50 h-14 px-4 md:px-6 flex items-center">
        <Link to="/" className="font-semibold tracking-tight font-mono">
          Ink MCP
        </Link>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 h-14 px-4 md:px-6 flex items-center justify-between pointer-events-none">
      <nav className="flex items-center gap-2 pointer-events-auto">
        <Link to="/" className="font-semibold tracking-tight font-mono">
          Ink MCP
        </Link>
      </nav>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto font-mono">
        {!user && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/features">Features</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/docs">Docs</Link>
        </Button>
        {user ? (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/settings/api-keys">API Keys</Link>
            </Button>
            <UserProfile />
          </>
        ) : (
          <Button size="sm" onClick={signIn} className="gap-2 cursor-pointer">
            <GithubLogo weight="fill" className="size-4" />
            Sign in with GitHub
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden pointer-events-auto">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="size-9">
              <List className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0" showCloseButton={false}>
            <SheetHeader className="p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-mono">Menu</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="size-9">
                    <X className="size-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <nav className="flex flex-col p-6 gap-2 font-mono">
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="justify-start h-12 text-base"
                    asChild
                  >
                    <Link to="/features" onClick={() => setMobileMenuOpen(false)}>
                      Features
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="justify-start h-12 text-base"
                    asChild
                  >
                    <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                      Pricing
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" size="lg" className="justify-start h-12 text-base" asChild>
                <Link to="/docs" onClick={() => setMobileMenuOpen(false)}>
                  Docs
                </Link>
              </Button>
              {user && (
                <Button variant="ghost" size="lg" className="justify-start h-12 text-base" asChild>
                  <Link to="/settings/api-keys" onClick={() => setMobileMenuOpen(false)}>
                    API Keys
                  </Link>
                </Button>
              )}
              <div className="border-t my-4" />
              {user ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <UserProfile />
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={() => {
                    signIn()
                    setMobileMenuOpen(false)
                  }}
                  className="gap-2 cursor-pointer h-12 text-base"
                >
                  <GithubLogo weight="fill" className="size-4" />
                  Sign in with GitHub
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
