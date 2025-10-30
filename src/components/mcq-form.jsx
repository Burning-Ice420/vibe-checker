"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { getApiUrl, API_CONFIG } from "../config/api"
import FormScreen from "./form-screen"
import ResultsDisplay from "./results-display"
import AILoadingScreen from "./ai-loading-screen"

export default function McqForm() {
  const [stage, setStage] = useState(0)
  const [user, setUser] = useState({ name: "", email: "", phone: "" })
  const [answers, setAnswers] = useState({
    introRole: "",
    introFocus: "",
    escape: "",
    motivation: "",
    region: "",
    timeWaster: "",
    partnerSkip: "",
    budget: "",
    concern: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [serverResults, setServerResults] = useState(null)

  const options = useMemo(() => ({
    introRole: ["Student", "Digital Nomad", "Local"],
    introFocus: ["Party", "Relaxing"],
    escape: ["Beaches", "Mountains/Trekking", "Club Hopping/Partying", "Other"],
    motivation: ["Structured Socializing", "Structured Relaxation", "Pure Logistics", "Spontaneous Leisure"],
    region: [
      "North Goa (I prioritize speed/action)",
      "South Goa (I prioritize safety/vibe)",
      "Both (I am comfortable crossing the North/South divide)",
    ],
    timeWaster: [
      "Manual data entry",
      "Finding vendor contact info/prices",
      "Negotiating transport/logistics",
      "Waiting for friends to commit",
    ],
    partnerSkip: [
      "Yes, definitely (more than once)",
      "Yes, maybe one time",
      "No, I always found someone",
      "No, I prefer doing activities alone",
    ],
    budget: ["Below 500", "500-1500", "1500-3000", "Over 3000"],
    concern: [
      "High price/getting ripped off",
      "Low quality/getting bored",
      "Safety/verification",
      "Logistics/Transport getting home later",
    ],
  }), [])

  const changeHandlers = useMemo(() => ({
    introRole: (v) => setAnswers(prev => ({ ...prev, introRole: v })),
    introFocus: (v) => setAnswers(prev => ({ ...prev, introFocus: v })),
    escape: (v) => setAnswers(prev => ({ ...prev, escape: v })),
    motivation: (v) => setAnswers(prev => ({ ...prev, motivation: v })),
    region: (v) => setAnswers(prev => ({ ...prev, region: v })),
    timeWaster: (v) => setAnswers(prev => ({ ...prev, timeWaster: v })),
    partnerSkip: (v) => setAnswers(prev => ({ ...prev, partnerSkip: v })),
    budget: (v) => setAnswers(prev => ({ ...prev, budget: v })),
    concern: (v) => setAnswers(prev => ({ ...prev, concern: v })),
  }), [])

  const QuestionCard = React.memo(function QuestionCard({ title, options, value, onChange }) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-background/50 rounded-2xl p-6 border border-border/30 backdrop-blur-sm"
      >
        <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
        <div className="grid gap-3">
          {options.map(opt => (
            <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${value === opt ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}>
              <input
                type="radio"
                name={title}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">{opt}</span>
            </label>
          ))}
        </div>
      </motion.div>
    )
  })

  const allAnswered = Object.values(answers).every(Boolean)
  const hasUser = user.name && user.email && user.phone

  const payloadPreview = useMemo(() => ({
    user,
    intro: { role: answers.introRole, focus: answers.introFocus },
    escape: answers.escape,
    motivation: answers.motivation,
    region: answers.region,
    timeWaster: answers.timeWaster,
    partnerSkip: answers.partnerSkip,
    budget: answers.budget,
    concern: answers.concern,
    metadata: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    },
  }), [user, answers])

  if (serverResults) {
    return (
      <ResultsDisplay
        results={serverResults}
        onReset={() => {
          setStage(0)
          setUser({ name: "", email: "", phone: "" })
          setAnswers({
            introRole: "",
            introFocus: "",
            escape: "",
            motivation: "",
            region: "",
            timeWaster: "",
            partnerSkip: "",
            budget: "",
            concern: "",
          })
          setSubmitted(false)
          setIsSubmitting(false)
          setError("")
          setServerResults(null)
        }}
      />
    )
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8">
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 bg-clip-text text-transparent">
              Thanks! Your responses are saved.
            </h1>
              <p className="text-muted-foreground">Recording is disabled. You can close this now.</p>
            <div className="text-left max-w-sm mx-auto bg-background/50 rounded-2xl p-4 border border-border/30">
              <p className="text-sm text-muted-foreground mb-2">Sent to backend (preview):</p>
              <pre className="text-xs text-foreground whitespace-pre-wrap break-words">
{JSON.stringify({
  user,
  intro: { role: answers.introRole, focus: answers.introFocus },
  escape: answers.escape,
  motivation: answers.motivation,
  region: answers.region,
  timeWaster: answers.timeWaster,
  partnerSkip: answers.partnerSkip,
  budget: answers.budget,
  concern: answers.concern,
}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (stage === 0) {
    return (
      <FormScreen onSubmit={(data) => { setUser(data); setStage(1) }} />
    )
  }

  if (isSubmitting) {
    return <AILoadingScreen />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
      <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                🏖️ Short MCQ Survey
              </h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                No mic. Just a few quick choices to fine-tune your report.
              </p>
            </div>
          </motion.div>

          {/* Intro (role + focus) */}
          <QuestionCard
            title="Introduce yourself briefly: who are you?"
            options={options.introRole}
            value={answers.introRole}
            onChange={changeHandlers.introRole}
          />
          <QuestionCard
            title="Trip focus?"
            options={options.introFocus}
            value={answers.introFocus}
            onChange={changeHandlers.introFocus}
          />

          {/* Escape */}
          <QuestionCard
            title="Which felt like the bigger escape?"
            options={options.escape}
            value={answers.escape}
            onChange={changeHandlers.escape}
          />

          {/* Motivation */}
          <QuestionCard
            title="Primary motivation for your last trip to Goa?"
            options={options.motivation}
            value={answers.motivation}
            onChange={changeHandlers.motivation}
          />

          {/* Region preference */}
          <QuestionCard
            title="Preferred area for activities?"
            options={options.region}
            value={answers.region}
            onChange={changeHandlers.region}
          />

          {/* Time waster */}
          <QuestionCard
            title="Most annoying time-waster when planning leisure activities?"
            options={options.timeWaster}
            value={answers.timeWaster}
            onChange={changeHandlers.timeWaster}
          />

          {/* Partner skip */}
          <QuestionCard
            title="Did you skip any activity because you couldn't find a reliable partner?"
            options={options.partnerSkip}
            value={answers.partnerSkip}
            onChange={changeHandlers.partnerSkip}
          />

          {/* Budget */}
          <QuestionCard
            title="Typical budget for a single afternoon activity?"
            options={options.budget}
            value={answers.budget}
            onChange={changeHandlers.budget}
          />

          {/* Concern */}
          <QuestionCard
            title="Biggest concern when joining a spontaneous social event?"
            options={options.concern}
            value={answers.concern}
            onChange={changeHandlers.concern}
          />

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-xl p-3">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!hasUser || !allAnswered || isSubmitting}
            onClick={async () => {
              setError("")
              setIsSubmitting(true)
              try {
                const payload = {
                  user,
                  intro: { role: answers.introRole, focus: answers.introFocus },
                  escape: answers.escape,
                  motivation: answers.motivation,
                  region: answers.region,
                  timeWaster: answers.timeWaster,
                  partnerSkip: answers.partnerSkip,
                  budget: answers.budget,
                  concern: answers.concern,
                  metadata: {
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    timestamp: new Date().toISOString(),
                  },
                }

                const res = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUDIO_ANALYSIS_ANALYZE), {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
                if (!res.ok) {
                  throw new Error(`Backend responded ${res.status}`)
                }
                const data = await res.json().catch(() => null)
                if (data && typeof data === 'object') {
                  setServerResults(data)
                } else {
                  setSubmitted(true)
                }
              } catch (e) {
                setError('Failed to submit. Please try again later.')
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base relative overflow-hidden group"
          >
            {(
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Responses
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}


