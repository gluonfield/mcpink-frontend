import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import type { OnboardingStep } from '../types'

// Images from akella/webGLImageTransitions repo
const STEP_IMAGES: Record<OnboardingStep, string> = {
  welcome: '/img/img31.jpg',
  'github-app': '/img/img32.jpg',
  'github-repo': '/img/img33.jpg',
  'agent-key': '/img/img41.jpg',
  complete: '/img/img51.jpg'
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

// Demo3 fragment shader - circular wipe transition
const fragmentShader = `
  uniform float time;
  uniform float progress;
  uniform float width;
  uniform float radius;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform sampler2D displacement;
  uniform vec4 resolution;

  varying vec2 vUv;

  float parabola(float x, float k) {
    return pow(4.0 * x * (1.0 - x), k);
  }

  void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec2 start = vec2(0.5, 0.5);
    vec2 aspect = resolution.wz;

    vec2 uv = newUV;
    float dt = parabola(progress, 1.0);
    vec4 noise = texture2D(displacement, fract(vUv + time * 0.04));
    float prog = progress * 0.66 + noise.g * 0.04;
    float circ = 1.0 - smoothstep(-width, 0.0, radius * distance(start * aspect, uv * aspect) - prog * (1.0 + width));
    float intpl = pow(abs(circ), 1.0);
    vec4 t1 = texture2D(texture1, (uv - 0.5) * (1.0 - intpl) + 0.5);
    vec4 t2 = texture2D(texture2, (uv - 0.5) * intpl + 0.5);
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
  const progressRef = useRef(0)
  const texture1Ref = useRef<THREE.Texture>(textures[currentStep])
  const texture2Ref = useRef<THREE.Texture>(textures[currentStep])

  // Duration matching the original
  const duration = 1.5

  // Create uniforms object once
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      progress: { value: 0 },
      width: { value: 0.35 },
      radius: { value: 0.9 },
      texture1: { value: textures[currentStep] },
      texture2: { value: textures[currentStep] },
      displacement: { value: textures.displacement },
      resolution: { value: new THREE.Vector4(size.width, size.height, 1, 1) }
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
    isRunningRef.current = true
  }, [currentStep, previousStep, textures])

  // Animation loop
  useFrame((state, delta) => {
    if (!materialRef.current) return

    // Update time uniform for noise animation
    materialRef.current.uniforms.time.value = state.clock.elapsedTime

    // Calculate resolution for image cover effect
    const texture = texture1Ref.current
    const image = texture.image as HTMLImageElement | undefined
    if (image) {
      const imageAspect = image.height / image.width
      const screenAspect = size.height / size.width

      let a1, a2
      if (screenAspect > imageAspect) {
        a1 = (size.width / size.height) * imageAspect
        a2 = 1
      } else {
        a1 = 1
        a2 = size.height / size.width / imageAspect
      }

      materialRef.current.uniforms.resolution.value.set(size.width, size.height, a1, a2)
    }

    // Animate progress during transition
    if (isRunningRef.current) {
      progressRef.current += delta / duration

      if (progressRef.current >= 1) {
        progressRef.current = 0
        isRunningRef.current = false
        // Swap textures - texture1 becomes the current image
        texture1Ref.current = texture2Ref.current
        materialRef.current.uniforms.progress.value = 0
      } else {
        // Apply easing
        const easedProgress = easeOut(progressRef.current)
        materialRef.current.uniforms.progress.value = easedProgress
      }
    }

    // Always keep texture uniforms updated
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

  // Client-only mounting
  useEffect(() => {
    setMounted(true)

    // Load all textures
    const loader = new THREE.TextureLoader()
    const texturePromises = Object.entries(STEP_IMAGES).map(([key, url]) =>
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
  }, [])

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
