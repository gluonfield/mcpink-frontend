import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'
import AnimatedTerminal from '@/features/shared/components/AnimatedTerminal'
import Footer from '@/features/shared/components/Footer'
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
  { name: 'Docker', icon: '/icons/frameworks/docker.svg' },
  { name: 'Node.js', icon: '/icons/frameworks/nodejs.svg' },
  { name: 'React', icon: '/icons/frameworks/react.svg' },
  { name: 'Python', icon: '/icons/frameworks/python.svg' },
  { name: 'Next.js', icon: '/icons/frameworks/nextjs.svg' },
  { name: 'Go', icon: '/icons/frameworks/go.svg' },
  { name: 'Vue.js', icon: '/icons/frameworks/vue.svg' },
  { name: 'Rust', icon: '/icons/frameworks/rust.svg' },
  { name: 'Django', icon: '/icons/frameworks/django.svg' },
  { name: 'Angular', icon: '/icons/frameworks/angular.svg' },
  { name: 'FastAPI', icon: '/icons/frameworks/fastapi.svg' },
  { name: 'Svelte', icon: '/icons/frameworks/svelte.svg' },
  { name: 'Rails', icon: '/icons/frameworks/rails.svg' },
  { name: 'Nuxt', icon: '/icons/frameworks/nuxt.svg' },
  { name: 'Laravel', icon: '/icons/frameworks/laravel.svg' },
  { name: 'Java', icon: '/icons/frameworks/java.svg' },
  { name: 'Spring Boot', icon: '/icons/frameworks/spring.svg' },
  { name: 'Flask', icon: '/icons/frameworks/flask.svg' },
  { name: 'Ruby', icon: '/icons/frameworks/ruby.svg' },
  { name: 'PHP', icon: '/icons/frameworks/php.svg' },
  { name: '.NET / C#', icon: '/icons/frameworks/dotnet.svg' },
  { name: 'Elixir', icon: '/icons/frameworks/elixir.svg' },
  { name: 'HTML/Static', icon: '/icons/frameworks/html.svg' },
  { name: 'Bun', icon: '/icons/frameworks/bun.svg' },
  { name: 'Deno', icon: '/icons/frameworks/deno.svg' },
  { name: 'Haskell', icon: '/icons/frameworks/haskell.svg' },
  { name: 'Zig', icon: '/icons/frameworks/zig.svg' },
  { name: 'Streamlit', icon: '/icons/frameworks/streamlit.svg' },
  { name: 'Gradio', icon: '/icons/frameworks/gradio.svg' }
]

// Orbital layout: 1 center + 3 rings = 29 icons
// Ring 0: 1 (center), Ring 1: 6, Ring 2: 9, Ring 3: 13
const ORBIT_RINGS = [38, 66, 94]

const ORBIT_LAYOUT = [
  { count: 1, r: 0, angleOffset: 0 },
  { count: 6, r: 19, angleOffset: -90 },
  { count: 9, r: 33, angleOffset: -70 },
  { count: 13, r: 47, angleOffset: -90 }
]

const ICON_POSITIONS: Array<{ left: number; top: number; ring: number }> = []
ORBIT_LAYOUT.forEach(({ count, r, angleOffset }, ring) => {
  for (let i = 0; i < count; i++) {
    const angle = ((i * 360) / count + angleOffset) * (Math.PI / 180)
    ICON_POSITIONS.push({
      left: 50 + r * Math.cos(angle),
      top: 50 + r * Math.sin(angle),
      ring
    })
  }
})

const RING_CONTAINER = ['p-3.5 md:p-5', 'p-2.5 md:p-3.5', 'p-2 md:p-3', 'p-1.5 md:p-2.5']
const RING_ICON_SIZE = [
  'size-7 md:size-9',
  'size-5 md:size-7',
  'size-4 md:size-6',
  'size-4 md:size-5'
]

export default function HomepageHero() {
  const [index, setIndex] = useState(0)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % ROTATING_PRODUCTS.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen space-y-4 bg-slate-950 px-3 pb-3 md:space-y-6 md:px-4 md:pb-4">
      {/* Hero Section - dark with background image */}
      <section>
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950">
          {/* Background image */}
          <img
            src="/img_vibes/mid1.png"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl px-6 py-40 text-center md:py-96">
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

            <div className="mt-10 flex flex-col items-center gap-6">
              <Button
                size="lg"
                onClick={async () => {
                  await signIn()
                  await navigate({ to: '/dashboard' })
                }}
                className="cursor-pointer bg-white px-8 text-neutral-950 hover:bg-neutral-200"
              >
                Get Started Free
              </Button>
              <McpQuickStart variant="dark" />
            </div>
          </div>

          {/* Client marquee — flush to bottom */}
          <div className="relative z-10 overflow-hidden bg-slate-950/70 py-5 md:py-6">
            <div className="flex animate-marquee">
              {[0, 1].map(copy => (
                <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
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
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className="mx-auto max-w-[1600px] overflow-x-clip rounded-2xl border border-white/[0.06] bg-[#161622] px-6 py-32 md:py-48">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-normal tracking-tight text-white md:text-4xl">
              From prompt to production in minutes
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-neutral-400 md:text-lg">
              Give your AI agent the power to deploy. No DevOps knowledge required — the agent
              handles everything.
            </p>
          </div>

          <div className="mt-16 md:mt-20">
            <AnimatedTerminal />
          </div>
        </div>
      </section>

      {/* Deploy any stack section */}
      <section className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12141e] px-6 py-40 md:py-56">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Universal deployment
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-white md:text-4xl">
            Deploy any stack
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-neutral-400 md:text-lg">
            From static sites to full-stack apps, your agent deploys whatever it builds. No config
            files, no Docker setup, no CI pipelines — just code and go.
          </p>
        </div>

        <div className="relative mx-auto mt-12 aspect-square max-w-lg md:mt-16 md:max-w-2xl">
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute -inset-[25%]"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(99,130,255,0.08) 0%, rgba(99,130,255,0.02) 40%, transparent 70%)'
            }}
          />

          {/* Orbit ring outlines */}
          {ORBIT_RINGS.map((size, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
              style={{ width: `${size}%`, height: `${size}%` }}
            />
          ))}

          {/* Framework icons on orbits */}
          {SUPPORTED_FRAMEWORKS.map((framework, i) => {
            const pos = ICON_POSITIONS[i]
            const floatY = 3 + ((i * 7) % 6)
            const floatDuration = 5 + ((i * 13) % 5)
            const floatDelay = ((i * 17) % 20) / 10

            return (
              <motion.div
                key={framework.name}
                className="absolute w-max"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
                initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%' }}
                whileInView={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  delay: 0.2 + i * 0.04,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
              >
                <motion.div
                  className="group relative flex cursor-default flex-col items-center"
                  animate={{ y: [0, -floatY, 0, floatY * 0.6, 0] }}
                  transition={{
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: floatDelay
                  }}
                  whileHover={{ scale: 1.15 }}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-white/[0.05] ring-1 ring-white/[0.08] backdrop-blur-sm ${RING_CONTAINER[pos.ring]}`}
                  >
                    <img
                      src={framework.icon}
                      alt={framework.name}
                      className={RING_ICON_SIZE[pos.ring]}
                    />
                  </div>
                  <span className="absolute -bottom-5 whitespace-nowrap text-[9px] text-neutral-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:text-[10px]">
                    {framework.name}
                  </span>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
