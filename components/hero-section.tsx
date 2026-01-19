"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

// Dynamically import the 3D component to avoid SSR issues
const Robot3D = dynamic(() => import("./robot-3d"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})

function DynamicText() {
  const words = ["Dominance", "Experiences", "Impact", "Products", "Journeys"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="text-primary ml-1 sm:ml-2 md:ml-4">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function MagneticButton({ children, className, variant = "primary" }: { children: React.ReactNode, className?: string, variant?: "primary" | "ghost" }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const distanceX = clientX - centerX
    const distanceY = clientY - centerY

    x.set(distanceX * 0.35)
    y.set(distanceY * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Link
        href={children === "View Our Work" ? "#work" : "#contact"}
        className={`px-8 py-4 font-medium rounded-sm transition-all text-center block group/btn ${variant === "primary"
          ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]"
          : "border border-white/10 text-foreground hover:bg-white/[0.02] backdrop-blur-sm relative overflow-hidden"
          } ${className}`}
      >
        {variant === "ghost" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <div className="absolute inset-px rounded-[inherit] bg-background z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity -z-10" />
          </>
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  )
}

function InfiniteMarquee() {
  const items = [
    { color: "#22c55e", label: "SEO Optimization" },
    { color: "#3b82f6", label: "Full-Stack Development" },
    { color: "#f43f5e", label: "Brand Design" },
    { color: "#a855f7", label: "Content Strategy" },
    { color: "#f97316", label: "E-Commerce" },
  ]
  const doubledItems = [...items, ...items, ...items]

  return (
    <div className="relative flex overflow-hidden border-y border-border/30 bg-card/10 backdrop-blur-sm py-4 mt-auto">
      <motion.div
        animate={{ x: [0, -1035] }}
        transition={{ duration: 30, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        className="flex whitespace-nowrap gap-12 px-6"
      >
        {doubledItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ backgroundColor: item.color, boxShadow: `0 0 12px ${item.color}` }}
            />
            <span className="text-xs font-sans text-muted-foreground uppercase tracking-[0.2em]">
              {item.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

      {/* Ambient Bloom Glows */}
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Content Overlay - Asymmetrical Layout */}
      <div className="relative z-10 h-full flex flex-col pt-32">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:items-start justify-between flex-1 pb-20">
          {/* Text Content - Left Side */}
          <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-border bg-card/50 backdrop-blur-xl mb-12 w-fit mx-auto lg:mx-0 shadow-2xl"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                <span className="text-[10px] font-sans text-foreground uppercase tracking-widest font-semibold">Online</span>
              </span>
              <span className="w-px h-3 bg-border" />
              <span className="text-[10px] font-sans text-primary uppercase tracking-widest font-semibold">Digital Agency</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6 md:mb-8"
            >
              Human Craft.<br />
              <span className="md:whitespace-nowrap">
                Digital<DynamicText />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-12 leading-relaxed font-medium"
            >
              "A few skilled humans doing the work of many."<br />
              <span className="text-muted-foreground text-base md:text-lg block mt-4 font-normal">
                Strategic design, high-performance development, and engineer-led growth for modern brands.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 items-center lg:items-start"
            >
              <MagneticButton>View Our Work</MagneticButton>
              <MagneticButton variant="ghost">Start a Project</MagneticButton>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-16 text-center lg:text-left"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 mb-6 font-semibold">Trusted by innovators at:</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {["NovaFin", "MetroChains", "NovaFlow", "StreamerPro", "CorpSafe"].map((client) => (
                  <span key={client} className="text-sm md:text-base font-bold tracking-tighter text-muted-foreground">{client}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3D Robot - Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full lg:w-1/2 h-[450px] sm:h-[550px] lg:h-[700px] relative mt-12 lg:mt-0 flex items-center justify-center lg:justify-end"
          >
            {!hasMounted ? (
              // SSR placeholder
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Robot3D className="w-full h-full" />
            )}
          </motion.div>
        </div>

        {/* Dynamic Services Marquee */}
        <InfiniteMarquee />
      </div>


    </section>
  )
}
