"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import RecordButton from "../components/record-button"
import Timer from "../components/timer"
import FormScreen from "../components/form-screen"


export default function AudioRecorder({ onAnalysis, isLoading }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showQuestions, setShowQuestions] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerIntervalRef = useRef(null)

  const RECORDING_DURATION = 30

  const questions = useMemo(() => [
    "Tell us about yourself - what's your travel personality?",
    "Beach bum or mountain climber? Spill the tea!",
    "Party animal or zen master? What's your vibe?",
    "How much would you spend on a perfect sunset dinner?",
    "What's the weirdest travel experience you've had?",
    "What's the best and worst thing about your dream destination?"
  ], [])


  useEffect(() => {
    if (isRecording && recordingTime >= RECORDING_DURATION) {
      stopRecording()
    }
  }, [recordingTime, isRecording])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Removed auto-scroll functionality - now using manual navigation


  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        onAnalysis(audioBlob, formData)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setTranscript("")

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }, [onAnalysis, formData])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isRecording])

  const handleRecordClick = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, stopRecording, startRecording])

  const handleFormSubmit = (data) => {
    setFormData(data)
    setFormSubmitted(true)
  }

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Start fade out animation when reaching the last question
      setIsFadingOut(true)
      setTimeout(() => {
        setShowQuestions(false)
        setIsFadingOut(false)
      }, 500)
    }
  }, [currentQuestionIndex, questions.length])

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex])

  const skipQuestions = useCallback(() => {
    setIsFadingOut(true)
    setTimeout(() => {
      setShowQuestions(false)
      setIsFadingOut(false)
    }, 500)
  }, [])


  const handleSubmitClick = useCallback(() => {
    if (mediaRecorderRef.current && recordingTime > 0) {
      mediaRecorderRef.current.stop()
    }
  }, [recordingTime])

  // Questions component for mobile (above recorder) - defined after all useCallback functions
  const QuestionsSection = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isFadingOut ? 0 : 1, 
        y: isFadingOut ? -20 : 0,
        scale: isFadingOut ? 0.95 : 1
      }}
      transition={{ 
        duration: 0.5,
        opacity: { duration: 0.3 },
        y: { duration: 0.3 },
        scale: { duration: 0.3 }
      }}
      className="mb-6"
    >
      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border/50 p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground">Questions to Consider</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Navigate through the questions manually
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-accent to-primary h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Current Question */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="bg-background/50 rounded-xl p-4 border border-border/30"
          >
            <div className="text-center space-y-2">
              <motion.div 
                key={`question-number-${currentQuestionIndex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-8 h-8 mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center"
              >
                <span className="text-lg font-bold text-accent">{currentQuestionIndex + 1}</span>
              </motion.div>
              <motion.h4 
                key={`question-text-${currentQuestionIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-sm font-semibold text-foreground leading-relaxed"
              >
                {questions[currentQuestionIndex]}
              </motion.h4>
            </div>
          </motion.div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex-1 py-2 px-4 bg-muted/50 text-foreground font-medium rounded-lg hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextQuestion}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-accent to-primary text-accent-foreground font-medium rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Start Recording' : 'Next'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Skip All button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={skipQuestions}
            className="w-full py-2 px-4 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
          >
            Skip all questions and go directly to recording
          </motion.button>
        </div>
      </div>
    </motion.div>
  ), [currentQuestionIndex, questions.length, isFadingOut, nextQuestion, prevQuestion, skipQuestions])

  if (!formSubmitted) {
    return <FormScreen onSubmit={handleFormSubmit} />
  }

  if (showQuestions && !isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
        
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8">
          <div className="space-y-8">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  Answer These Questions
                </h1>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  Please answer each question thoughtfully for better analysis
                </p>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Current Question */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.6, 
                ease: "easeInOut",
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="bg-background/50 rounded-2xl p-8 border border-border/30 backdrop-blur-sm"
            >
              <div className="text-center space-y-4">
                <motion.div 
                  key={`desktop-question-number-${currentQuestionIndex}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-12 h-12 mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center"
                >
                  <span className="text-2xl font-bold text-accent">{currentQuestionIndex + 1}</span>
                </motion.div>
                <motion.h2 
                  key={`desktop-question-text-${currentQuestionIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-semibold text-foreground leading-relaxed"
                >
                  {questions[currentQuestionIndex]}
                </motion.h2>
                <motion.p 
                  key={`desktop-question-hint-${currentQuestionIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-sm text-muted-foreground"
                >
                  Take your time to think about your answer
                </motion.p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 py-3 px-6 bg-muted/50 text-foreground font-semibold rounded-xl hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextQuestion}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Start Recording' : 'Next'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Skip Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={skipQuestions}
              className="w-full py-2 px-4 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
            >
              Skip questions and go directly to recording
            </motion.button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
      
      <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8">
        <div className="space-y-8">
          {/* Questions Section for Mobile */}
          {isMobile && showQuestions && QuestionsSection}

        {/* Header */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            🏖️ Vibe Report
          </h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Spill the tea about your travel dreams ☕✈️
              </p>
        </div>
          </motion.div> */}

        {/* Recording Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="py-8 space-y-8"
          >
          {/* Timer */}
          <Timer seconds={recordingTime} isRecording={isRecording} />

          {/* Record Button */}
          <RecordButton isRecording={isRecording} onClick={handleRecordClick} disabled={isLoading} />

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/30 rounded-2xl p-4 border border-border/30"
            >
              <div className="flex items-center justify-center space-x-2">
                {isRecording ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      className="w-2 h-2 bg-destructive rounded-full"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Recording... {RECORDING_DURATION - recordingTime}s remaining
                    </span>
                  </>
                ) : recordingTime > 0 ? (
                  <>
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">
                      Recording complete! Ready to analyze.
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">
                      Tap the button to start recording
                    </span>
                  </>
                )}
              </div>
            </motion.div>

            {/* Live Transcript */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background/50 rounded-2xl p-6 border border-border/30 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                  <p className="text-sm font-semibold text-foreground">Live Transcript</p>
                </div>
                <p className="font-mono text-sm text-foreground leading-relaxed break-words bg-muted/30 rounded-lg p-3">
                  {transcript}
                </p>
            </motion.div>
          )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitClick}
            disabled={recordingTime === 0 || isLoading || isRecording}
            className="w-full py-4 px-6 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base relative overflow-hidden group"
          >
          {isLoading ? (
              <span className="flex items-center justify-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full"
              />
                <span>Analyzing your audio...</span>
            </span>
          ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get My Vibe Report! 🚀
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
