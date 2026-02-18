import { ApolloProvider } from '@apollo/client/react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import ErrorBoundary from '@/components/ErrorBoundary'
import Toaster from '@/components/ui/sonner'
import { AuthProvider, GoogleOneTap } from '@/features/auth'
import Header from '@/features/shared/components/Header'
import { apolloClient } from '@/features/shared/graphql/client'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'ml.ink - Let AI Agents Deploy Your Apps'
      },
      {
        name: 'description',
        content:
          "The internet, but for agents.. Let Claude, Cursor, Codex and other AI coding agents deploy your apps automatically via MCP. Support for React, Next.js, Python, Go, and 25+ frameworks."
      },
      {
        name: 'keywords',
        content:
          'MCP, AI deployment, Claude, Cursor, Codex, AI coding agent, automatic deployment, hosting, React, Next.js, Python, Node.js, Go, Docker'
      },
      {
        property: 'og:title',
        content: 'ml.ink - Let AI Agents Deploy Your Apps'
      },
      {
        property: 'og:description',
        content:
          "The internet, but for agents.. Let AI coding agents deploy your apps automatically with SSL, domains, and databases."
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: 'ml.ink - Let AI Agents Deploy Your Apps'
      },
      {
        name: 'twitter:description',
        content:
          "The internet, but for agents.. Let AI agents deploy your apps automatically via MCP."
      }
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,900&display=swap'
      },
      {
        rel: 'stylesheet',
        href: appCss
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest'
      }
    ]
  }),

  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ErrorBoundary>
          <ApolloProvider client={apolloClient}>
            <AuthProvider>
              <GoogleOneTap />
              <Header />
              {children}
              <Toaster />
            </AuthProvider>
          </ApolloProvider>
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  )
}
