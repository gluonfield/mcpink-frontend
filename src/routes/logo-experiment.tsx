import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/logo-experiment')({
  component: LogoExperimentPage,
  head: () => ({
    links: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,900&display=swap'
      }
    ]
  })
})

const H = 107

// Icon shape sizes
const BAR_W = 13
const CIRCLE_D = 26
const CIRCLE_BORDER = 3
const BASE_W = 36
const BASE_H = 15
const BAR_MATCH = BASE_H

const CONTAINER_W = 420
const CX = CONTAINER_W / 2

const smooth = [0.4, 0, 0.2, 1] as const

const spring = { type: 'spring' as const, stiffness: 180, damping: 20 }

// Icon positions (initial state)
const iconBarH = 66
const iconBarTop = 10
const iconBarLeft = CX - BAR_W / 2
const iconCircleLeft = CX - BAR_W - CIRCLE_D * 0.25 - 3
const iconCircleTop = 20
const iconBaseLeft = CX - BASE_W / 2
const ICON_GAP = 2 // gap between vertical bar and horizontal base
const iconBaseTop = iconBarTop + iconBarH + ICON_GAP

// Final "ml.ink" layout - centered around CX
const GLYPH_OFFSET = BASE_H + ICON_GAP // shift final text down to align with initial icon
const GLYPH_TOP = 12 + GLYPH_OFFSET
const GLYPH_BOT = H - 16

const TEXT_H = H - GLYPH_OFFSET
const fontSize = TEXT_H * 0.95
const GAP = 8

const TOTAL_W = 229
const startX = CX - TOTAL_W / 2

// "m"
const mLeft = startX
const mW = 70

// "l" — ascender, taller than x-height
const lLeft = mLeft + mW + GAP + 3
const lW = BAR_MATCH
const lTop = GLYPH_TOP - 8
const lH = GLYPH_BOT - lTop

// "." dot
const dotD = 14
const dotLeft = lLeft + lW + 3
const dotTop = GLYPH_BOT - dotD

// "i" — dot + stem, total height matches "l"
const iDotD = 14
const iLeft = dotLeft + dotD + 5
const iW = BAR_MATCH
const iDotLeft = iLeft + (iW - iDotD) / 2
const iDotTop = lTop
const iStemTop = iDotTop + iDotD + 5
const iStemH = GLYPH_BOT - iStemTop

// "n"
const nLeft = iLeft + iW + GAP - 2
const nW = 44

// "k"
const kLeft = nLeft + nW + GAP - 2

// Base bar → "i" stem transform
const baseFromCx = CX
const baseFromCy = iconBaseTop + BASE_H / 2
const baseToCx = iLeft + iW / 2
const baseToCy = iStemTop + iStemH / 2
const morphedXCorrection = (iStemH - BASE_W) / 2

export default function LogoExperimentPage() {
  const [morphed, setMorphed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [runKey, setRunKey] = useState(0)

  useEffect(() => {
    setMorphed(false)
    setShowText(false)
    const t1 = setTimeout(() => setMorphed(true), 1400)
    const t2 = setTimeout(() => setShowText(true), 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [runKey])

  const replay = (): void => {
    setMorphed(false)
    setShowText(false)
    setRunKey(k => k + 1)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        background: '#f0ede6',
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      <div key={runKey} style={{ position: 'relative', width: CONTAINER_W, height: H }}>
        {/* VERTICAL BAR → "l" */}
        <motion.div
          initial={false}
          animate={{
            left: morphed ? lLeft : iconBarLeft,
            top: morphed ? lTop : iconBarTop,
            width: morphed ? lW : BAR_W,
            height: morphed ? lH : iconBarH
          }}
          transition={{ duration: 0.9, ease: smooth }}
          style={{ position: 'absolute', background: '#1a1a1a', zIndex: 10 }}
        />

        {/* CIRCLE → "." */}
        <motion.div
          initial={false}
          animate={{
            left: morphed ? dotLeft : iconCircleLeft,
            top: morphed ? dotTop : iconCircleTop,
            width: morphed ? dotD : CIRCLE_D,
            height: morphed ? dotD : CIRCLE_D,
            borderWidth: morphed ? 0 : CIRCLE_BORDER
          }}
          transition={{ duration: 1, ease: smooth }}
          style={{
            position: 'absolute',
            background: '#1a1a1a',
            borderRadius: '50%',
            borderStyle: 'solid',
            borderColor: '#f0ede6',
            boxSizing: 'border-box',
            zIndex: 15
          }}
        />

        {/* HORIZONTAL BASE → "i" stem */}
        <motion.div
          initial={false}
          animate={{
            x: morphed ? baseToCx - baseFromCx - morphedXCorrection : 0,
            y: morphed ? baseToCy - baseFromCy : 0,
            rotate: morphed ? 90 : 0,
            width: morphed ? iStemH : BASE_W
          }}
          transition={{ duration: 1, ease: smooth }}
          style={{
            position: 'absolute',
            left: iconBaseLeft,
            top: iconBaseTop,
            width: BASE_W,
            height: BASE_H,
            background: '#1a1a1a',
            transformOrigin: 'center center',
            zIndex: 10
          }}
        />

        {/* "m" */}
        <motion.span
          initial={false}
          animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...spring, delay: showText ? 0 : 0 }}
          style={{
            position: 'absolute',
            left: mLeft,
            top: GLYPH_OFFSET,
            fontSize,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: `${TEXT_H}px`,
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          m
        </motion.span>

        {/* "i" dot */}
        <motion.div
          initial={false}
          animate={showText ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ ...spring, delay: showText ? 0.15 : 0 }}
          style={{
            position: 'absolute',
            left: iDotLeft,
            top: iDotTop,
            width: iDotD,
            height: iDotD,
            borderRadius: '50%',
            background: '#1a1a1a',
            zIndex: 10
          }}
        />

        {/* "n" */}
        <motion.span
          initial={false}
          animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...spring, delay: showText ? 0.1 : 0 }}
          style={{
            position: 'absolute',
            left: nLeft,
            top: GLYPH_OFFSET,
            fontSize,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: `${TEXT_H}px`,
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          n
        </motion.span>

        {/* "k" */}
        <motion.span
          initial={false}
          animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ ...spring, delay: showText ? 0.2 : 0 }}
          style={{
            position: 'absolute',
            left: kLeft,
            top: GLYPH_OFFSET,
            fontSize,
            fontWeight: 900,
            color: '#1a1a1a',
            lineHeight: `${TEXT_H}px`,
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          k
        </motion.span>
      </div>

      <button
        onClick={replay}
        style={{
          marginTop: 56,
          padding: '10px 28px',
          border: '1.5px solid #1a1a1a',
          background: 'transparent',
          color: '#1a1a1a',
          borderRadius: 100,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.8px',
          textTransform: 'uppercase' as const
        }}
      >
        Replay
      </button>
    </div>
  )
}
