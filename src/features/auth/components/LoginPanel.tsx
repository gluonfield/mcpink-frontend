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

const MARQUEE_CLIENTS = [
  { name: 'Claude Code', icon: '/icons/mcp-clients/claude-dark-icon.svg', color: '#E8825A' },
  { name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg', color: '#FFFFFF' },
  { name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg', color: '#10A37F' },
  { name: 'Gemini CLI', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg', color: '#4285F4' },
  { name: 'Windsurf', icon: '/icons/mcp-clients/windsurf-dark-icon.svg', color: '#00C9A7' },
  { name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg', color: '#3B9AFF' },
  { name: 'Kimi Code', icon: '/icons/mcp-clients/kimi-dark-icon.svg', color: '#818CF8' },
  { name: 'Open Code', icon: '/icons/mcp-clients/opencode-dark-icon.svg', color: '#D1D5DB' },
  { name: 'Antigravity', icon: '/icons/mcp-clients/antigravity-dark-icon.png', color: '#4285F4' },
  { name: 'Goose', icon: '/icons/mcp-clients/goose-dark-icon.svg', color: '#FB923C' }
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
  { name: 'Streamlit', icon: '/icons/frameworks/streamlit.svg' },
  { name: 'Gradio', icon: '/icons/frameworks/gradio.svg' },
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
    <main>
      {/* Hero Section - dark with background image */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-44 md:px-6 md:py-64">
        {/* Background image */}
        <img
          src="/img_vibes/5.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
        />
        {/* Dark overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/60" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-normal tracking-tight text-white md:text-5xl">
            Stop being your agent&apos;s DevOps
          </h1>

          <div className="mx-auto mt-6 max-w-lg text-base text-neutral-400 md:text-xl">
            <p className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="relative inline-flex items-center h-7 min-w-[110px] md:h-8 md:min-w-[130px] overflow-hidden">
                {ROTATING_PRODUCTS.map((product, i) => (
                  <span
                    key={product.name}
                    className={`absolute inset-0 inline-flex items-center justify-center gap-1.5 md:gap-2 text-white font-medium transition-all duration-500 ease-in-out ${
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
            <p className="mt-3 text-sm md:text-lg">
              Agent deploys your app. Backend, database, domains — all handled.
            </p>
          </div>

          <div className="mt-10">
            <McpQuickStart variant="dark" />
          </div>
        </div>
      </section>

      {/* Works with marquee */}
      <section className="overflow-hidden bg-neutral-950 py-6">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-neutral-500">
          Works with
        </p>
        <div className="flex animate-marquee">
          {[0, 1].map(copy => (
            <div
              key={copy}
              className="flex shrink-0 items-center"
              aria-hidden={copy > 0}
            >
              {MARQUEE_CLIENTS.map(client => (
                <div
                  key={`${client.name}-${copy}`}
                  className="flex shrink-0 items-center gap-2.5 pl-16"
                >
                  <img src={client.icon} alt="" className="size-5 md:size-6" />
                  <span
                    style={{ color: client.color }}
                    className="whitespace-nowrap text-sm font-medium md:text-base"
                  >
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Deploy any stack section */}
      <section className="bg-neutral-950 px-6 py-28 md:py-40">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Universal deployment
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-white md:text-4xl">
            Deploy any stack
          </h2>
          <p className="mt-5 text-base text-neutral-400 md:text-lg">
            From static sites to full-stack apps, your agent deploys whatever it builds.
            No config files, no Docker setup, no CI pipelines — just code and go.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-5 gap-y-10 sm:grid-cols-7 md:mt-20 md:grid-cols-10 md:gap-y-12">
          {SUPPORTED_FRAMEWORKS.map(framework => (
            <div key={framework.name} className="flex flex-col items-center gap-2">
              <img
                src={framework.icon}
                alt={`Deploy ${framework.name} applications`}
                className="size-9 md:size-10"
              />
              <span className="text-[10px] text-neutral-500 md:text-xs">{framework.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
