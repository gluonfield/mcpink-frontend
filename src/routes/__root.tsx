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
        title: 'Template Frontend'
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
