import { createFileRoute } from '@tanstack/react-router'

import HomepageHero from '@/features/shared/components/HomepageHero'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  return <HomepageHero />
}
