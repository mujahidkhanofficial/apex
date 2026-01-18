"use client"

import { useRef, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei"
import type * as THREE from "three"

const stats = [
  { value: "50+", label: "Projects Delivered", icon: "rocket" },
  { value: "5", label: "Expert Team Members", icon: "users" },
  { value: "98%", label: "Client Satisfaction", icon: "heart" },
  { value: "24/7", label: "Support Available", icon: "clock" },
]

function DigitalGlobe() {
  const globeRef = useRef<THREE.Group>(null)
  const nodesRef = useRef<THREE.Group>(null)

  // Standard segments (optimization handled by viewport culling now, but keeping reasonable defaults)
  const globeSegments = 32
  const wireframeSegments = 24
  const torusRadial = 8
  const torusTubular = 64

  // Generate connection nodes around the globe
  const nodes = useMemo(() => {
    const points = []
    const nodeCount = 20
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi
      const x = 1.5 * Math.cos(theta) * Math.sin(phi)
      const y = 1.5 * Math.sin(theta) * Math.sin(phi)
      const z = 1.5 * Math.cos(phi)
      points.push({ x, y, z, delay: i * 0.1 })
    }
    return points
  }, [])

  // Generate connection lines between nearby nodes
  const connections = useMemo(() => {
    const lines: { start: number; end: number }[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2),
        )
        if (dist < 1.5) {
          lines.push({ start: i, end: j })
        }
      }
    }
    return lines
  }, [nodes])

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    if (nodesRef.current) {
      nodesRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <group>
      {/* Main globe group */}
      <group ref={globeRef}>
        {/* Core sphere with glow */}
        <Sphere args={[1.4, globeSegments, globeSegments]}>
          <meshStandardMaterial color="#0a0a0a" emissive="#22c55e" emissiveIntensity={0.05} transparent opacity={0.3} />
        </Sphere>

        {/* Wireframe sphere */}
        <Sphere args={[1.45, wireframeSegments, wireframeSegments]}>
          <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.15} />
        </Sphere>

        {/* Latitude lines */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => {
          const radius = Math.sqrt(1 - y * y) * 1.5
          return (
            <mesh key={`lat-${i}`} position={[0, y * 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.008, torusRadial, torusTubular]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.3}
                transparent
                opacity={0.4}
              />
            </mesh>
          )
        })}

        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => (
          <mesh key={`long-${i}`} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <torusGeometry args={[1.5, 0.008, torusRadial, torusTubular]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.3}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Connection nodes */}
      <group ref={nodesRef}>
        {nodes.map((node, i) => (
          <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.2}>
            <mesh position={[node.x, node.y, node.z]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
            </mesh>
            {/* Node glow ring */}
            <mesh position={[node.x, node.y, node.z]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.3}
                transparent
                opacity={0.3}
              />
            </mesh>
          </Float>
        ))}

        {/* Connection lines between nodes */}
        {connections.map((conn, i) => {
          const start = nodes[conn.start]
          const end = nodes[conn.end]
          const midX = (start.x + end.x) / 2
          const midY = (start.y + end.y) / 2
          const midZ = (start.z + end.z) / 2
          const length = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2) + Math.pow(end.z - start.z, 2),
          )

          return (
            <mesh key={`conn-${i}`} position={[midX, midY, midZ]} lookAt={[end.x, end.y, end.z]}>
              <cylinderGeometry args={[0.005, 0.005, length, 4]} />
              <meshStandardMaterial
                color="#22c55e"
                emissive="#22c55e"
                emissiveIntensity={0.5}
                transparent
                opacity={0.3}
              />
            </mesh>
          )
        })}
      </group>

      {/* Outer orbital rings */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 100]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <torusGeometry args={[2.4, 0.01, 16, 100]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>

      {/* Orbiting satellites */}
      <OrbitingSatellite radius={2.2} speed={0.8} offset={0} />
      <OrbitingSatellite radius={2.4} speed={0.6} offset={Math.PI} />
    </group>
  )
}

function OrbitingSatellite({ radius, speed, offset }: { radius: number; speed: number; offset: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset
      meshRef.current.position.x = Math.cos(t) * radius
      meshRef.current.position.z = Math.sin(t) * radius
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.8} />
    </mesh>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const count = 100

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 1.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#22c55e" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 5, 5]} intensity={0.6} color="#ffffff" />
      <DigitalGlobe />
      <FloatingParticles />
    </>
  )
}

function StatCard3D({ icon }: { icon: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  const getGeometry = () => {
    switch (icon) {
      case "rocket":
        return <coneGeometry args={[0.5, 1, 4]} />
      case "users":
        return <dodecahedronGeometry args={[0.5, 0]} />
      case "heart":
        return <octahedronGeometry args={[0.5, 0]} />
      case "clock":
        return <torusGeometry args={[0.4, 0.15, 16, 32]} />
      default:
        return <boxGeometry args={[0.6, 0.6, 0.6]} />
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#22c55e" />
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          {getGeometry()}
          <MeshDistortMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} distort={0.2} speed={2} />
        </mesh>
      </Float>
    </>
  )
}

const StatCardWithCanvas = ({ stat }: { stat: (typeof stats)[0] }) => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { margin: "0px", amount: 0.5 })

  return (
    <div ref={containerRef} className="h-20 w-20 mx-auto mb-4 flex items-center justify-center">
      {isInView ? (
        <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
          <StatCard3D icon={stat.icon} />
        </Canvas>
      ) : (
        // Static fallback/placeholder when out of view
        <div className="text-secondary/20">
          {/* Optional: Icon placeholder */}
        </div>
      )}
    </div>
  )
}

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Local ref for DigitalGlobe visualization
  const globeContainerRef = useRef(null)
  const isGlobeInView = useInView(globeContainerRef, { margin: "0px", amount: 0.2 })

  return (
    <section id="about" className="py-32 px-6 bg-background relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <p className="text-primary text-sm uppercase tracking-[0.3em] font-mono">// About Us</p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Global Reach,{" "}
              <span className="text-primary relative">
                Local Impact
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              ApexMediaDigital is a creative hub where brands and businesses come to define who they are, sharpen their
              vision, and carve out what&apos;s next. We help brands find their voice through strategic digital
              solutions.
            </p>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Because when vision and execution move in sync, the best results don&apos;t just happen, they flow.
              That&apos;s why we focus on building partnerships that fuel not just projects, but whole business
              transformations.
            </p>

            <div className="flex flex-wrap gap-3">
              {["Innovation", "Strategy", "Execution", "Growth"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-mono rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
            ref={globeContainerRef}
          >
            <div className="aspect-square relative">
              {/* 3D Canvas - Viewport Controlled */}
              <div className="absolute inset-0">
                {isGlobeInView && (
                  <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                    <AboutScene />
                  </Canvas>
                )}
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/50" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/50" />

              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ top: ["0%", "100%"] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>

              <div className="absolute top-4 left-4 text-xs font-mono text-primary/70">
                <span className="text-primary">●</span> WORLDWIDE
              </div>
              <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
                DIGITAL.PRESENCE.ACTIVE
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded-sm overflow-hidden hover:border-primary/50 transition-colors duration-300">
                {/* 3D Icon or Static Fallback */}
                <StatCardWithCanvas stat={stat} />

                {/* Stat value */}
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 text-center font-mono">{stat.value}</p>
                <p className="text-muted-foreground text-sm text-center">{stat.label}</p>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-primary/30 group-hover:border-primary/60 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-primary/30 group-hover:border-primary/60 transition-colors duration-300" />

                {/* Tech label */}
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-mono text-primary/50">0{index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
