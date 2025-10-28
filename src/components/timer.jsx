"use client"

import { motion } from "framer-motion"

export default function Timer({ seconds, isRecording }) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const timeString = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const digitVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center space-y-4"
    >
      {/* Timer container */}
      <div className="relative">
        {/* Background circle */}
        <motion.div
          animate={isRecording ? {
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: isRecording ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut"
          }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-accent/10 via-primary/10 to-accent/10 border-2 border-accent/20 flex items-center justify-center backdrop-blur-sm"
        >
          {/* Recording indicator ring */}
          {isRecording && (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full border-2 border-destructive/30"
            />
          )}

          {/* Time display */}
          <div className="text-center">
            <motion.div 
              variants={digitVariants}
              className="text-6xl font-mono font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent tracking-wider"
            >
              {timeString}
            </motion.div>
            
            {/* Recording dot */}
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center mt-2 space-x-1"
              >
                <motion.div
                  animate={{ 
                    opacity: [1, 0.3, 1],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className="w-3 h-3 bg-destructive rounded-full"
                />
                <span className="text-sm font-medium text-destructive ml-2">REC</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Progress ring */}
        {isRecording && (
          <svg className="absolute inset-0 w-48 h-48 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent/20"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-accent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 30, ease: "linear" }}
            />
          </svg>
        )}
      </div>

      {/* Status text */}
      <motion.div
        variants={digitVariants}
        className="text-center"
      >
        <p className="text-sm font-medium text-muted-foreground">
          {isRecording ? "Recording in progress..." : "Ready to record"}
        </p>
        {isRecording && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-accent mt-1"
          >
            Speak clearly for best results
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}
