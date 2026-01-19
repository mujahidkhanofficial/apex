"use client"

import { useRef, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Rocket, Users, Heart, Clock, type LucideIcon } from "lucide-react"

const stats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "50+", label: "Projects Delivered", icon: Rocket },
  { value: "5", label: "Expert Team Members", icon: Users },
  { value: "98%", label: "Client Satisfaction", icon: Heart },
  { value: "24/7", label: "Support Available", icon: Clock },
]


// Simple Icon Display for Stats
const StatIcon = ({ stat }: { stat: (typeof stats)[0] }) => {
  const IconComponent = stat.icon
  return (
    <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
      <IconComponent className="w-8 h-8 text-primary" strokeWidth={1.5} />
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
              <p className="text-primary text-sm uppercase tracking-[0.3em] font-sans">// About Us</p>
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
                  className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-sans rounded-sm"
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
            <div className="aspect-square relative flex items-center justify-center p-8">
              {/* SVG Replacement for 3D Globe */}
              <div className="relative w-full h-full">
                <Image
                  src="/about-us.svg"
                  alt="Global Reach"
                  fill
                  className="object-contain"
                  priority
                />
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
                {/* Lucide Icon */}
                <StatIcon stat={stat} />

                {/* Stat value */}
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 text-center font-sans">{stat.value}</p>
                <p className="text-muted-foreground text-sm text-center">{stat.label}</p>

                {/* Hover glow */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-primary/30 group-hover:border-primary/60 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-primary/30 group-hover:border-primary/60 transition-colors duration-300" />

                {/* Tech label */}
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-sans text-primary/50">0{index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
