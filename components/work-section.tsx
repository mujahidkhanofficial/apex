"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import type * as THREE from "three"
import { useIsMobile } from "@/hooks/use-mobile"

const projects = [
  {
    title: "E-commerce Redesign",
    category: "Shopify Development",
    image: "/modern-ecommerce-dark.png",
    tags: ["Shopify", "UI/UX", "Development"],
    description: "Complete overhaul of an online store with 40% conversion boost",
    year: "2024",
    client: "TechRetail Co.",
  },
  {
    title: "Brand Identity System",
    category: "Graphic Design",
    image: "/brand-identity-design-mockups-dark.jpg",
    tags: ["Branding", "Visual Design", "Guidelines"],
    description: "Comprehensive brand guidelines and visual identity creation",
    year: "2024",
    client: "Innovate Labs",
  },
  {
    title: "SaaS Platform",
    category: "Full Stack Development",
    image: "/saas-dashboard-interface-dark-mode.jpg",
    tags: ["React", "Node.js", "PostgreSQL"],
    description: "Enterprise-grade analytics dashboard with real-time data",
    year: "2023",
    client: "DataFlow Inc.",
  },
  {
    title: "Local Business Growth",
    category: "Local SEO",
    image: "/seo-analytics-dashboard-dark.jpg",
    tags: ["SEO", "Analytics", "Growth"],
    description: "300% increase in local search visibility and leads",
    year: "2024",
    client: "Metro Services",
  },
]

// Floating holographic frame for project display
function HolographicFrame({ isActive }: { isActive: boolean }) {
  const frameRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      frameRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group ref={frameRef}>
      {/* Corner brackets */}
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([x, y], i) => (
        <group key={i} position={[x * 2.2, y * 1.5, 0]}>
          <mesh rotation={[0, 0, (i * Math.PI) / 2]}>
            <boxGeometry args={[0.4, 0.05, 0.05]} />
            <meshStandardMaterial
              color={isActive ? "#22c55e" : "#334155"}
              emissive={isActive ? "#22c55e" : "#000000"}
              emissiveIntensity={isActive ? 0.5 : 0}
            />
          </mesh>
          <mesh rotation={[0, 0, (i * Math.PI) / 2]} position={[0.175, -0.175, 0]}>
            <boxGeometry args={[0.05, 0.4, 0.05]} />
            <meshStandardMaterial
              color={isActive ? "#22c55e" : "#334155"}
              emissive={isActive ? "#22c55e" : "#000000"}
              emissiveIntensity={isActive ? 0.5 : 0}
            />
          </mesh>
        </group>
      ))}

      {/* Floating data orbs */}
      {isActive && (
        <>
          <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[-2.8, 0.5, 0.5]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
            </mesh>
          </Float>
          <Float speed={3} rotationIntensity={0.5} floatIntensity={1.5}>
            <mesh position={[2.8, -0.3, 0.3]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} />
            </mesh>
          </Float>
          <Float speed={5} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh position={[2.5, 1.2, -0.2]}>
              <octahedronGeometry args={[0.12]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.8} />
            </mesh>
          </Float>
        </>
      )}
    </group>
  )
}

// Animated grid floor
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1
    }
  })

  return (
    <group position={[0, -2, 0]} rotation={[0, 0, 0]}>
      <gridHelper ref={gridRef} args={[20, 20, "#22c55e", "#0a0a0a"]} rotation={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#030303" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

// Orbiting ring
function OrbitalRing({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * speed
      ringRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.6} />
    </mesh>
  )
}

// Central data core
function DataCore({ activeIndex }: { activeIndex: number }) {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.5
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <group position={[0, 0, -2]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.8, 1]} />
          <MeshDistortMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={0.3}
            wireframe
            distort={0.2}
            speed={2}
          />
        </mesh>
      </Float>
      <OrbitalRing radius={1.5} speed={0.3} color="#22c55e" />
      <OrbitalRing radius={2} speed={-0.2} color="#166534" />
      <OrbitalRing radius={2.5} speed={0.15} color="#14532d" />
    </group>
  )
}

// Particle system
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 100

  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
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

export function WorkSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeProject = projects[activeIndex]
  const isMobile = useIsMobile()

  const nextProject = () => setActiveIndex((prev) => (prev + 1) % projects.length)
  const prevProject = () => setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextProject, 5000)
    return () => clearInterval(interval)
  }, [isPaused, nextProject])

  return (
    <section id="work" className="py-32 px-6 bg-background relative overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-mono">{"// Selected Work"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Recent Projects</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-mono text-sm">
              [{String(activeIndex + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}]
            </span>
            <div className="flex gap-2">
              <button
                onClick={prevProject}
                className="p-2 border border-border rounded-sm hover:border-primary hover:bg-primary/10 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextProject}
                className="p-2 border border-border rounded-sm hover:border-primary hover:bg-primary/10 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <div
          className="grid lg:grid-cols-2 gap-8 items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 3D Canvas with project display */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm"
          >
            {(isMobile === false) && (
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.5} color="#22c55e" />
                <pointLight position={[-5, -5, 5]} intensity={0.3} color="#ffffff" />

                <HolographicFrame isActive={true} />
                <DataCore activeIndex={activeIndex} />
                <GridFloor />
                <Particles />
              </Canvas>
            )}

            {/* Project image overlay */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-12 rounded-sm overflow-hidden"
              >
                <Image
                  src={activeProject.image || "/placeholder.svg"}
                  alt={activeProject.title}
                  fill
                  className="object-cover"
                />
                {/* Holographic overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 mix-blend-overlay opacity-30">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute w-full h-px bg-primary/20" style={{ top: `${i * 5}%` }} />
                  ))}
                </div>
                {/* Scanning line */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />

            {/* Status indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-mono">LIVE_PREVIEW</span>
            </div>
          </motion.div>

          {/* Project info panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Category badge */}
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-mono">
                    {activeProject.category}
                  </span>
                  <span className="text-muted-foreground font-mono text-sm">{activeProject.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">{activeProject.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed">{activeProject.description}</p>

                {/* Client info */}
                <div className="flex items-center gap-4 py-4 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Client</p>
                    <p className="text-foreground font-medium">{activeProject.client}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Year</p>
                    <p className="text-foreground font-medium">{activeProject.year}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {activeProject.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-4 py-2 bg-secondary/50 border border-border/50 rounded-sm text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* View project button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  <span>View Case Study</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Project thumbnails */}
            <div className="flex gap-3 pt-6 border-t border-border/50">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex-1 aspect-video rounded-sm overflow-hidden border-2 transition-all ${index === activeIndex
                    ? "border-primary shadow-lg shadow-primary/20"
                    : "border-border/50 opacity-50 hover:opacity-80"
                    }`}
                >
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                  {index === activeIndex && <div className="absolute inset-0 bg-primary/10" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
