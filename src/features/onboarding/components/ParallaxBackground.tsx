import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function ParallaxBackground() {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 50, stiffness: 100 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Different parallax intensities for each layer
  const layer1X = useTransform(smoothX, [0, 1], [-20, 20])
  const layer1Y = useTransform(smoothY, [0, 1], [-20, 20])
  const layer2X = useTransform(smoothX, [0, 1], [-40, 40])
  const layer2Y = useTransform(smoothY, [0, 1], [-40, 40])
  const layer3X = useTransform(smoothX, [0, 1], [-60, 60])
  const layer3Y = useTransform(smoothY, [0, 1], [-60, 60])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0a0c]">
      {/* Deep background layer - slowest */}
      <motion.div className="absolute inset-0" style={{ x: layer1X, y: layer1Y }}>
        {/* Large ambient glow */}
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-violet-900/20 blur-[150px]" />
        <div className="absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] rounded-full bg-amber-900/15 blur-[130px]" />
      </motion.div>

      {/* Middle layer - medium speed */}
      <motion.div className="absolute inset-0" style={{ x: layer2X, y: layer2Y }}>
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute left-[15%] top-[20%] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-violet-500/10 to-transparent blur-[80px]"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute right-[10%] top-[30%] h-[250px] w-[250px] rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-[70px]"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-[20%] left-[30%] h-[200px] w-[200px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-[60px]"
        />
      </motion.div>

      {/* Front layer - fastest parallax */}
      <motion.div className="absolute inset-0" style={{ x: layer3X, y: layer3Y }}>
        {/* Subtle geometric accents */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute left-[20%] top-[40%] h-[400px] w-[400px]"
        >
          <div className="h-full w-full rounded-full border border-white/[0.03]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
          className="absolute right-[25%] bottom-[30%] h-[300px] w-[300px]"
        >
          <div className="h-full w-full rounded-full border border-white/[0.02]" />
        </motion.div>

        {/* Small accent dots */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[10%] top-[15%] h-2 w-2 rounded-full bg-violet-400/30"
        />
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[15%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-400/30"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute left-[25%] bottom-[25%] h-1 w-1 rounded-full bg-amber-400/30"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute right-[30%] bottom-[15%] h-1.5 w-1.5 rounded-full bg-white/20"
        />
      </motion.div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
