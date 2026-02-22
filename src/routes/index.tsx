import { createFileRoute } from '@tanstack/react-router'

import HomepageHero from '@/features/shared/components/HomepageHero'

export const Route = createFileRoute('/')({
  ssr: true,
  headers: () => ({
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
  }),
  component: HomePage
})

function HomePage() {
  return <HomepageHero />
}
