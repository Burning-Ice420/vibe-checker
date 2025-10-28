"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function AILoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)

  const loadingMessages = [
    "🎤 Decoding your travel vibes...",
    "🧠 Our AI is having a deep conversation with your wanderlust...",
    "📊 Calculating your beach-to-mountain ratio...",
    "🎯 Crafting your personalized adventure blueprint...",
    "📝 Writing your epic travel personality report...",
    "✨ Almost ready! Adding the final sparkles to your vibe report..."
  ]

  const loadingSteps = [
    { text: "Vibe Detection", progress: 20 },
    { text: "Wanderlust Analysis", progress: 40 },
    { text: "Adventure Mapping", progress: 60 },
    { text: "Vibe Report Crafting", progress: 80 },
    { text: "Adding Magic", progress: 100 }
  ]

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 1
      })
    }, 50)

    // Cycle through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 3000)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const rotateVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-card relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={itemVariants}
          className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 text-center"
        >
          {/* AI Icon */}
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg"
          >
            <motion.div
              variants={rotateVariants}
              animate="rotate"
              className="w-12 h-12"
            >
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mb-2"
          >
            🏖️ Vibe Report in Progress
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground mb-6"
          >
            Our AI is decoding your travel personality like a pro detective 🕵️‍♀️
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                {loadingSteps[currentStep].text}
              </span>
              <span className="text-sm font-bold text-accent">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Animated Message */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <p className="text-foreground font-medium">
              {loadingMessages[currentMessage]}
            </p>
          </motion.div>

          {/* Processing Dots */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-accent rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Estimated Time */}
          <motion.div
            variants={itemVariants}
            className="mt-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Grab a coffee ☕ - this will take 30-60 seconds</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
