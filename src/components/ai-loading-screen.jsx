"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function AILoadingScreen() {
  const steps = useMemo(() => ([
    { key: 'summarize', label: 'Summarizing your inputs', color: 'bg-accent' },
    { key: 'score', label: 'Scoring traits and preferences', color: 'bg-primary' },
    { key: 'match', label: 'Matching to Goa experiences', color: 'bg-emerald-500' },
    { key: 'insights', label: 'Crafting insights and recommendations', color: 'bg-pink-500' },
    { key: 'render', label: 'Polishing your Vibe Report', color: 'bg-yellow-500' },
  ]), [])

  const tips = useMemo(() => ([
    'Pro tip: North = energy, South = serenity — we balance both.',
    'We weigh priorities like budget, safety, and vibe automatically.',
    'Short on time? We optimize for high impact, low hassle plans.',
    'Your answers are never shared — analysis only, privacy always.',
    'Party vs. Relaxing is a spectrum — your score finds the sweet spot.',
  ]), [])

  const [progress, setProgress] = useState(6)
  const [tipIndex, setTipIndex] = useState(0)
  const lastProgressRef = useRef(6)
  const rafRef = useRef(null)
  const lastTsRef = useRef(0)

  useEffect(() => {
    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      setProgress((p) => {
        const target = 90
        // Base rate per second scaled by remaining distance for easing
        const baseRate = 14 // % per second at start
        const remaining = Math.max(0, target - p)
        const inc = Math.max(0.1, (remaining * 0.12 + baseRate * 0.2)) * dt
        let next = Math.min(target, p + inc)
        if (next < lastProgressRef.current) next = lastProgressRef.current
        lastProgressRef.current = next
        return Number(next.toFixed(2))
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = 0
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 3200)
    return () => clearInterval(id)
  }, [tips.length])

  const currentStepIndex = useMemo(() => {
    if (progress < 20) return 0
    if (progress < 40) return 1
    if (progress < 65) return 2
    if (progress < 85) return 3
    return 4
  }, [progress])

  const ProgressBar = () => (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{Math.round(progress)}%</span>
        <span>Optimizing...</span>
      </div>
      <div className="relative w-full h-2 rounded-full bg-muted/40 overflow-hidden border border-border/30">
        <motion.div
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent via-primary to-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>
    </div>
  )

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.10),transparent_40%)] rounded-3xl" />

        {/* Card */}
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/40 p-8 flex flex-col items-center text-center space-y-8">
          
          {/* Spinner + Logo */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 border-[3px] border-primary/70 border-t-transparent rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight">Analyzing your vibe…</h2>
            <p className="text-sm text-muted-foreground leading-snug">
              Turning your choices into a personalized Goa game-plan.
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm"><ProgressBar /></div>

          {/* Steps */}
          <div className="w-full max-w-md flex flex-col gap-2 min-h-[116px]">
            {steps.map((s, idx) => (
              <div
                key={s.key}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  idx <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${s.color} ${idx === currentStepIndex ? 'animate-pulse' : 'opacity-40'}`} />
                <span>{s.label}</span>
                {idx < currentStepIndex && (
                  <span className="ml-auto text-[10px] text-emerald-600 font-medium">done</span>
                )}
              </div>
            ))}
          </div>

          {/* Tip rotator */}
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-xs text-muted-foreground min-h-[44px] flex items-center"
          >
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6 6.002 6.002 0 004 5.659V16a2 2 0 104 0v-2.341A6.002 6.002 0 0016 8a6 6 0 00-6-6z" />
              </svg>
              <span>{tips[tipIndex]}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
