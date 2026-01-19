"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
  {
    title: "ViralPulse Analytics",
    category: "YouTube Automation",
    image: "/youtube-automation.png",
    tags: ["Video SEO", "Automation", "Analytics"],
    description: "AI-driven channel growth system boosting organic views by 400%",
    year: "2024",
    client: "StreamerPro",
  },
  {
    title: "SecurePress Enterprise",
    category: "WordPress Security",
    image: "/wordpress-security.png",
    tags: ["Security", "Technical SEO", "Performance"],
    description: "Hardened WordPress infrastructure for high-traffic enterprise sites",
    year: "2024",
    client: "CorpSafe",
  },
  {
    title: "Apex Brand System",
    category: "Motion Graphics",
    image: "/motion-brand-system.png",
    tags: ["Motion Design", "Brand Identity", "3D"],
    description: "Comprehensive kinetic identity system for a fintech unicorn",
    year: "2024",
    client: "NovaFin",
  },
  {
    title: "LocalMap Dominator",
    category: "Local SEO",
    image: "/local-seo-map.png",
    tags: ["GMB", "Local SEO", "Maps"],
    description: "Hyper-local dominance strategy expanding reach to 50+ locations",
    year: "2024",
    client: "MetroChains",
  },
  {
    title: "Luxe Fashion E-com",
    category: "Shopify Development",
    image: "/modern-ecommerce-dark.png",
    tags: ["Shopify", "UI/UX", "Conversion"],
    description: "Complete overhaul of an online store with 40% conversion boost",
    year: "2023",
    client: "TechRetail",
  },
  {
    title: "NeonStream SaaS",
    category: "Full Stack Dev",
    image: "/saas-dashboard-interface-dark-mode.jpg",
    tags: ["React", "Node.js", "Cloud Arch"],
    description: "Enterprise-grade analytics dashboard with real-time data processing",
    year: "2023",
    client: "DataFlow",
  },
]



export function WorkSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeProject = projects[activeIndex]



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
            <p className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-sans">{"// Selected Work"}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Recent Projects</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-sans text-sm">
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
            {/* 3D Canvas removed */}

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
              </motion.div>
            </AnimatePresence>



            {/* Status indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-sm border border-primary/30 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary font-sans">LIVE_PREVIEW</span>
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
                  <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-sans">
                    {activeProject.category}
                  </span>
                  <span className="text-muted-foreground font-sans text-sm">{activeProject.year}</span>
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
