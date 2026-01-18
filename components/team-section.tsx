"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Suspense } from "react"
import { Linkedin, Twitter, ChevronLeft, ChevronRight } from "lucide-react"
import type * as THREE from "three"
import Image from "next/image"

const teamMembers = [
  {
    name: "Muhammad Ali",
    role: "Graphic Designer",
    description: "Visual storyteller crafting compelling brand identities and stunning UI experiences that resonate with audiences.",
    skills: ["Brand Identity", "UI/UX Design", "Adobe Suite", "Motion Graphics"],
    color: "#f43f5e",
    image: "/team/muhammad-ali.png",
  },
  {
    name: "Mujahid Afridi",
    role: "Full Stack Developer",
    description: "Architecting scalable web solutions with cutting-edge technologies. Turning complex problems into elegant code.",
    skills: ["React / Next.js", "Node.js", "Database Design", "Cloud Architecture"],
    color: "#22c55e",
    image: "/team/mujahid-afridi.png",
  },
  {
    name: "Amar Manzoor",
    role: "Local SEO, Wordpress",
    description: "Helping local businesses dominate search rankings. Expert in GMB optimization and high-performance Wordpress sites.",
    skills: ["Local SEO", "GMB Optimization", "Wordpress Dev", "Citation Building"],
    color: "#3b82f6",
    image: "/team/amar-manzoor.png",
  },
  {
    name: "Muhammad Muavia",
    role: "Youtube Automation, Content Writer",
    description: "Driving channel growth through strategic content automation. Expert scriptwriting and video SEO strategies.",
    skills: ["Youtube Automation", "Content Writing", "Video SEO", "Scripting"],
    color: "#a855f7",
    image: "/team/muhammad-muavia.png",
  },
  {
    name: "Awais - Khan",
    role: "Local SEO, Wordpress",
    description: "Technical SEO specialist focused on organic growth, link building strategies, and robust CMS management.",
    skills: ["Technical SEO", "Link Building", "Analytics", "Wordpress Security"],
    color: "#f97316",
    image: "/team/awais-khan.png",
  },
]

