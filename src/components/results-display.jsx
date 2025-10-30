"use client"

import { motion } from "framer-motion"

export default function ResultsDisplay({ results, onReset }) {
  const safe = (v) => {
    if (v == null) return "—"
    if (typeof v === 'string' || typeof v === 'number') return v
    return JSON.stringify(v, null, 2)
  }

  // Normalize backend shapes: either direct or wrapped under data
  const payload = results?.data ?? results
  const userData = payload?.userData
  const timestamp = payload?.timestamp
  const questions = payload?.questions
  const analysisBlock = payload?.analysis
  const transcription = analysisBlock?.transcription ?? results?.transcription
  const analysis = analysisBlock?.analysis ?? payload?.analysis
  const insights = analysisBlock?.insights ?? payload?.insights

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      let y = 20

      const ensureSpace = (needed = 12) => {
        const maxY = doc.internal.pageSize.getHeight() - 20
        if (y + needed > maxY) { doc.addPage(); y = 20 }
      }

      const add = (text, size = 12, bold = false, color = '#111827') => {
        doc.setTextColor(color)
        doc.setFont('helvetica', bold ? 'bold' : 'normal')
        doc.setFontSize(size)
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
        for (const line of lines) {
          ensureSpace(size)
          doc.text(line, margin, y)
          y += size * 0.45
        }
        y += 4
      }

      const sectionHeader = (title, color = '#2563eb') => {
        ensureSpace(18)
        doc.setDrawColor(color)
        doc.setFillColor(color)
        doc.setTextColor('#111827')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        doc.text(title, margin, y)
        y += 3
        doc.setDrawColor(color)
        doc.setFillColor(color)
        doc.rect(margin, y, pageWidth - 2 * margin, 1.5, 'F')
        y += 6
      }

      const drawBar = (label, percent, barColor = '#10b981') => {
        const p = Math.max(0, Math.min(100, Number(percent) || 0))
        const barW = pageWidth - 2 * margin
        const barH = 6
        const fillW = (barW * p) / 100
        ensureSpace(18)
        // label
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.setTextColor('#374151')
        doc.text(`${label} (${p}%)`, margin, y)
        y += 4
        // track
        doc.setDrawColor('#e5e7eb')
        doc.setFillColor('#e5e7eb')
        doc.roundedRect(margin, y, barW, barH, 2, 2, 'F')
        // fill
        doc.setFillColor(barColor)
        doc.roundedRect(margin, y, Math.max(4, fillW), barH, 2, 2, 'F')
        y += barH + 6
      }

      const colors = {
        primary: '#2563eb',
        green: '#10b981',
        blue: '#3b82f6',
        amber: '#f59e0b',
        purple: '#8b5cf6',
        red: '#ef4444',
        gray: '#6b7280',
      }

      add('Vibe Report', 20, true, colors.primary)
      if (userData) {
        add(`Name: ${userData.name || ''}`, 11, false, colors.gray)
        add(`Email: ${userData.email || ''}`, 11, false, colors.gray)
        add(`Phone: ${userData.phone || ''}`, 11, false, colors.gray)
      }
      if (timestamp) add(`Date: ${new Date(timestamp).toLocaleString()}`, 11, false, colors.gray)

      if (transcription) {
        sectionHeader('Summary', colors.primary)
        add(typeof transcription === 'string' ? transcription : safe(transcription), 12)
      }

      // Analysis Section (structured)
      sectionHeader('Analysis', colors.primary)
      if (analysis) {
        if (typeof analysis.overallScore === 'number') drawBar('Overall Score', analysis.overallScore, colors.green)
        if (analysis.confidenceLevel) add(`Confidence: ${analysis.confidenceLevel}`, 12, true, colors.blue)

        if (Array.isArray(analysis.travelPersonality) && analysis.travelPersonality.length) {
          add('Travel Personality', 14, true, colors.primary)
          analysis.travelPersonality.forEach((t) => {
            const title = t?.trait ? `${t.trait}${typeof t.percentage === 'number' ? ` (${t.percentage}%)` : ''}` : safe(t)
            if (typeof t?.percentage === 'number') {
              drawBar(title, t.percentage, colors.blue)
            } else {
              add(`• ${title}`, 11)
            }
            if (t?.reason) add(`  - ${t.reason}`, 10, false, colors.gray)
          })
        }

        if (Array.isArray(analysis.preferences) && analysis.preferences.length) {
          add('Preferences', 14, true, colors.primary)
          analysis.preferences.forEach((p) => {
            const head = `${p?.preference || 'Preference'}: ${p?.choice || ''}`.trim()
            add(`• ${head}`, 11, false, colors.gray)
            const meta = []
            if (typeof p?.percentage === 'number') meta.push(`${p.percentage}%`)
            if (p?.priority) meta.push(`Priority: ${p.priority}`)
            if (typeof p?.percentage === 'number') drawBar(p?.preference || 'Preference', p.percentage, colors.amber)
            if (meta.length) add(`  - ${meta.join(' | ')}`, 10, false, colors.gray)
            if (p?.reason) add(`  - ${p.reason}`, 10, false, colors.gray)
          })
        }

        if (analysis.spendingHabits) {
          add('Spending Habits', 14, true, colors.primary)
          if (analysis.spendingHabits.cafeBudget) add(`• Cafe Budget: ${analysis.spendingHabits.cafeBudget}`, 11, false, colors.gray)
          if (typeof analysis.spendingHabits.percentage === 'number') drawBar('Budget Strictness', analysis.spendingHabits.percentage, colors.amber)
          if (analysis.spendingHabits.reason) add(`  - ${analysis.spendingHabits.reason}`, 10, false, colors.gray)
        }

        if (analysis.goaExperience) {
          add('Goa Experience', 14, true, colors.primary)
          if (typeof analysis.goaExperience.score === 'number') drawBar('Experience Score', analysis.goaExperience.score, colors.purple)
          if (analysis.goaExperience.level) add(`• Level: ${analysis.goaExperience.level}`, 11, true, colors.purple)
          if (analysis.goaExperience.reason) add(`  - ${analysis.goaExperience.reason}`, 10, false, colors.gray)
        }
      } else {
        add('No analysis', 12)
      }

      // Insights Section (structured)
      if (insights) {
        sectionHeader('Insights', colors.green)
        if (insights.whyUseful) {
          add('Why this matters', 14, true, colors.green)
          add(insights.whyUseful, 11, false, '#065f46')
        }
        if (Array.isArray(insights.benefits) && insights.benefits.length) {
          add('Benefits', 14, true, colors.green)
          insights.benefits.forEach(b => add(`• ${typeof b === 'string' ? b : safe(b)}`, 11, false, '#065f46'))
        }
        if (Array.isArray(insights.opportunities) && insights.opportunities.length) {
          add('Opportunities', 14, true, colors.blue)
          insights.opportunities.forEach(o => add(`• ${typeof o === 'string' ? o : safe(o)}`, 11, false, '#1e3a8a'))
        }
        if (Array.isArray(insights.recommendations) && insights.recommendations.length) {
          add('Recommendations', 14, true, colors.red)
          insights.recommendations.forEach(r => {
            if (r?.category) {
              add(`${r.category}:`, 12, true, colors.red)
              const items = Array.isArray(r.items) ? r.items : [r.items]
              items.filter(Boolean).forEach(it => add(`  • ${typeof it === 'string' ? it : safe(it)}`, 10, false, '#7f1d1d'))
            } else {
              add(`• ${typeof r === 'string' ? r : safe(r)}`, 11, false, '#7f1d1d')
            }
          })
        }
      }

      if (questions) {
        sectionHeader('Questions', colors.primary)
        ;(Array.isArray(questions) ? questions : [questions]).forEach((q, i) => add(`${i + 1}. ${typeof q === 'string' ? q : safe(q)}`, 11, false, colors.gray))
      }

      const fileName = `vibe-report-${(userData?.name || 'user').toString().replace(/\s+/g,'-').toLowerCase()}.pdf`
      doc.save(fileName)
    } catch (e) {
      console.error('PDF error', e)
      alert('Could not generate PDF. Please try again.')
    }
  }

  const TraitPill = ({ label, percent }) => (
    <div className="flex items-center justify-between bg-muted/30 border border-border/30 rounded-xl px-3 py-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {typeof percent === 'number' && (
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{percent}%</span>
      )}
    </div>
  )

  const Badge = ({ children, color = 'primary' }) => (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
      color === 'green' ? 'bg-green-500/10 text-green-600 border-green-500/30' :
      color === 'red' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
      color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30' :
      'bg-primary/10 text-primary border-primary/30'
    }`}>{children}</span>
  )

  const Section = ({ title, children, accent = 'from-accent/10 to-primary/10' }) => (
    <div className={`relative rounded-2xl border border-border/50 p-6 bg-card/80`}> 
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} rounded-2xl blur-2xl`} />
      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )

  const PreferenceRow = ({ title, choice, percentage, reason, priority }) => (
    <div className="bg-muted/20 border border-border/30 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="flex items-center gap-2">
          {typeof percentage === 'number' && <Badge>{percentage}%</Badge>}
          {priority && <Badge color={priority === 'High' ? 'red' : priority === 'Medium' ? 'yellow' : 'green'}>{priority}</Badge>}
        </div>
      </div>
      {choice && <div className="text-sm text-primary font-medium">{choice}</div>}
      {reason && <div className="text-sm text-muted-foreground">{reason}</div>}
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h2 className="text-2xl font-bold">Your Vibe Report</h2>
        {userData && <p className="text-muted-foreground">Generated for {userData.name}{timestamp ? ` • ${new Date(timestamp).toLocaleString()}` : ''}</p>}
      </div>

      <div className="space-y-6">
        {transcription && (
          <Section title="Summary" accent="from-accent/10 to-primary/5">
            <p className="text-sm text-foreground leading-relaxed">{transcription}</p>
          </Section>
        )}

        {analysis && (
          <Section title="Analysis" accent="from-primary/10 to-accent/5">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                {typeof analysis.overallScore === 'number' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-xs text-green-700 font-semibold mb-1">Overall Score</div>
                    <div className="text-2xl font-bold text-green-700">{analysis.overallScore}</div>
                  </div>
                )}
                {analysis.confidenceLevel && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-xs text-blue-700 font-semibold mb-1">Confidence</div>
                    <div className="text-lg font-semibold text-blue-700">{analysis.confidenceLevel}</div>
                  </div>
                )}
              </div>

              {Array.isArray(analysis.travelPersonality) && analysis.travelPersonality.length > 0 && (
                <div className="space-y-3">
                  <div className="font-semibold">Travel Personality</div>
                  <div className="grid gap-2">
                    {analysis.travelPersonality.map((t, idx) => (
                      <div key={idx} className="space-y-2">
                        <TraitPill label={t.trait || safe(t)} percent={t.percentage} />
                        {t.reason && <div className="text-xs text-muted-foreground pl-1">{t.reason}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(analysis.preferences) && analysis.preferences.length > 0 && (
                <div className="space-y-3">
                  <div className="font-semibold">Preferences</div>
                  <div className="grid gap-3">
                    {analysis.preferences.map((p, i) => (
                      <PreferenceRow key={i} title={p.preference || 'Preference'} choice={p.choice} percentage={p.percentage} reason={p.reason} priority={p.priority} />
                    ))}
                  </div>
                </div>
              )}

              {analysis.spendingHabits && (
                <div className="space-y-2">
                  <div className="font-semibold">Spending Habits</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {analysis.spendingHabits.cafeBudget && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <div className="text-xs text-amber-700 font-semibold mb-1">Cafe Budget</div>
                        <div className="text-base font-semibold text-amber-700">{analysis.spendingHabits.cafeBudget}</div>
                      </div>
                    )}
                    {typeof analysis.spendingHabits.percentage === 'number' && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                        <div className="text-xs text-amber-700 font-semibold mb-1">Budget Strictness</div>
                        <div className="text-base font-semibold text-amber-700">{analysis.spendingHabits.percentage}%</div>
                      </div>
                    )}
                    {analysis.spendingHabits.reason && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 sm:col-span-3">
                        <div className="text-xs text-amber-700 font-semibold mb-1">Reason</div>
                        <div className="text-sm text-amber-800">{analysis.spendingHabits.reason}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {analysis.goaExperience && (
                <div className="space-y-2">
                  <div className="font-semibold">Goa Experience</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {typeof analysis.goaExperience.score === 'number' && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-xs text-purple-700 font-semibold mb-1">Score</div>
                        <div className="text-2xl font-bold text-purple-700">{analysis.goaExperience.score}</div>
                      </div>
                    )}
                    {analysis.goaExperience.level && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-xs text-purple-700 font-semibold mb-1">Level</div>
                        <div className="text-lg font-semibold text-purple-700">{analysis.goaExperience.level}</div>
                      </div>
                    )}
                    {analysis.goaExperience.reason && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 sm:col-span-3">
                        <div className="text-xs text-purple-700 font-semibold mb-1">Reason</div>
                        <div className="text-sm text-purple-800">{analysis.goaExperience.reason}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}

        {insights && (
          <Section title="Insights" accent="from-emerald-500/10 to-green-500/10">
            <div className="space-y-4">
              {insights.whyUseful && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="text-xs text-emerald-700 font-semibold mb-1">Why this matters</div>
                  <div className="text-sm text-emerald-800">{insights.whyUseful}</div>
                </div>
              )}
              {Array.isArray(insights.benefits) && insights.benefits.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold">Benefits</div>
                  <div className="grid gap-2">
                    {insights.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                        <span className="text-sm text-green-800">{safe(b)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(insights.opportunities) && insights.opportunities.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold">Opportunities</div>
                  <div className="grid gap-2">
                    {insights.opportunities.map((o, i) => (
                      <div key={i} className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                        <span className="text-sm text-blue-800">{safe(o)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(insights.recommendations) && insights.recommendations.length > 0 && (
                <div className="space-y-2">
                  <div className="font-semibold">Recommendations</div>
                  <div className="grid gap-2">
                    {insights.recommendations.map((r, i) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                        {r.category ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-red-700">{r.category}</div>
                            </div>
                            <div className="grid gap-1">
                              {(Array.isArray(r.items) ? r.items : [r.items]).filter(Boolean).map((it, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2" />
                                  <span className="text-sm text-red-800">{safe(it)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-800">{safe(r)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>
        )}
      </div>

      <div className="space-y-3">
        <button onClick={handleDownload} className="w-full py-3 px-4 bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white font-semibold rounded-xl">
          Download PDF
        </button>
        <button onClick={onReset} className="w-full py-3 px-4 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl">
          Start Over
        </button>
      </div>
    </motion.div>
  )
}


