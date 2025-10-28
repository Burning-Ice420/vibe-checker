"use client"

import { motion } from "framer-motion"
import React from "react"

export default function RecordButton({ isRecording, onClick, disabled }) {
  const pulseVariants = {
    recording: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      }
    },
    idle: {
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  const rippleVariants = {
    recording: {
      scale: [0, 1.5],
      opacity: [0.6, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeOut"
      }
    },
    idle: {
      scale: 0,
      opacity: 0
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple effect */}
      <motion.div
        variants={rippleVariants}
        animate={isRecording ? "recording" : "idle"}
        className="absolute w-32 h-32 rounded-full border-2 border-destructive/30"
      />
      
      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        variants={pulseVariants}
        animate={isRecording ? "recording" : "idle"}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
          isRecording
            ? "bg-gradient-to-br from-destructive via-red-500 to-destructive shadow-2xl shadow-destructive/40"
            : "bg-gradient-to-br from-accent via-primary to-accent hover:shadow-xl hover:shadow-accent/30 shadow-lg"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* Inner glow effect */}
        <div className={`absolute inset-2 rounded-full ${
          isRecording 
            ? "bg-white/20" 
            : "bg-white/10"
        }`} />
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center">
          {isRecording ? (
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
            >
              <div className="w-4 h-4 bg-destructive rounded-sm" />
            </motion.div>
          ) : (
            <motion.svg 
              className="w-10 h-10 text-accent-foreground" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.2 0-4.2-.9-5.7-2.36l-1.41 1.41c1.84 1.84 4.35 2.98 7.11 2.98s5.27-1.13 7.11-2.98l-1.41-1.41zM12 19c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
            </motion.svg>
          )}
        </div>

        {/* Status indicator */}
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
              className="w-2 h-2 bg-white rounded-full"
            />
          </motion.div>
        )}
      </motion.button>

      {/* Recording waves animation */}
      {isRecording && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1.5],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeOut"
              }}
              className="absolute w-32 h-32 rounded-full border border-destructive/20"
            />
          ))}
        </div>
      )}
    </div>
  )
}
