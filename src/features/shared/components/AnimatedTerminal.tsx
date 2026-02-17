import { AnimatePresence, motion, useInView } from 'framer-motion'
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface SequenceItem {
  type: 'input' | 'output' | 'tool' | 'thinking' | 'crunching'
  text: string
}

const SEQUENCE: SequenceItem[] = [
  { type: 'input', text: 'Deploy using Ink MCP' },
  {
    type: 'output',
    text: 'It looks like you have React frontend, node backend and sqlite database. '
  },
  { type: 'thinking', text: '' },
  {
    type: 'tool',
    text: 'Ink - Create database (MCP)(type: "sqlite", ...)'
  },
  {
    type: 'tool',
    text: 'Ink - Create service (MCP)(name: "backend", repo: "cactus", memory: "256Mi", ...)'
  },
  {
    type: 'tool',
    text: 'Ink - Create service (MCP)(name: "frontend", repo: "cactus", vcpu: "0.5", ...)'
  },
  { type: 'crunching', text: '' },
  {
    type: 'output',
    text: "I have deployed it using Ink MCP. Here's your URL: https://cactusapp.ml.ink"
  },
  { type: 'input', text: 'Use my domain cactus.biohack.com' },
  { type: 'output', text: 'Sure, provisioning new certificate with Ink.' },
  { type: 'thinking', text: '' },
  {
    type: 'tool',
    text: 'Ink - Custom domain (MCP)(domain: "cactus.biohack.com", ...)'
  },
  { type: 'crunching', text: '' },
  {
    type: 'output',
    text: 'Done. Your url https://cactus.biohack.com is now live.'
  }
]

const STEPS = [
  {
    title: 'Deploy instruction',
    description: 'User requested a full deployment of their project using the Ink MCP server.'
  },
  {
    title: 'Detected stack',
    description:
      'Analyzed the codebase and identified a React frontend, Node.js backend, and SQLite database.'
  },
  {
    title: 'Provisioned database',
    description: 'Spun up a managed SQLite instance with an auto-configured connection string.'
  },
  {
    title: 'Deployed backend',
    description: 'Containerized the Node.js API service, allocated resources, and deployed to Ink.'
  },
  {
    title: 'Deployed frontend',
    description:
      'Built and deployed the React app with backend integration. Live at cactusapp.ml.ink.'
  },
  {
    title: 'Custom domain + SSL',
    description: 'Provisioned an SSL certificate and configured DNS to serve at cactus.biohack.com.'
  },
  {
    title: 'Deployment complete',
    description:
      'Agent provisioned a SQLite database, deployed frontend and backend to Ink, and configured a custom domain with SSL.'
  }
]

// Map sequence index to step index
const STEP_TRIGGERS: Record<number, number> = {
  0: 0, // input "Deploy using Ink MCP" → Deploy instruction
  1: 1, // output "It looks like..." → Detected stack
  3: 2, // tool "Create database" → Provisioned database
  4: 3, // tool "Create service backend" → Deployed backend
  5: 4, // tool "Create service frontend" → Deployed frontend
  11: 5, // tool "Custom domain" → Custom domain + SSL
  13: 6 // output "Done. Your url..." → Deployment complete
}

// Steps 2-4 (database, backend, frontend) accumulate together
function getVisibleSteps(step: number): number[] {
  if (step < 0) return []
  if (step <= 1) return [step]
  if (step >= 2 && step <= 4) {
    const steps: number[] = []
    for (let i = 2; i <= step; i++) steps.push(i)
    return steps
  }
  return [step]
}

const CHAR_DELAY = 32
const OUTPUT_DELAY = 500
const POST_INPUT_PAUSE = 700
const THINKING_DURATION = 2000
const CRUNCHING_DURATION = 2000

interface DisplayLine {
  id: number
  type: 'input' | 'output' | 'tool'
  text: string
  isTyping: boolean
  stepIndex?: number
}

interface StepArrow {
  step: number
  startX: number
  startY: number
  endX: number
  endY: number
}

