"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Search, Code2, Palette, PenTool, ShoppingBag, ArrowUpRight } from "lucide-react"

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
        <div className="h-48 relative overflow-hidden flex items-center justify-center">
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

          {/* Static Icon Placeholder */}
          <div className={`relative z-10 transition-all duration-500 ${isHovered ? "scale-110" : "scale-100"}`}>
            <div
              className="absolute inset-0 blur-xl opacity-20"
              style={{ backgroundColor: service.color }}
            />
            <service.icon size={64} color={service.color} strokeWidth={1.5} />
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
        </div>
      </div>
    </motion.div >
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
            <span className="text-primary text-sm font-sans uppercase tracking-wider">Our Services</span>
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
