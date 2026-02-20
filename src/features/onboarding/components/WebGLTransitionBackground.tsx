import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import type { OnboardingStep } from '../types'

const BACKGROUND_IMAGES = Array.from({ length: 15 }, (_, i) => `/backgrounds/${i + 1}.webp`)

function getRandomStepImages(): Record<OnboardingStep, string> {
  const shuffled = [...BACKGROUND_IMAGES].sort(() => Math.random() - 0.5)
  return {
    welcome: shuffled[0],
    'mode-select': shuffled[1],
    'github-app': shuffled[2],
    'github-repo': shuffled[3],
    'agent-key': shuffled[4],
    complete: shuffled[5]
  }
}

const DISPLACEMENT_IMAGE = '/img/disp1.jpg'

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader - circular wipe transition with settle animation
const fragmentShader = `
  uniform float time;
  uniform float progress;
  uniform float settleProgress;
  uniform float width;
  uniform float radius;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform sampler2D displacement;
  uniform vec4 resolution;
  uniform vec2 resolution1;
  uniform vec2 resolution2;

  varying vec2 vUv;

  void main() {
    // Subtle movement that settles over time (settleProgress goes from 1 to 0)
    float movement = settleProgress * 0.008;
    vec2 drift = vec2(
      sin(time * 1.5) * movement,
      cos(time * 1.2) * movement * 0.6
    );

    // Calculate UVs for each texture with their own aspect ratios
    vec2 uv1 = (vUv - vec2(0.5)) * resolution1 + vec2(0.5) + drift;
    vec2 uv2 = (vUv - vec2(0.5)) * resolution2 + vec2(0.5) + drift;

    vec2 start = vec2(0.5, 0.5);

    vec4 noise = texture2D(displacement, fract(vUv + time * 0.04));
    float prog = progress * 0.66 + noise.g * 0.04;
    float circ = 1.0 - smoothstep(-width, 0.0, radius * distance(start, vUv) - prog * (1.0 + width));
    float intpl = pow(abs(circ), 1.0);

    vec4 t1 = texture2D(texture1, uv1);
    vec4 t2 = texture2D(texture2, uv2);

    gl_FragColor = mix(t1, t2, intpl);
  }
`

// Easing function matching GSAP Power2.easeOut
function easeOut(t: number): number {
  return t * (2 - t)
}

interface TransitionPlaneProps {
  currentStep: OnboardingStep
  previousStep: OnboardingStep | null
  textures: Record<OnboardingStep | 'displacement', THREE.Texture>
}

