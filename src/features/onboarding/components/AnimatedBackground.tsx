import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const width = canvas.width
    const height = canvas.height

    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      speed: number
      angle: number
      va: number
      color: string
      alpha: number

      constructor(w: number, h: number) {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.baseX = this.x
        this.baseY = this.y
        this.size = Math.random() * 2 + 0.5
        this.speed = Math.random() * 0.5 + 0.1
        this.angle = Math.random() * Math.PI * 2
        this.va = (Math.random() - 0.5) * 0.02
        this.alpha = Math.random() * 0.5 + 0.2

        const colors = ['#f59e0b', '#ea580c', '#fbbf24', '#d97706', '#fb923c']
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(w: number, h: number) {
        this.angle += this.va

        // Floating motion
        this.x = this.baseX + Math.cos(this.angle) * 50
        this.y = this.baseY + Math.sin(this.angle * 0.5) * 30

        // Mouse interaction
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          this.x -= dx * force * 0.02
          this.y -= dy * force * 0.02
        }

        // Wrap around
        if (this.x < -50) this.baseX = w + 50
        if (this.x > w + 50) this.baseX = -50
        if (this.y < -50) this.baseY = h + 50
        if (this.y > h + 50) this.baseY = -50
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.shadowColor = this.color
        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const initParticles = () => {
      if (!canvas) return
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 8000)
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const drawConnections = () => {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.save()
            ctx.globalAlpha = (1 - dist / 120) * 0.15
            ctx.strokeStyle = '#f59e0b'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx) return

      // Clear with fade effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawConnections()

      particles.forEach(p => {
        p.update()
        p.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    resize()

    // Initial clear
    ctx.fillStyle = '#09090b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-zinc-950">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(9,9,11,0.5) 70%, rgba(9,9,11,0.8) 100%)'
        }}
      />
    </div>
  )
}
