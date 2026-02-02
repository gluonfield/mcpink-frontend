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
        title: 'Mlink - Deploy MCP Servers for AI Coding Agents'
      },
      {
        name: 'description',
        content:
          'Deploy and host MCP servers for AI coding assistants like Claude, Cursor, VS Code Copilot, and more. Support for React, Next.js, Python, Go, and 20+ frameworks.'
      },
      {
        name: 'keywords',
        content:
          'MCP server, AI coding assistant, Claude, Cursor, VS Code, deployment, hosting, React, Next.js, Python, Node.js, Go, FastAPI, Django, Flask'
      },
      {
        property: 'og:title',
        content: 'Mlink - Deploy MCP Servers for AI Coding Agents'
      },
      {
        property: 'og:description',
        content:
          'Stop being your agent\'s DevOps. Deploy and host MCP servers for AI coding assistants with automatic SSL, domains, and database provisioning.'
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
        content: 'Mlink - Deploy MCP Servers for AI Coding Agents'
      },
      {
        name: 'twitter:description',
        content:
          'Stop being your agent\'s DevOps. Deploy and host MCP servers for AI coding assistants.'
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
