"use client"

import AudioRecorder from "../components/audio-recorder"
import ResultsDisplay from "../components/results-display"
import AILoadingScreen from "../components/ai-loading-screen"
import { useAudioAnalysis } from "../hooks/useAudioAnalysis"

export default function Home() {
  const { analyzeAudio, isLoading, error, results, reset } = useAudioAnalysis()

  return (
    <main className="min-h-screen relative overflow-hidden">
      
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-primary/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLoading ? (
            <AILoadingScreen />
          ) : !results ? (
            <AudioRecorder onAnalysis={analyzeAudio} isLoading={isLoading} />
          ) : (
            <ResultsDisplay results={results} onReset={reset} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-xs text-muted-foreground text-center">
          🏖️ Get Your Vibe Report • AI-Powered Travel Personality Analysis ✨
        </p>
      </div>

    </main>
  )
}
