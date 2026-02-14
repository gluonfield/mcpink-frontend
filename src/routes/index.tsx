import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Suspense } from 'react'

import PixelTrail from '@/components/animations/PixelTrail'
import { useAuth } from '@/features/auth'
import LoginPanel from '@/features/auth/components/LoginPanel'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" />
  }

  return (
    <>
      <LoginPanel />
      {/* Pixel Trail Layer - Above dim, below content, hidden on mobile */}
      <div className="fixed inset-0 z-[1] hidden md:block">
        <Suspense fallback={null}>
          <PixelTrail
            gridSize={60}
            trailSize={0.08}
            maxAge={250}
            interpolate={3}
            color="#f59e0b"
            gooeyFilter={{ id: 'pixel-goo', strength: 3 }}
          />
        </Suspense>
      </div>
    </>
  )
}