function TransitionPlane({ currentStep, previousStep, textures }: TransitionPlaneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport, size } = useThree()

  // Animation state - all refs to avoid stale closures
  const isRunningRef = useRef(false)
  const isSettlingRef = useRef(true)
  const progressRef = useRef(0)
  const settleProgressRef = useRef(1)
  const texture1Ref = useRef<THREE.Texture>(textures[currentStep])
  const texture2Ref = useRef<THREE.Texture>(textures[currentStep])

  // Duration matching the original
  const duration = 1.5
  const settleDuration = 2.0

  // Create uniforms object once
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      progress: { value: 0 },
      settleProgress: { value: 1 },
      width: { value: 0.35 },
      radius: { value: 0.9 },
      texture1: { value: textures[currentStep] },
      texture2: { value: textures[currentStep] },
      displacement: { value: textures.displacement },
      resolution: { value: new THREE.Vector4(size.width, size.height, 1, 1) },
      resolution1: { value: new THREE.Vector2(1, 1) },
      resolution2: { value: new THREE.Vector2(1, 1) }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textures]
  )

  // Handle step changes - trigger transition
  useEffect(() => {
    if (!previousStep || previousStep === currentStep) return
    if (isRunningRef.current) return

    // Set up the transition
    texture1Ref.current = textures[previousStep]
    texture2Ref.current = textures[currentStep]
    progressRef.current = 0
    settleProgressRef.current = 1
    isRunningRef.current = true
    isSettlingRef.current = false
  }, [currentStep, previousStep, textures])

  // Helper to calculate aspect ratio values
  const calculateAspect = (texture: THREE.Texture) => {
    const image = texture.image as HTMLImageElement | undefined
    if (!image) return { a1: 1, a2: 1 }

    const imageAspect = image.height / image.width
    const screenAspect = size.height / size.width

    if (screenAspect > imageAspect) {
      return { a1: (size.width / size.height) * imageAspect, a2: 1 }
    } else {
      return { a1: 1, a2: size.height / size.width / imageAspect }
    }
  }

  // Animation loop
  useFrame((state, delta) => {
    if (!materialRef.current) return

    // Update time uniform for noise animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime

    // Animate progress during transition - do this FIRST before calculating anything else
    if (isRunningRef.current) {
      progressRef.current += delta / duration

      if (progressRef.current >= 1) {
        progressRef.current = 0
        isRunningRef.current = false
        isSettlingRef.current = true
        settleProgressRef.current = 1
        // Swap textures - texture1 becomes the current image
        texture1Ref.current = texture2Ref.current
        materialRef.current.uniforms.progress.value = 0
      } else {
        // Apply easing
        const easedProgress = easeOut(progressRef.current)
        materialRef.current.uniforms.progress.value = easedProgress
      }
    }

    // Animate settle progress (movement that fades out over 2 seconds)
    if (isSettlingRef.current) {
      settleProgressRef.current -= delta / settleDuration
      if (settleProgressRef.current <= 0) {
        settleProgressRef.current = 0
        isSettlingRef.current = false
      }
    }
    materialRef.current.uniforms.settleProgress.value = settleProgressRef.current

    // Calculate resolution AFTER potential texture swap
    const aspect1 = calculateAspect(texture1Ref.current)
    const aspect2 = calculateAspect(texture2Ref.current)
    materialRef.current.uniforms.resolution.value.set(size.width, size.height, 1, 1)
    materialRef.current.uniforms.resolution1.value.set(aspect1.a1, aspect1.a2)
    materialRef.current.uniforms.resolution2.value.set(aspect2.a1, aspect2.a2)

    // Update texture uniforms
    materialRef.current.uniforms.texture1.value = texture1Ref.current
    materialRef.current.uniforms.texture2.value = texture2Ref.current
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

interface WebGLTransitionBackgroundProps {
  currentStep: OnboardingStep
  previousStep: OnboardingStep | null
}

export default function WebGLTransitionBackground({
  currentStep,
  previousStep
}: WebGLTransitionBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [textures, setTextures] = useState<Record<
    OnboardingStep | 'displacement',
    THREE.Texture
  > | null>(null)

  // Randomize images on each mount instead of at module level
  const stepImages = useMemo(() => getRandomStepImages(), [])

  // Client-only mounting
  useEffect(() => {
    setMounted(true)

    // Load all textures
    const loader = new THREE.TextureLoader()
    const texturePromises = Object.entries(stepImages).map(
      ([key, url]) =>
        new Promise<[string, THREE.Texture]>(resolve => {
          loader.load(url, texture => {
            resolve([key, texture])
          })
        })
    )

    // Load displacement texture
    const dispPromise = new Promise<[string, THREE.Texture]>(resolve => {
      loader.load(DISPLACEMENT_IMAGE, texture => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        resolve(['displacement', texture])
      })
    })

    Promise.all([...texturePromises, dispPromise]).then(results => {
      const textureMap = Object.fromEntries(results) as Record<
        OnboardingStep | 'displacement',
        THREE.Texture
      >
      setTextures(textureMap)
    })
  }, [stepImages])

  // Don't render on server or before textures load
  if (!mounted || !textures) {
    return <div className="fixed inset-0 z-0 bg-[#1a1a18]" />
  }

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 70 }}
        gl={{ antialias: true, alpha: false }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <Suspense fallback={null}>
          <TransitionPlane
            currentStep={currentStep}
            previousStep={previousStep}
            textures={textures}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
