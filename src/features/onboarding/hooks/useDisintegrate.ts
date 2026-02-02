import { toCanvas } from 'html-to-image'
import { useCallback, useRef } from 'react'

const COUNT = 75 // Number of canvas layers
const REPEAT_COUNT = 3 // Pixel repetition for density

interface DisintegrateOptions {
  duration?: number
  onComplete?: () => void
}

interface CanvasLayer {
  canvas: HTMLCanvasElement
  randomAngle: number
  randomRotationAngle: number
  delay: number
}

export function useDisintegrate() {
  const canvasLayersRef = useRef<CanvasLayer[]>([])
  const animationRef = useRef<number | null>(null)

  const cleanup = useCallback(() => {
    canvasLayersRef.current.forEach(layer => {
      if (layer.canvas.parentNode) {
        layer.canvas.parentNode.removeChild(layer.canvas)
      }
    })
    canvasLayersRef.current = []
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const disintegrate = useCallback(
    async (element: HTMLElement, options: DisintegrateOptions = {}) => {
      const { duration = 800, onComplete } = options

      cleanup()

      try {
        // Capture element as canvas using html-to-image
        const canvas = await toCanvas(element, {
          backgroundColor: undefined,
          pixelRatio: 1,
          skipFonts: true
        })

        const width = canvas.width
        const height = canvas.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          onComplete?.()
          return
        }

        const imageData = ctx.getImageData(0, 0, width, height)
        const dataList: ImageData[] = []

        // Create empty image data for each layer
        for (let i = 0; i < COUNT; i++) {
          dataList.push(ctx.createImageData(width, height))
        }

        // Distribute pixels across layers (same algorithm as CodePen)
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            for (let l = 0; l < REPEAT_COUNT; l++) {
              const index = (x + y * width) * 4
              const dataIndex = Math.floor((COUNT * (Math.random() + (2 * x) / width)) / 3)
              for (let p = 0; p < 4; p++) {
                dataList[dataIndex].data[index + p] = imageData.data[index + p]
              }
            }
          }
        }

        // Get element position for canvas placement
        const rect = element.getBoundingClientRect()

        // Hide original element
        element.style.opacity = '0'

        // Create canvas layers
        const layers: CanvasLayer[] = []

        dataList.forEach((data, i) => {
          const clonedCanvas = document.createElement('canvas')
          clonedCanvas.width = width
          clonedCanvas.height = height
          clonedCanvas.getContext('2d')?.putImageData(data, 0, 0)

          clonedCanvas.style.cssText = `
            position: fixed;
            left: ${rect.left}px;
            top: ${rect.top}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            pointer-events: none;
            z-index: 9999;
            will-change: transform, opacity;
          `

          document.body.appendChild(clonedCanvas)

          const randomAngle = (Math.random() - 0.5) * 2 * Math.PI
          const randomRotationAngle = 30 * (Math.random() - 0.5)
          const delay = (i / dataList.length) * 0.6 // Stagger delay

          layers.push({
            canvas: clonedCanvas,
            randomAngle,
            randomRotationAngle,
            delay
          })
        })

        canvasLayersRef.current = layers

        // Animate on click (not scroll)
        const startTime = performance.now()

        const animate = () => {
          const elapsed = performance.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          layers.forEach(layer => {
            // Apply staggered delay
            const adjustedProgress = Math.max(0, (progress - layer.delay) / (1 - layer.delay))

            if (adjustedProgress > 0) {
              // Easing: ease out cubic
              const eased = 1 - Math.pow(1 - adjustedProgress, 3)

              // Same animation as CodePen but triggered by time instead of scroll
              const translateX = 60 * Math.sin(layer.randomAngle) * eased
              const translateY = 60 * Math.cos(layer.randomAngle) * eased
              const rotate = layer.randomRotationAngle * eased
              const opacity = 1 - eased

              layer.canvas.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`
              layer.canvas.style.opacity = String(Math.max(0, opacity))
            }
          })

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            cleanup()
            onComplete?.()
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      } catch (error) {
        console.error('Disintegration failed:', error)
        element.style.opacity = '0'
        onComplete?.()
      }
    },
    [cleanup]
  )

  return { disintegrate, cleanup }
}
