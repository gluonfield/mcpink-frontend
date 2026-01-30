import { useEffect, useState } from 'react'

import McpInstallation from '@/features/shared/components/McpInstallation'

const ROTATING_PRODUCTS = [
  { name: 'Claude', icon: '/icons/mcp-clients/claude-dark-icon.svg' },
  { name: 'Cursor', icon: '/icons/mcp-clients/cursor-dark-icon.svg' },
  { name: 'VS Code', icon: '/icons/mcp-clients/vscode-dark-icon.svg' },
  { name: 'Codex', icon: '/icons/mcp-clients/openai-dark-icon.svg' },
  { name: 'Gemini', icon: '/icons/mcp-clients/gemini-cli-dark-icon.svg' },
  { name: 'Windsurf', icon: '/icons/mcp-clients/windsurf-dark-icon.svg' },
  { name: 'Goose', icon: '/icons/mcp-clients/goose-dark-icon.svg' }
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
      <div className="relative z-[2] min-h-[calc(100vh-3.5rem)] flex flex-col items-center pointer-events-none pt-[12vh] pb-16">
        <div className="pointer-events-auto px-6 max-w-2xl w-full">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
              Stop being your agent's DevOps
            </h1>
            <div className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto space-y-2">
              <p className="flex items-center justify-center gap-1.5 flex-wrap">
                <span className="relative inline-flex items-center h-8 min-w-[130px] overflow-hidden">
                  {ROTATING_PRODUCTS.map((product, i) => (
                    <span
                      key={product.name}
                      className={`absolute inset-0 inline-flex items-center justify-center gap-2 text-foreground font-medium transition-all duration-500 ease-in-out ${
                        i === index
                          ? 'translate-y-0 opacity-100'
                          : i === (index - 1 + ROTATING_PRODUCTS.length) % ROTATING_PRODUCTS.length
                            ? '-translate-y-full opacity-0'
                            : 'translate-y-full opacity-0'
                      }`}
                    >
                      <img src={product.icon} alt={`${product.name} logo`} width={22} height={22} />
                      {product.name}
                    </span>
                  ))}
                </span>
                <span>writes your app.</span>
              </p>
              <p>Let agent handle the rest — hosting, database, SSL, domains. You just ship.</p>
            </div>
          </div>

          {/* Installation section */}
          <div className="bg-card/50 border border-border/50 rounded-lg p-6 md:p-8 backdrop-blur-sm">
            <McpInstallation />
          </div>
        </div>
      </div>
    </>
  )
}
