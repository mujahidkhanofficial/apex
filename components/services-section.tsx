"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion, useInView } from "framer-motion"
import { Search, Code2, Palette, PenTool, ShoppingBag, ArrowUpRight } from "lucide-react"
import * as THREE from "three"

const services = [
  {
    icon: Search,
    title: "Local SEO",
    description:
      "Dominate local search results and attract nearby customers with our proven SEO strategies tailored for your market.",
    features: ["Google Business Optimization", "Local Citations", "Review Management", "Geo-targeted Content"],
    color: "#22c55e",
    geometry: "octahedron",
  },
  {
    icon: Code2,
    title: "Full Stack Development",
    description: "End-to-end web solutions built with modern technologies that scale with your business needs.",
    features: ["Custom Web Apps", "API Development", "Database Design", "Cloud Deployment"],
    color: "#3b82f6",
    geometry: "icosahedron",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description:
      "Visual storytelling that captures your brand essence and connects with your audience on every platform.",
    features: ["Brand Identity", "UI/UX Design", "Marketing Materials", "Social Media Assets"],
    color: "#f43f5e",
    geometry: "dodecahedron",
  },
  {
    icon: PenTool,
    title: "Content Writing",
    description: "Compelling narratives that engage, inform, and convert your target audience into loyal customers.",
    features: ["SEO Copywriting", "Blog Content", "Brand Messaging", "Email Campaigns"],
    color: "#a855f7",
    geometry: "torusKnot",
  },
  {
    icon: ShoppingBag,
    title: "Shopify Development",
    description: "Custom e-commerce solutions that turn browsers into buyers with seamless shopping experiences.",
    features: ["Custom Themes", "App Integration", "Payment Setup", "Store Optimization"],
    color: "#f97316",
    geometry: "torus",
  },
]

// 3D Floating Shape Component
function FloatingShape({ geometry, color, isHovered }: { geometry: string; color: string; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.3
      meshRef.current.rotation.y = time * 0.4
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1
      const scale = isHovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = time * 0.2
      wireframeRef.current.rotation.y = time * 0.3
      const scale = isHovered ? 1.5 : 1.3
      wireframeRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1
    }
  })

  const getGeometry = (type: string, size: number) => {
    switch (type) {
      case "octahedron":
        return <octahedronGeometry args={[size, 0]} />
      case "icosahedron":
        return <icosahedronGeometry args={[size, 0]} />
      case "dodecahedron":
        return <dodecahedronGeometry args={[size, 0]} />
      case "torusKnot":
        return <torusKnotGeometry args={[size * 0.6, size * 0.2, 100, 16]} />
      case "torus":
        return <torusGeometry args={[size * 0.7, size * 0.3, 16, 32]} />
      default:
        return <octahedronGeometry args={[size, 0]} />
    }
  }

  // Generate particles
  const particleCount = 30
  const particlePositions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = 1.2 + Math.random() * 0.5
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    particlePositions[i * 3 + 2] = r * Math.cos(phi)
  }

  return (
    <group>
      {/* Main solid shape */}
      <mesh ref={meshRef}>
        {getGeometry(geometry, 0.6)}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wireframe outer shell */}
      <mesh ref={wireframeRef}>
        {getGeometry(geometry, 0.6)}
        <meshBasicMaterial color={color} wireframe transparent opacity={isHovered ? 0.6 : 0.3} />
      </mesh>

      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color={color} transparent opacity={isHovered ? 0.8 : 0.4} sizeAttenuation />
      </points>

      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.6 : 0.2} />
      </mesh>

      {/* Second orbital ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.1, 0.008, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 0.4 : 0.15} />
      </mesh>

      {/* Lights */}
      <pointLight color={color} intensity={isHovered ? 2 : 0.5} distance={5} />
    </group>
  )
}

// Service Card Component
function ServiceCard({
  service,
  index,
  isInView: isCardVisible, // Renamed to avoid conflict
}: {
  service: (typeof services)[0]
  index: number
  isInView: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef(null)
  const isCanvasInView = useInView(canvasRef, { margin: "0px", amount: 0.2 }) // Strict viewport tracking

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isCardVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glowing border effect */}
      <div
        className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${service.color}40, transparent, ${service.color}40)` }}
      />

      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-500">
        {/* 3D Canvas or Static Fallback */}
        <div ref={canvasRef} className="h-48 relative overflow-hidden flex items-center justify-center">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${service.color}20 1px, transparent 1px), linear-gradient(90deg, ${service.color}20 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              background: isHovered
                ? `linear-gradient(180deg, transparent 0%, ${service.color}10 50%, transparent 100%)`
                : "transparent",
              animation: isHovered ? "scanService 2s linear infinite" : "none",
            }}
          />

          {isCanvasInView ? (
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <FloatingShape geometry={service.geometry} color={service.color} isHovered={isHovered} />
            </Canvas>
          ) : (
            // Optional: Static placeholder to avoid empty space if desired, or just empty
            <div className="relative z-10 opacity-20">
              <service.icon size={48} color={service.color} />
            </div>
          )}

          {/* Corner accents */}
          <div
            className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: service.color }}
          />
          <div
            className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: service.color }}
          />
          <div
            className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: service.color }}
          />
          <div
            className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: service.color }}
          />

          {/* Status indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: service.color, boxShadow: `0 0 10px ${service.color}` }}
            />
            <span className="text-xs font-mono opacity-60" style={{ color: service.color }}>
              ACTIVE
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Gradient line separator */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${service.color}50, transparent)` }}
          />

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: `${service.color}15`,
                  boxShadow: isHovered ? `0 0 20px ${service.color}30` : "none",
                }}
              >
                <service.icon className="w-5 h-5" style={{ color: service.color }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
            </div>
            <ArrowUpRight
              className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ color: service.color }}
            />
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>

          {/* Features with animated bullets */}
          <ul className="space-y-2">
            {service.features.map((feature, i) => (
              <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={isCardVisible ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: service.color, boxShadow: `0 0 6px ${service.color}` }}
                />
                <span className="group-hover:text-foreground/80 transition-colors">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Bottom tech line */}
          <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">SERVICE.0{index + 1}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i <= index ? service.color : `${service.color}30`,
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="services" className="py-32 px-6 bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating orbs in background */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-mono uppercase tracking-wider">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            What We Do <span className="text-primary">Best</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From concept to execution, we deliver comprehensive digital solutions that drive real business results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} isInView={isInView} />
          ))}
        </div>
      </div>

      {/* Scan animation style */}
      <style jsx global>{`
        @keyframes scanService {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </section>
  )
}