function HolographicBackground({ color }: { color: string }) {
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(100 * 3)
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 2
    }
    return positions
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ringRef1.current) {
      ringRef1.current.rotation.z = t * 0.2
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.15
      ringRef2.current.rotation.y = Math.sin(t * 0.2) * 0.2
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <group position={[0, 0, -1]}>
      {/* Orbital rings behind the image */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[3, 0.015, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>

      {/* Background particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={100} args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color={color} transparent opacity={0.5} sizeAttenuation />
      </points>
    </group>
  )
}

export function TeamSection() {
  const ref = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeMember = teamMembers[activeIndex]

  const nextMember = () => setActiveIndex((prev) => (prev + 1) % teamMembers.length)
  const prevMember = () => setActiveIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextMember, 5000)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section id="team" className="py-32 px-6 bg-background relative overflow-hidden" ref={ref}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-mono">{"<Team />"}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">The Minds Behind Apex</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collective of specialists united by a passion for digital excellence.
          </p>
        </motion.div>

        <div
          className="grid lg:grid-cols-2 gap-8 items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px] relative"
          >
            {/* Frame corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50 z-20" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50 z-20" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/50 z-20" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/50 z-20" />

            {/* Holographic image container */}
            <div className="absolute inset-8 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  {/* Glowing border effect */}
                  <div
                    className="absolute inset-0 rounded-sm"
                    style={{
                      boxShadow: `0 0 60px ${activeMember.color}40, inset 0 0 60px ${activeMember.color}20`,
                      border: `1px solid ${activeMember.color}50`,
                    }}
                  />

                  {/* Main image */}
                  <div className="relative w-full h-full overflow-hidden rounded-sm">
                    <Image
                      src={activeMember.image || "/placeholder.svg"}
                      alt={activeMember.name}
                      fill
                      className="object-cover"
                      style={{
                        filter: `grayscale(30%) contrast(1.1)`,
                      }}
                    />

                    {/* Holographic overlay */}
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-30"
                      style={{
                        background: `linear-gradient(135deg, ${activeMember.color}40 0%, transparent 50%, ${activeMember.color}20 100%)`,
                      }}
                    />

                    {/* Scan lines effect */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
                      }}
                    />

                    {/* Animated scan line */}
                    <motion.div
                      className="absolute left-0 right-0 h-1 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${activeMember.color}, transparent)`,
                        boxShadow: `0 0 20px ${activeMember.color}`,
                      }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  </div>

                  {/* Corner accents */}
                  <div
                    className="absolute top-2 left-2 w-6 h-6 border-l border-t"
                    style={{ borderColor: activeMember.color }}
                  />
                  <div
                    className="absolute top-2 right-2 w-6 h-6 border-r border-t"
                    style={{ borderColor: activeMember.color }}
                  />
                  <div
                    className="absolute bottom-2 left-2 w-6 h-6 border-l border-b"
                    style={{ borderColor: activeMember.color }}
                  />
                  <div
                    className="absolute bottom-2 right-2 w-6 h-6 border-r border-b"
                    style={{ borderColor: activeMember.color }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3D Background elements */}
            <div className="absolute inset-0 z-0">
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.2} />
                  <pointLight position={[5, 5, 5]} intensity={0.3} color={activeMember.color} />
                  <HolographicBackground color={activeMember.color} />
                  <Environment preset="night" />
                </Suspense>
              </Canvas>
            </div>

            {/* Status indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-xs font-mono">PROFILE_ACTIVE</span>
            </div>

            {/* Member index */}
            <div className="absolute top-4 right-4 text-right z-20">
              <span className="text-4xl font-bold text-primary font-mono">0{activeIndex + 1}</span>
              <span className="text-muted-foreground text-lg font-mono">/0{teamMembers.length}</span>
            </div>
          </motion.div>

          {/* Member Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-sm relative overflow-hidden"
              >
                {/* Decorative line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-sm overflow-hidden relative"
                    style={{
                      boxShadow: `0 0 20px ${activeMember.color}40`,
                      border: `2px solid ${activeMember.color}`,
                    }}
                  >
                    <Image
                      src={activeMember.image || "/placeholder.svg"}
                      alt={activeMember.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{activeMember.name}</h3>
                    <p className="text-primary font-mono text-sm">{activeMember.role}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">{activeMember.description}</p>

                {/* Skills */}
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-mono">{"// Skills"}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeMember.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-sm font-mono rounded-sm hover:bg-primary/20 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Social links */}
                <div className="flex gap-3">
                  <button className="p-2 border border-border hover:border-primary hover:text-primary transition-colors rounded-sm">
                    <Linkedin size={18} />
                  </button>
                  <button className="p-2 border border-border hover:border-primary hover:text-primary transition-colors rounded-sm">
                    <Twitter size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {teamMembers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-8 h-1 rounded-full transition-all ${i === activeIndex ? "bg-primary w-12" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevMember}
                  className="p-3 border border-border hover:border-primary hover:text-primary transition-colors rounded-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMember}
                  className="p-3 border border-border hover:border-primary hover:text-primary transition-colors rounded-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {teamMembers.map((member, i) => (
            <button
              key={member.name}
              onClick={() => setActiveIndex(i)}
              className={`p-4 border rounded-sm text-left transition-all ${i === activeIndex ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-card/30"
                }`}
            >
              <div
                className="w-12 h-12 rounded-sm overflow-hidden relative mb-3"
                style={{
                  opacity: i === activeIndex ? 1 : 0.6,
                  boxShadow: i === activeIndex ? `0 0 15px ${member.color}40` : "none",
                  border: `1px solid ${i === activeIndex ? member.color : "transparent"}`,
                }}
              >
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <p
                className={`text-sm font-medium truncate ${i === activeIndex ? "text-foreground" : "text-muted-foreground"}`}
              >
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{member.role.split(" ")[0]}</p>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
