"use client"

import { motion } from "framer-motion"

export default function ResultsDisplay({ results, onReset }) {
  // Safe render function to handle objects
  const safeRender = (value) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value
    }
    if (typeof value === 'object' && value !== null) {
      if (value.benefit) return value.benefit
      if (value.opportunity) return value.opportunity
      if (value.recommendation) return value.recommendation
      if (value.trait) return value.trait
      if (value.preference) return value.preference
      if (value.category) return value.category
      if (value.items) return value.items
      return JSON.stringify(value)
    }
    return String(value)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
      <motion.div
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 bg-clip-text text-transparent">
          Your Vibe Report is Ready! 🏖️✨
        </h1>
        <p className="text-muted-foreground">
          We've decoded your travel personality - prepare to be amazed! 🤯
        </p>
      </motion.div>

      {/* Transcription Card */}
      <motion.div
        variants={cardVariants}
        className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Transcription</h2>
          </div>
          
          <div className="bg-background/50 rounded-2xl p-6 border border-border/30 backdrop-blur-sm">
            <p className="font-mono text-sm text-foreground leading-relaxed break-words">
              {safeRender(results.transcription)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Insights Section */}
      <motion.div
        variants={cardVariants}
        className="relative bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-3xl" />
        
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">AI Insights</h2>
          </div>

          <div className="space-y-6">
          {/* Why It's Useful */}
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-r from-accent/10 to-transparent rounded-2xl p-6 border-l-4 border-accent"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-foreground">🎯 Why This Matters for Your Travels</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{safeRender(results.insights.whyUseful)}</p>
          </motion.div>

          {/* Benefits */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-foreground">✨ Travel Perks You'll Love</h3>
              </div>
              <div className="grid gap-3">
              {results.insights.benefits.map((benefit, index) => (
                  <motion.div
                  key={index}
                  variants={itemVariants}
                    className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/30"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-foreground leading-relaxed">
                      {safeRender(benefit)}
                    </span>
                  </motion.div>
                ))}
              </div>
          </motion.div>

          {/* Future Opportunities */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-semibold text-foreground">🚀 Adventure Opportunities Ahead</h3>
              </div>
              <div className="grid gap-3">
              {results.insights.opportunities.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <span className="text-foreground leading-relaxed">
                      {safeRender(opportunity)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            {results.insights.recommendations && results.insights.recommendations.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-foreground">🎯 Your Personal Travel Guide</h3>
                </div>
                <div className="grid gap-3">
                  {results.insights.recommendations.map((recommendation, index) => (
                    <motion.div
                  key={index}
                  variants={itemVariants}
                      className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/30 dark:border-red-800/30"
                    >
                      {typeof recommendation === 'object' && recommendation.category ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-red-700 dark:text-red-300">{recommendation.category}</h4>
                          </div>
                          <div className="space-y-2 ml-8">
                            {Array.isArray(recommendation.items) ? (
                              recommendation.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-sm text-red-600 dark:text-red-400">{item}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-red-600 dark:text-red-400">{recommendation.items}</span>
                            )}
                          </div>
                        </div>
                      ) : typeof recommendation === 'object' && recommendation.recommendation ? (
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-red-700 dark:text-red-300">{recommendation.recommendation}</span>
                                {recommendation.priority && (
                                  <span className="text-xs font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                                    {recommendation.priority}
                                  </span>
                                )}
                              </div>
                              {recommendation.reason && (
                                <p className="text-sm text-red-600 dark:text-red-400">{recommendation.reason}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-red-700 dark:text-red-300 leading-relaxed">{safeRender(recommendation)}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Analysis Results (if available) */}
            {results.analysis && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-foreground">🧠 Your Travel Personality Breakdown</h3>
                </div>
                
                <div className="space-y-4">
                  {results.analysis.overallScore && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold text-green-700 dark:text-green-300">Overall Score</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {results.analysis.overallScore}/100
                      </div>
                    </div>
                  )}
                  
                  {results.analysis.confidenceLevel && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">Confidence Level</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 capitalize">
                        {results.analysis.confidenceLevel}
                      </div>
                    </div>
                  )}
                  
                  {results.analysis.travelPersonality && results.analysis.travelPersonality.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200/30 dark:border-purple-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-semibold text-purple-700 dark:text-purple-300">Travel Personality</span>
                      </div>
                      <div className="space-y-3">
                        {results.analysis.travelPersonality.map((trait, index) => (
                          <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                            {typeof trait === 'object' && trait.trait ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-purple-600 dark:text-purple-400">{trait.trait}</span>
                                  {trait.percentage && (
                                    <span className="text-sm font-bold text-purple-500">{trait.percentage}%</span>
                                  )}
                                </div>
                                {trait.reason && (
                                  <p className="text-sm text-purple-500 dark:text-purple-300">{trait.reason}</p>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-purple-600 dark:text-purple-400">{trait}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {results.analysis.preferences && results.analysis.preferences.length > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl p-4 border border-orange-200/30 dark:border-orange-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-semibold text-orange-700 dark:text-orange-300">Preferences</span>
                      </div>
                      <div className="space-y-3">
                        {results.analysis.preferences.map((pref, index) => (
                          <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                            {typeof pref === 'object' && pref.preference ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-orange-600 dark:text-orange-400">{pref.preference}</span>
                                  {pref.percentage && (
                                    <span className="text-sm font-bold text-orange-500">{pref.percentage}%</span>
                                  )}
                                </div>
                                {pref.reason && (
                                  <p className="text-sm text-orange-500 dark:text-orange-300">{pref.reason}</p>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-orange-600 dark:text-orange-400">{pref}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Spending Habits */}
                  {results.analysis.spendingHabits && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="font-semibold text-green-700 dark:text-green-300">Spending Habits</span>
                      </div>
                      <div className="space-y-3">
                        {Array.isArray(results.analysis.spendingHabits) ? (
                          results.analysis.spendingHabits.map((habit, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-600 dark:text-green-400">{habit}</span>
                            </div>
                          ))
                        ) : (
                          Object.entries(results.analysis.spendingHabits).map(([category, items], index) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                              <div className="font-semibold text-green-700 dark:text-green-300 mb-2">{category}</div>
                              <div className="space-y-1">
                                {Array.isArray(items) ? (
                                  items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                      <span className="text-sm text-green-600 dark:text-green-400">{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-sm text-green-600 dark:text-green-400">{items}</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Goa Experience */}
                  {results.analysis.goaExperience && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-yellow-200/30 dark:border-yellow-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-semibold text-yellow-700 dark:text-yellow-300">Goa Experience</span>
                      </div>
                      <div className="space-y-3">
                        {Array.isArray(results.analysis.goaExperience) ? (
                          results.analysis.goaExperience.map((experience, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-yellow-600 dark:text-yellow-400">{experience}</span>
                            </div>
                          ))
                        ) : (
                          Object.entries(results.analysis.goaExperience).map(([category, items], index) => (
                            <div key={index} className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
                              <div className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">{category}</div>
                              <div className="space-y-1">
                                {Array.isArray(items) ? (
                                  items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                      <span className="text-sm text-yellow-600 dark:text-yellow-400">{item}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-sm text-yellow-600 dark:text-yellow-400">{items}</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Questions Asked (if available) */}
            {results.questions && results.questions.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-foreground">❓ The Questions We Asked You</h3>
                </div>
                <div className="space-y-3">
                  {results.questions.map((question, index) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-4 border border-border/30">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-white">{index + 1}</span>
                        </div>
                        <span className="text-foreground leading-relaxed">{question}</span>
                      </div>
                    </div>
                  ))}
                </div>
          </motion.div>
            )}

          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* PDF Download Button */}
        {results.userData && results.analysis && results.questions && results.timestamp && (
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              try {
                const { jsPDF } = await import('jspdf')
                const doc = new jsPDF()
                
                // Set up fonts and colors
                doc.setFont('helvetica')
                const pageWidth = doc.internal.pageSize.getWidth()
                const margin = 20
                let yPosition = 20
                
                // Helper function to add text with word wrap
                const addText = (text, fontSize = 12, isBold = false, color = '#000000') => {
                  doc.setFontSize(fontSize)
                  doc.setFont('helvetica', isBold ? 'bold' : 'normal')
                  doc.setTextColor(color)
                  
                  const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
                  lines.forEach(line => {
                    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                      doc.addPage()
                      yPosition = 20
                    }
                    doc.text(line, margin, yPosition)
                    yPosition += fontSize * 0.4
                  })
                  yPosition += 5
                }
                
                // Title
                addText('Career Analysis Report', 20, true, '#2563eb')
                addText(`Generated for: ${results.userData.name}`, 14, true, '#374151')
                addText(`Date: ${new Date(results.timestamp).toLocaleDateString()}`, 12, false, '#6b7280')
                yPosition += 10
                
                // User Information
                addText('Personal Information', 16, true, '#1f2937')
                addText(`Name: ${results.userData.name}`, 12)
                addText(`Email: ${results.userData.email}`, 12)
                addText(`Phone: ${results.userData.phone}`, 12)
                yPosition += 10
                
                // Questions Asked
                addText('Questions Asked', 16, true, '#1f2937')
                results.questions.forEach((question, index) => {
                  addText(`${index + 1}. ${question}`, 11, false, '#4b5563')
                })
                yPosition += 10
                
                // Transcription
                addText('Audio Transcription', 16, true, '#1f2937')
                addText(results.transcription, 10, false, '#374151')
                yPosition += 10
                
                // Analysis Results
                if (results.analysis) {
                  addText('Analysis Results', 16, true, '#1f2937')
                  
                  if (results.analysis.overallScore) {
                    addText(`Overall Score: ${results.analysis.overallScore}/100`, 12, true, '#059669')
                  }
                  
                  if (results.analysis.confidenceLevel) {
                    addText(`Confidence Level: ${results.analysis.confidenceLevel}`, 12, true, '#059669')
                  }
                  
                  if (results.analysis.travelPersonality) {
                    addText('Travel Personality:', 14, true, '#1f2937')
                    results.analysis.travelPersonality.forEach(trait => {
                      if (typeof trait === 'object' && trait.trait) {
                        addText(`• ${trait.trait}${trait.percentage ? ` (${trait.percentage}%)` : ''}`, 11, false, '#4b5563')
                        if (trait.reason) {
                          addText(`  ${trait.reason}`, 10, false, '#6b7280')
                        }
                      } else {
                        addText(`• ${trait}`, 11, false, '#4b5563')
                      }
                    })
                  }
                  
                  if (results.analysis.preferences) {
                    addText('Preferences:', 14, true, '#1f2937')
                    results.analysis.preferences.forEach(pref => {
                      if (typeof pref === 'object' && pref.preference) {
                        addText(`• ${pref.preference}${pref.percentage ? ` (${pref.percentage}%)` : ''}`, 11, false, '#4b5563')
                        if (pref.reason) {
                          addText(`  ${pref.reason}`, 10, false, '#6b7280')
                        }
                      } else {
                        addText(`• ${pref}`, 11, false, '#4b5563')
                      }
                    })
                  }
                  
                  if (results.analysis.spendingHabits) {
                    addText('Spending Habits:', 14, true, '#1f2937')
                    if (Array.isArray(results.analysis.spendingHabits)) {
                      results.analysis.spendingHabits.forEach(habit => {
                        addText(`• ${habit}`, 11, false, '#4b5563')
                      })
                    } else {
                      Object.entries(results.analysis.spendingHabits).forEach(([category, items]) => {
                        addText(`${category}:`, 12, true, '#4b5563')
                        if (Array.isArray(items)) {
                          items.forEach(item => {
                            addText(`  • ${item}`, 10, false, '#6b7280')
                          })
                        } else {
                          addText(`  • ${items}`, 10, false, '#6b7280')
                        }
                      })
                    }
                  }
                  
                  if (results.analysis.goaExperience) {
                    addText('Goa Experience:', 14, true, '#1f2937')
                    if (Array.isArray(results.analysis.goaExperience)) {
                      results.analysis.goaExperience.forEach(experience => {
                        addText(`• ${experience}`, 11, false, '#4b5563')
                      })
                    } else {
                      Object.entries(results.analysis.goaExperience).forEach(([category, items]) => {
                        addText(`${category}:`, 12, true, '#4b5563')
                        if (Array.isArray(items)) {
                          items.forEach(item => {
                            addText(`  • ${item}`, 10, false, '#6b7280')
                          })
                        } else {
                          addText(`  • ${items}`, 10, false, '#6b7280')
                        }
                      })
                    }
                  }
                }
                
                // Insights
                if (results.insights) {
                  addText('Insights & Recommendations', 16, true, '#1f2937')
                  
                  if (results.insights.whyUseful) {
                    addText('Why This Analysis is Useful:', 14, true, '#1f2937')
                    addText(results.insights.whyUseful, 11, false, '#374151')
                  }
                  
                  if (results.insights.benefits && results.insights.benefits.length > 0) {
                    addText('Key Benefits:', 14, true, '#1f2937')
                    results.insights.benefits.forEach(benefit => {
                      addText(`• ${benefit}`, 11, false, '#059669')
                    })
                  }
                  
                  if (results.insights.opportunities && results.insights.opportunities.length > 0) {
                    addText('Future Opportunities:', 14, true, '#1f2937')
                    results.insights.opportunities.forEach(opportunity => {
                      addText(`• ${opportunity}`, 11, false, '#2563eb')
                    })
                  }
                  
                  if (results.insights.recommendations && results.insights.recommendations.length > 0) {
                    addText('Recommendations:', 14, true, '#1f2937')
                    results.insights.recommendations.forEach(recommendation => {
                      if (typeof recommendation === 'object' && recommendation.category) {
                        addText(`${recommendation.category}:`, 12, true, '#dc2626')
                        if (Array.isArray(recommendation.items)) {
                          recommendation.items.forEach(item => {
                            addText(`  • ${item}`, 10, false, '#6b7280')
                          })
                        } else {
                          addText(`  • ${recommendation.items}`, 10, false, '#6b7280')
                        }
                      } else if (typeof recommendation === 'object' && recommendation.recommendation) {
                        addText(`• ${recommendation.recommendation}${recommendation.priority ? ` (${recommendation.priority})` : ''}`, 11, false, '#dc2626')
                        if (recommendation.reason) {
                          addText(`  ${recommendation.reason}`, 10, false, '#6b7280')
                        }
                      } else {
                        addText(`• ${recommendation}`, 11, false, '#dc2626')
                      }
                    })
                  }
                }
                
                // Footer
                const pageCount = doc.internal.getNumberOfPages()
                for (let i = 1; i <= pageCount; i++) {
                  doc.setPage(i)
                  doc.setFontSize(8)
                  doc.setTextColor('#9ca3af')
                  doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10)
                }
                
                // Download the PDF
                const fileName = `career-analysis-${results.userData.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
                doc.save(fileName)
              } catch (error) {
                console.error('Error generating PDF:', error)
                alert('PDF generation failed. Please try again.')
              }
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 text-base relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              📄 Download My Vibe Report
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        )}

      {/* Reset Button */}
      <motion.button
        variants={itemVariants}
          whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
          className="w-full py-4 px-6 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 text-base relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            🔄 Get Another Vibe Report
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>
      </div>
    </motion.div>
  )
}
