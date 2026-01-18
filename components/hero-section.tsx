"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import { Suspense, useRef, useMemo } from "react"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import type * as THREE from "three"

function ServiceShape({
  geometry,
  color,
  position,
  scale = 1,
  speed = 1,
  isMobile = false,
}: {
  geometry: string
  color: string
  position: [number, number, number]
  scale?: number
  speed?: number
  isMobile?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.3
      meshRef.current.rotation.y = time * 0.4
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = time * 0.2
      wireframeRef.current.rotation.y = time * 0.3
    }
  })

  const getGeometry = (type: string, size: number) => {
    // Reduce segments for mobile
    const segments = isMobile ? 0 : undefined
    const torusRadial = isMobile ? 8 : 16
    const torusTubular = isMobile ? 48 : 100

    switch (type) {
      case "octahedron":
        return <octahedronGeometry args={[size, 0]} />
      case "icosahedron":
        return <icosahedronGeometry args={[size, 0]} />
      case "dodecahedron":
        return <dodecahedronGeometry args={[size, 0]} />
      case "torusKnot":
        return <torusKnotGeometry args={[size * 0.6, size * 0.2, torusTubular, torusRadial]} />
      case "torus":
        return <torusGeometry args={[size * 0.7, size * 0.3, torusRadial, 32]} />
      default:
        return <octahedronGeometry args={[size, 0]} />
    }
  }

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position} scale={scale}>
        {/* Main solid shape */}
        <mesh ref={meshRef}>
          {getGeometry(geometry, 0.5)}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Wireframe outer shell - conditional on mobile to save draw calls? keeping for style but maybe simpler */}
        <mesh ref={wireframeRef} scale={1.4}>
          {getGeometry(geometry, 0.5)}
          <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
        </mesh>

        {/* Orbital ring - skip on mobile for perf */}
        {!isMobile && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.8, 0.008, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
        )}

        {/* Glow light - reduce intensity or distance on mobile */}
        <pointLight color={color} intensity={isMobile ? 0.5 : 1} distance={isMobile ? 2 : 4} />
      </group>
    </Float>
  )
}

function MinimalParticles({ count = 50 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Mix of service colors
      const colorChoice = Math.random()
      if (colorChoice < 0.2) {
        colors[i3] = 0.13
        colors[i3 + 1] = 0.77
        colors[i3 + 2] = 0.37 // green
      } else if (colorChoice < 0.4) {
        colors[i3] = 0.23
        colors[i3 + 1] = 0.51
        colors[i3 + 2] = 0.96 // blue
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.96
        colors[i3 + 1] = 0.25
        colors[i3 + 2] = 0.37 // rose
      } else if (colorChoice < 0.8) {
        colors[i3] = 0.66
        colors[i3 + 1] = 0.33
        colors[i3 + 2] = 0.97 // purple
      } else {
        colors[i3] = 0.98
        colors[i3 + 1] = 0.45
        colors[i3 + 2] = 0.09 // orange
      }
    }

    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function Scene3D() {
  const { viewport } = useThree()
  // Use viewport width for layout/responsive decisions
  const isMobileLayout = viewport.width < 7
  // Assume if it's small layout, we want mobile optimizations too
  const isMobile = isMobileLayout

  return (
    <>
      <ambientLight intensity={0.5} />
      {/* Reduce lights on mobile */}
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {!isMobile && <pointLight position={[-10, -10, -10]} intensity={0.3} />}

      {/* Service-themed shapes - Centered for mobile visibility */}
      <ServiceShape
        geometry="octahedron"
        color="#22c55e"
        position={isMobileLayout ? [-1.5, 1.2, -1] : [-4, 1, -2]}
        scale={isMobileLayout ? 0.7 : 1.2}
        speed={0.8}
        isMobile={isMobile}
      />
      <ServiceShape
        geometry="icosahedron"
        color="#3b82f6"
        position={isMobileLayout ? [1.5, -1.5, -1] : [4, -0.5, -1]}
        scale={isMobileLayout ? 0.6 : 1}
        speed={0.6}
        isMobile={isMobile}
      />
      <ServiceShape
        geometry="dodecahedron"
        color="#f43f5e"
        position={isMobileLayout ? [-1.2, -0.5, 0] : [-2, -1.5, 0]}
        scale={isMobileLayout ? 0.5 : 0.8}
        speed={1}
        isMobile={isMobile}
      />
      <ServiceShape
        geometry="torusKnot"
        color="#a855f7"
        position={isMobileLayout ? [1.2, 0.8, -2] : [3, 1.5, -3]}
        scale={isMobileLayout ? 0.5 : 0.9}
        speed={0.7}
        isMobile={isMobile}
      />
      <ServiceShape
        geometry="torus"
        color="#f97316"
        position={isMobileLayout ? [0, 2.5, -2] : [0, 2, -4]}
        scale={isMobileLayout ? 0.5 : 0.7}
        speed={0.9}
        isMobile={isMobile}
      />

      {/* Subtle particles - reduced on mobile */}
      <MinimalParticles count={isMobile ? 15 : 40} />

      <Environment preset="night" />
    </>
  )
}

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-background">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ preserveDrawingBuffer: true, antialias: true }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-6">
        <div className="max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full border border-border bg-card/50 backdrop-blur-md mb-6 sm:mb-8 hover:border-primary/50 transition-colors mt-4 sm:mt-0">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] sm:text-xs font-mono text-foreground uppercase tracking-wider font-medium">Online</span>
            </span>
            <span className="w-px h-3 sm:h-4 bg-border" />
            <span className="text-[10px] sm:text-xs font-mono text-primary uppercase tracking-wider font-medium">Digital Agency</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[1.1] mb-6 text-balance">
            We Build
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary mt-2">
              Digital Experiences
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed">
            A few skilled humans doing the work of many. We help brands grow through strategic design, development, and
            digital marketing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="#work"
              className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-primary-foreground font-medium rounded-md overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] text-center"
            >
              <span className="relative z-10">View Our Work</span>
            </Link>
            <Link
              href="#contact"
              className="px-6 sm:px-8 py-3.5 sm:py-4 border border-border text-foreground font-medium rounded-md hover:bg-card hover:border-primary/30 transition-all backdrop-blur-sm text-center"
            >
              Start a Project
            </Link>
          </div>

          {/* Service Legend - Grid layout for balanced mobile display */}
          <div className="mt-10 sm:mt-16 grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-x-2 gap-y-3 sm:gap-6 px-2 sm:px-4 max-w-xs sm:max-w-none mx-auto">
            {[
              { color: "#22c55e", label: "SEO" },
              { color: "#3b82f6", label: "Dev" },
              { color: "#f43f5e", label: "Design" },
              { color: "#a855f7", label: "Content" },
              { color: "#f97316", label: "E-Com" },
            ].map((service, index) => (
              <div
                key={service.label}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 ${index === 3 ? 'col-start-1 sm:col-auto' : ''
                  } ${index === 4 ? 'col-start-2 sm:col-auto' : ''}`}
              >
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                  style={{ backgroundColor: service.color, boxShadow: `0 0 8px ${service.color}` }}
                />
                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  {service.label}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Indicator - Only shown on sm+ screens to prevent mobile overlap */}
          <div className="hidden sm:flex mt-10 flex-col items-center">
            <Link
              href="#about"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
              <ArrowDown size={18} className="animate-bounce" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
