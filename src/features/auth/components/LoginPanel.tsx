import { useEffect, useState } from 'react'

import McpQuickStart from '@/features/shared/components/McpQuickStart'

const ROTATING_PRODUCTS = [
  { name: 'Claude', icon: '/icons/mcp-clients/claude-dark-icon.svg' },
  { name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg' },
  { name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg' },
  { name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg' },
  { name: 'Gemini', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg' },
  { name: 'Windsurf', icon: '/icons/mcp-clients/windsurf-dark-icon.svg' },
  { name: 'Goose', icon: '/icons/mcp-clients/goose-dark-icon.svg' }
]

const SUPPORTED_FRAMEWORKS = [
  { name: 'Node.js', icon: '/icons/frameworks/nodejs.svg' },
  { name: 'React', icon: '/icons/frameworks/react.svg' },
  { name: 'Next.js', icon: '/icons/frameworks/nextjs.svg' },
  { name: 'Vue.js', icon: '/icons/frameworks/vue.svg' },
  { name: 'Nuxt', icon: '/icons/frameworks/nuxt.svg' },
  { name: 'Angular', icon: '/icons/frameworks/angular.svg' },
  { name: 'Svelte', icon: '/icons/frameworks/svelte.svg' },
  { name: 'HTML/Static', icon: '/icons/frameworks/html.svg' },
  { name: 'Python', icon: '/icons/frameworks/python.svg' },
  { name: 'Flask', icon: '/icons/frameworks/flask.svg' },
  { name: 'Django', icon: '/icons/frameworks/django.svg' },
  { name: 'FastAPI', icon: '/icons/frameworks/fastapi.svg' },
  { name: 'Go', icon: '/icons/frameworks/go.svg' },
  { name: 'Rust', icon: '/icons/frameworks/rust.svg' },
  { name: 'Ruby', icon: '/icons/frameworks/ruby.svg' },
  { name: 'Rails', icon: '/icons/frameworks/rails.svg' },
  { name: 'PHP', icon: '/icons/frameworks/php.svg' },
  { name: 'Laravel', icon: '/icons/frameworks/laravel.svg' },
  { name: 'Java', icon: '/icons/frameworks/java.svg' },
  { name: 'Spring Boot', icon: '/icons/frameworks/spring.svg' },
  { name: '.NET / C#', icon: '/icons/frameworks/dotnet.svg' },
  { name: 'Elixir', icon: '/icons/frameworks/elixir.svg' },
  { name: 'Haskell', icon: '/icons/frameworks/haskell.svg' },
  { name: 'Zig', icon: '/icons/frameworks/zig.svg' },
  { name: 'Deno', icon: '/icons/frameworks/deno.svg' },
  { name: 'Bun', icon: '/icons/frameworks/bun.svg' },
  { name: 'Docker', icon: '/icons/frameworks/docker.svg' }
]

export default function LoginPanel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % ROTATING_PRODUCTS.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Fixed background layer */}
      <div className="fixed inset-0 z-0 bg-background">
        {/* Dot Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-color) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />
        {/* Radial Fade Overlay - solid center fading to transparent edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, rgb(var(--background-rgb)) 0%, rgba(var(--background-rgb), 0.95) 20%, rgba(var(--background-rgb), 0.7) 40%, transparent 70%)'
          }}
        />
      </div>

      {/* Content layer */}
      <main className="relative z-[2] min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-start pt-16 md:justify-center md:pt-0 pointer-events-none pb-16 md:pb-16">
        <article className="pointer-events-auto px-6 md:px-6 max-w-2xl w-full">
          {/* Hero section */}
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8 md:mb-6">
              Stop being your agent's DevOps
            </h1>
            <div className="text-base md:text-xl text-muted-foreground max-w-lg mx-auto">
              <p className="flex items-center justify-center gap-1.5 flex-wrap">
                <span className="relative inline-flex items-center h-7 min-w-[110px] md:h-8 md:min-w-[130px] overflow-hidden">
                  {ROTATING_PRODUCTS.map((product, i) => (
                    <span
                      key={product.name}
                      className={`absolute inset-0 inline-flex items-center justify-center gap-1.5 md:gap-2 text-foreground font-medium transition-all duration-500 ease-in-out ${
                        i === index
                          ? 'translate-y-0 opacity-100'
                          : i === (index - 1 + ROTATING_PRODUCTS.length) % ROTATING_PRODUCTS.length
                            ? '-translate-y-full opacity-0'
                            : 'translate-y-full opacity-0'
                      }`}
                    >
                      <img
                        src={product.icon}
                        alt={`${product.name} logo`}
                        className="size-[18px] md:size-[22px]"
                      />
                      {product.name}
                    </span>
                  ))}
                </span>
                <span>writes your app.</span>
              </p>
              <p className="mt-4 md:mt-3 text-sm md:text-lg">
                Agent deploys your app. Backend, database, domains — all handled.
              </p>
            </div>
          </header>

          {/* MCP Quick Start */}
          <section className="text-center">
            <McpQuickStart />
          </section>

          {/* Supported frameworks - below the fold */}
          <section aria-label="Supported Frameworks" className="mt-24 md:mt-32 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mb-8 md:mb-8">Deploy any stack</h2>
            <ul className="flex flex-wrap items-center justify-center gap-5 md:gap-6" role="list">
              {SUPPORTED_FRAMEWORKS.map(framework => (
                <li key={framework.name} className="flex flex-col items-center">
                  <img
                    src={framework.icon}
                    alt={`Deploy ${framework.name} applications`}
                    className="size-9 md:size-12"
                  />
                  <span className="sr-only">{framework.name}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </>
  )
}