function highlightUrls(text: string): ReactNode {
  const parts = text.split(/(https?:\/\/[^\s]+)/g)
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <span key={i} className="text-sky-400">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function AnimatedTerminal() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const terminalWindowRef = useRef<HTMLDivElement>(null)
  const stepLineRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const timelineRef = useRef<HTMLDivElement>(null)
  const bubbleRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const isInView = useInView(wrapperRef, { once: true, margin: '-60px' })
  const [lines, setLines] = useState<DisplayLine[]>([])
  const [showIdleCursor, setShowIdleCursor] = useState(false)
  const [spinnerLabel, setSpinnerLabel] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [runKey, setRunKey] = useState(0)
  const [activeStep, setActiveStep] = useState(-1)
  const [arrows, setArrows] = useState<StepArrow[]>([])
  const [bubbleTops, setBubbleTops] = useState<Record<number, number>>({})
  const idCounter = useRef(0)
  const isDragging = useRef(false)
  const activeStepRef = useRef(-1)
  activeStepRef.current = activeStep

  const visibleSteps = useMemo(() => getVisibleSteps(activeStep), [activeStep])

  // Auto-scroll to bottom during animation only
  useEffect(() => {
    if (scrollRef.current && !isDone) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, showIdleCursor, spinnerLabel, isDone])

  const replay = useCallback(() => {
    setIsDone(false)
    setLines([])
    setShowIdleCursor(false)
    setSpinnerLabel(null)
    setActiveStep(-1)
    setArrows([])
    setBubbleTops({})
    setRunKey(k => k + 1)
  }, [])

  // Recalculate bubble positions and optionally arrows
  // updateArrows=false on first pass (position bubbles only), true on second pass (measured)
  const recalcPositions = useCallback((updateArrows = true) => {
    const step = activeStepRef.current
    const steps = getVisibleSteps(step)
    if (steps.length === 0) {
      setArrows([])
      setBubbleTops({})
      return
    }

    const wrapper = wrapperRef.current
    const terminalWindow = terminalWindowRef.current
    const terminal = scrollRef.current
    if (!wrapper || !terminalWindow || !terminal) {
      setArrows([])
      return
    }

    const wRect = wrapper.getBoundingClientRect()
    const tRect = terminal.getBoundingClientRect()
    const wrapperWidth = wrapper.offsetWidth

    // Gather target Y positions from terminal lines
    const targets: { step: number; lineY: number; visible: boolean }[] = []
    for (const s of steps) {
      const lineEl = stepLineRefs.current.get(s)
      if (!lineEl) continue
      const lRect = lineEl.getBoundingClientRect()
      const lineCenter = lRect.top + lRect.height / 2
      const visible = lRect.top >= tRect.top - 5 && lRect.bottom <= tRect.bottom + 5
      targets.push({ step: s, lineY: lineCenter - wRect.top, visible })
    }

    if (targets.length === 0) {
      setArrows([])
      return
    }

    // Calculate bubble positions — use measured heights when available, else estimate
    const CARD_GAP = 10
    const sorted = [...targets].sort((a, b) => a.lineY - b.lineY)
    const newTops: Record<number, number> = {}

    for (let i = 0; i < sorted.length; i++) {
      let y = sorted[i].lineY - 30
      if (i > 0) {
        const prevStep = sorted[i - 1].step
        const prevEl = bubbleRefs.current.get(prevStep)
        const prevHeight = prevEl?.offsetHeight ?? 100
        const prevY = newTops[prevStep]
        y = Math.max(y, prevY + prevHeight + CARD_GAP)
      }
      newTops[sorted[i].step] = y
    }
    setBubbleTops(newTops)

    if (!updateArrows) return

    // Calculate arrows — use measured bubble heights for center
    const startX = wrapperWidth + 8
    const endX = wrapperWidth + 36

    const newArrows: StepArrow[] = targets
      .filter(t => t.visible)
      .map(t => {
        const bubbleEl = bubbleRefs.current.get(t.step)
        const bubbleHeight = bubbleEl?.offsetHeight ?? 100
        return {
          step: t.step,
          startX,
          startY: t.lineY,
          endX,
          endY: (newTops[t.step] ?? t.lineY) + bubbleHeight / 2
        }
      })

    setArrows(newArrows)
  }, [])

  // Update positions when activeStep or lines change
  // First pass: position bubbles only (no arrows). Second pass: measured heights + arrows.
  useEffect(() => {
    if (activeStep < 0) {
      setArrows([])
      setBubbleTops({})
      return
    }

    setArrows([]) // clear old arrows immediately so they fade out first
    const timer1 = setTimeout(() => recalcPositions(false), 50)
    const timer2 = setTimeout(() => recalcPositions(true), 300)
    const terminal = scrollRef.current
    const onScrollOrResize = () => recalcPositions(true)
    terminal?.addEventListener('scroll', onScrollOrResize)
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      terminal?.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [activeStep, lines.length, recalcPositions])

  // Handle step click from timeline dot (with scroll)
  const handleStepClick = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex)

    // Scroll to the last line in the visible group
    const group = getVisibleSteps(stepIndex)
    const lastStep = group[group.length - 1]
    const lineEl = stepLineRefs.current.get(lastStep)
    if (lineEl && scrollRef.current) {
      const container = scrollRef.current
      const cRect = container.getBoundingClientRect()
      const lRect = lineEl.getBoundingClientRect()
      const offset = lRect.top - cRect.top - cRect.height / 3
      container.scrollTo({
        top: container.scrollTop + offset,
        behavior: 'smooth'
      })
    }
  }, [])

  // Drag on timeline — only sets step, no scroll
  const handleTimelineDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const step = Math.round(pct * (STEPS.length - 1))
    setActiveStep(step)
  }, [])

  // Animation
  useEffect(() => {
    if (!isInView && runKey === 0) return

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    function wait(ms: number): Promise<void> {
      return new Promise(resolve => {
        const t = setTimeout(() => {
          if (!cancelled) resolve()
        }, ms)
        timers.push(t)
      })
    }

    async function animate(): Promise<void> {
      try {
        idCounter.current = 0
        setLines([])
        setShowIdleCursor(false)
        setSpinnerLabel(null)
        setIsDone(false)
        setActiveStep(-1)
        setArrows([])
        setBubbleTops({})
        stepLineRefs.current.clear()
        await wait(600)

        for (let si = 0; si < SEQUENCE.length; si++) {
          if (cancelled) return
          const item = SEQUENCE[si]
          const stepIdx = STEP_TRIGGERS[si]

          if (item.type === 'input') {
            setShowIdleCursor(true)
            await wait(500)
            if (cancelled) return

            const id = idCounter.current++
            setShowIdleCursor(false)
            setLines(prev => [
              ...prev,
              { id, type: 'input', text: '', isTyping: true, stepIndex: stepIdx }
            ])
            await wait(200)

            for (let c = 1; c <= item.text.length; c++) {
              if (cancelled) return
              const text = item.text.slice(0, c)
              setLines(prev => prev.map(l => (l.id === id ? { ...l, text } : l)))
              await wait(CHAR_DELAY + Math.random() * 20)
            }

            setLines(prev => prev.map(l => (l.id === id ? { ...l, isTyping: false } : l)))

            if (stepIdx !== undefined) {
              await wait(400)
              if (cancelled) return
              setActiveStep(stepIdx)
            }

            await wait(POST_INPUT_PAUSE)
          } else if (item.type === 'thinking') {
            await wait(200)
            if (cancelled) return
            setSpinnerLabel('Thinking...')
            await wait(THINKING_DURATION)
            if (cancelled) return
            setSpinnerLabel(null)
          } else if (item.type === 'tool') {
            await wait(OUTPUT_DELAY)
            if (cancelled) return
            const id = idCounter.current++
            setLines(prev => [
              ...prev,
              { id, type: 'tool', text: item.text, isTyping: false, stepIndex: stepIdx }
            ])
            if (stepIdx !== undefined) {
              await wait(400)
              if (cancelled) return
              setActiveStep(stepIdx)
            }
          } else if (item.type === 'crunching') {
            await wait(200)
            if (cancelled) return
            setSpinnerLabel('Crunching...')
            await wait(CRUNCHING_DURATION)
            if (cancelled) return
            setSpinnerLabel(null)
          } else {
            // output
            await wait(OUTPUT_DELAY)
            if (cancelled) return
            const id = idCounter.current++
            setLines(prev => [
              ...prev,
              { id, type: 'output', text: item.text, isTyping: false, stepIndex: stepIdx }
            ])
            if (stepIdx !== undefined) {
              await wait(400)
              if (cancelled) return
              setActiveStep(stepIdx)
            }
          }
        }

        if (!cancelled) {
          setShowIdleCursor(true)
          setIsDone(true)
        }
      } catch {
        // cancelled
      }
    }

    void animate()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [isInView, runKey])

  return (
    <motion.div
      ref={wrapperRef}
      className="relative mx-auto max-w-3xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Replay button — always visible above terminal */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={replay}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] transition-colors ${
            isDone
              ? 'text-neutral-400 hover:text-neutral-200'
              : 'pointer-events-none text-transparent'
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Replay
        </button>
      </div>

      <div className="relative">
        {/* Subtle glow behind terminal */}
        <div
          className="pointer-events-none absolute -inset-6 rounded-2xl opacity-50 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.06), transparent 70%)'
          }}
        />

        {/* Terminal window */}
        <div
          ref={terminalWindowRef}
          className="relative overflow-hidden rounded-[10px] border border-white/[0.08] shadow-2xl shadow-black/60"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#2a2a3c] px-3.5 py-2.5">
            <div className="flex gap-[7px]">
              <div className="size-[11px] rounded-full bg-[#ff5f57]" />
              <div className="size-[11px] rounded-full bg-[#febc2e]" />
              <div className="size-[11px] rounded-full bg-[#28c840]" />
            </div>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="terminal-body h-80 overflow-y-auto bg-[#0a0a14] p-5 font-mono text-[13px] leading-7 md:h-96"
          >
            {lines.map(line => (
              <div
                key={line.id}
                ref={
                  line.stepIndex !== undefined
                    ? (el: HTMLDivElement | null) => {
                        if (el) stepLineRefs.current.set(line.stepIndex!, el)
                      }
                    : undefined
                }
                className={`${line.type !== 'input' ? 'terminal-line-in' : ''} ${
                  line.stepIndex !== undefined && visibleSteps.includes(line.stepIndex)
                    ? '-mx-2 rounded bg-white/[0.03] px-2'
                    : ''
                }`}
              >
                {line.type === 'input' ? (
                  <div>
                    <span className="text-emerald-400">❯ </span>
                    <span className="text-white">{line.text}</span>
                    {line.isTyping && <span className="terminal-cursor" />}
                  </div>
                ) : line.type === 'tool' ? (
                  <div className="text-neutral-400">
                    <span className="text-emerald-400">⏺ </span>
                    {line.text}
                  </div>
                ) : (
                  <div className="text-neutral-400">
                    <span className="text-white">⏺ </span>
                    {highlightUrls(line.text)}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Crunching spinner */}
            {spinnerLabel && (
              <div className="terminal-line-in mt-1 text-neutral-500">
                <span className="terminal-spinner">✻</span> {spinnerLabel}
              </div>
            )}

            {/* Idle cursor on empty prompt */}
            {showIdleCursor && !spinnerLabel && (
              <div className="terminal-line-in">
                <span className="text-emerald-400">❯ </span>
                <span className="terminal-cursor" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation bubbles - desktop (positioned right of terminal) */}
      <AnimatePresence>
        {visibleSteps
          .filter(stepIdx => bubbleTops[stepIdx] !== undefined)
          .map(stepIdx => (
            <motion.div
              key={stepIdx}
              ref={(el: HTMLDivElement | null) => {
                if (el) bubbleRefs.current.set(stepIdx, el)
                else bubbleRefs.current.delete(stepIdx)
              }}
              className="absolute left-full ml-10 hidden w-56 xl:block"
              style={{ top: bubbleTops[stepIdx] }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="rounded-lg border border-white/[0.06] bg-[#12121f]/90 p-3.5 backdrop-blur-sm">
                <h4 className="text-[13px] font-medium text-white">{STEPS[stepIdx].title}</h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500">
                  {STEPS[stepIdx].description}
                </p>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Connecting arrows - desktop */}
      <AnimatePresence>
        {arrows.length > 0 && (
          <motion.svg
            key={arrows.map(a => a.step).join(',')}
            className="pointer-events-none absolute inset-0 hidden xl:block"
            style={{ overflow: 'visible' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {arrows.map(a => (
              <g key={a.step}>
                <path
                  d={`M ${a.startX},${a.startY} C ${a.startX + (a.endX - a.startX) * 0.4},${a.startY} ${a.endX - (a.endX - a.startX) * 0.4},${a.endY} ${a.endX},${a.endY}`}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                />
                <circle cx={a.endX} cy={a.endY} r="2" fill="rgba(255,255,255,0.2)" />
              </g>
            ))}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Timeline — always visible */}
      <div className="mt-8">
        <div
          ref={timelineRef}
          className={`relative flex items-center justify-between px-2 py-5 touch-none select-none ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
          onPointerDown={e => {
            if (!isDone) return
            isDragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            handleTimelineDrag(e)
          }}
          onPointerMove={e => {
            if (!isDragging.current) return
            handleTimelineDrag(e)
          }}
          onPointerUp={() => {
            isDragging.current = false
          }}
        >
          {/* Background track */}
          <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/[0.06]" />

          {/* Progress track */}
          <div
            className="absolute left-2 top-1/2 h-px -translate-y-1/2 bg-white/[0.15] transition-all duration-500 ease-out"
            style={{
              width: activeStep >= 0 ? `${(activeStep / (STEPS.length - 1)) * 100}%` : '0%'
            }}
          />

          {/* Step dots — fixed layout size, scale for active to avoid jitter */}
          {STEPS.map((step, i) => (
            <button
              key={step.title}
              onClick={() => isDone && handleStepClick(i)}
              className={`relative z-10 size-2 rounded-full transition-all duration-300 ${
                i === activeStep
                  ? 'scale-150 bg-white shadow-lg shadow-white/20'
                  : i < activeStep
                    ? 'bg-white/30'
                    : 'bg-white/[0.08]'
              } ${isDone ? 'cursor-pointer hover:scale-[1.75] hover:bg-white/50' : 'cursor-default'}`}
              title={step.title}
            />
          ))}
        </div>

        {/* Step info - mobile (below timeline) */}
        <div className="min-h-[56px] px-2 xl:hidden">
          <AnimatePresence mode="wait">
            {activeStep >= 0 && (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <h4 className="text-sm font-medium text-white">{STEPS[activeStep].title}</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
                  {STEPS[activeStep].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
