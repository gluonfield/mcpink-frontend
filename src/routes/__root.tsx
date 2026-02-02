import { ApolloProvider } from '@apollo/client/react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import Toaster from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth'
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
        title: 'Mlink - Let AI Agents Deploy Your Apps'
      },
      {
        name: 'description',
        content:
          "Stop being your agent's DevOps. Let Claude, Cursor, Codex and other AI coding agents deploy your apps automatically via MCP. Support for React, Next.js, Python, Go, and 25+ frameworks."
      },
      {
        name: 'keywords',
        content:
          'MCP, AI deployment, Claude, Cursor, Codex, AI coding agent, automatic deployment, hosting, React, Next.js, Python, Node.js, Go, Docker'
      },
      {
        property: 'og:title',
        content: 'Mlink - Let AI Agents Deploy Your Apps'
      },
      {
        property: 'og:description',
        content:
          "Stop being your agent's DevOps. Let AI coding agents deploy your apps automatically with SSL, domains, and databases."
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
        content: 'Mlink - Let AI Agents Deploy Your Apps'
      },
      {
        name: 'twitter:description',
        content:
          "Stop being your agent's DevOps. Let AI agents deploy your apps automatically via MCP."
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss
      }
    ]
  }),

  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <ApolloProvider client={apolloClient}>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </ApolloProvider>
        <Scripts />
      </body>
    </html>
  )
}
