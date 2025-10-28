import { useState, useCallback } from 'react'
import { getApiUrl, API_CONFIG } from '../config/api'

// Professional PDF Generation function
const generatePDFReport = async (userData, analysis, questions, timestamp) => {
  try {
    // Dynamic import of jsPDF
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF('p', 'mm', 'a4')
    
    // Professional color scheme
    const colors = {
      primary: '#1e40af',      // Professional blue
      secondary: '#374151',    // Dark gray
      accent: '#059669',       // Green for highlights
      danger: '#dc2626',       // Red for important items
      muted: '#6b7280',        // Light gray
      background: '#f8fafc'    // Light background
    }
    
    // Clean text function to remove encoding artifacts
    const cleanText = (text) => {
      if (!text) return ''
      return String(text)
        .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
        .replace(/[^\x20-\x7E]/g, '') // Remove control characters
        .replace(/\s+/g, ' ')         // Normalize whitespace
        .replace(/\s+$/g, '')         // Remove trailing spaces
        .replace(/^\s+/g, '')         // Remove leading spaces
        .trim()
    }
    
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (2 * margin)
    let yPosition = 20
    
    // Helper function to add text with professional formatting
    const addText = (text, fontSize = 12, isBold = false, color = colors.secondary, align = 'left', spacing = 1.2) => {
      const cleanContent = cleanText(text)
      if (!cleanContent) return
      
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      doc.setTextColor(color)
      
      const lines = doc.splitTextToSize(cleanContent, contentWidth)
      lines.forEach(line => {
        if (yPosition > pageHeight - 30) {
          addNewPage()
        }
        doc.text(line, margin, yPosition, { align })
        yPosition += fontSize * spacing
      })
      yPosition += 5 // Consistent spacing after text
    }
    
    // Helper function to add a new page with header
    const addNewPage = () => {
      doc.addPage()
      yPosition = 20
      // Add page header
      doc.setFontSize(8)
      doc.setTextColor(colors.muted)
      doc.text('Get Your Vibe Report - Travel Personality Analysis', margin, 15)
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 20, 15)
    }
    
    // Helper function to add a section divider
    const addSectionDivider = (title, icon = '') => {
      if (yPosition > pageHeight - 50) {
        addNewPage()
      }
      
      // Add consistent space before section
      yPosition += 15
      
      // Section title with underline
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(colors.primary)
      const cleanTitle = cleanText(`${icon} ${title}`)
      doc.text(cleanTitle, margin, yPosition)
      
      // Draw underline
      const titleWidth = doc.getTextWidth(cleanTitle)
      doc.setDrawColor(colors.primary)
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition + 2, margin + titleWidth, yPosition + 2)
      
      yPosition += 12 // Consistent spacing after section header
    }
    
    // Helper function to add a professional box
    const addBox = (content, backgroundColor = colors.background, borderColor = colors.primary) => {
      if (yPosition > pageHeight - 40) {
        addNewPage()
      }
      
      const cleanContent = cleanText(content)
      if (!cleanContent) return
      
      // Calculate box height based on content
      doc.setFontSize(10)
      const lines = doc.splitTextToSize(cleanContent, contentWidth - 10)
      const boxHeight = Math.max(15, lines.length * 4 + 10)
      const boxY = yPosition - 5
      
      // Draw box background
      doc.setFillColor(backgroundColor)
      doc.rect(margin, boxY, contentWidth, boxHeight, 'F')
      
      // Draw box border
      doc.setDrawColor(borderColor)
      doc.setLineWidth(0.3)
      doc.rect(margin, boxY, contentWidth, boxHeight, 'S')
      
      // Add content
      doc.setFontSize(10)
      doc.setTextColor(colors.secondary)
      doc.text(cleanContent, margin + 5, boxY + 10)
      
      yPosition += boxHeight + 8 // Consistent spacing after box
    }
    
    // Helper function to add bullet points
    const addBulletList = (items, bulletColor = colors.accent) => {
      items.forEach((item, index) => {
        if (yPosition > pageHeight - 20) {
          addNewPage()
        }
        
        const cleanItem = cleanText(item)
        if (!cleanItem) return
        
        // Add bullet point
        doc.setFillColor(bulletColor)
        doc.circle(margin + 3, yPosition - 2, 1, 'F')
        
        // Add text with proper spacing
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(colors.secondary)
        
        const lines = doc.splitTextToSize(cleanItem, contentWidth - 15)
        lines.forEach((line, lineIndex) => {
          if (yPosition > pageHeight - 20) {
            addNewPage()
          }
          doc.text(line, margin + 8, yPosition)
          yPosition += 4
        })
        
        yPosition += 2 // Space between bullet points
      })
    }
    
    // Professional Header
    doc.setFillColor(colors.primary)
    doc.rect(0, 0, pageWidth, 40, 'F')
    
    // Main title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor('#ffffff')
    doc.text('VIBE REPORT', margin, 25, { align: 'left' })
    
    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Travel Personality Analysis', margin, 32, { align: 'left' })
    
    // Reset position after header
    yPosition = 50
    
    // Executive Summary Box
    addBox(`This comprehensive travel personality analysis was generated on ${new Date(timestamp).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} for ${userData.name}. The analysis provides detailed insights into your travel preferences, personality traits, and personalized recommendations for your future adventures.`)
    
    // Personal Information Section
    addSectionDivider('Personal Information', '👤')
    
    const personalInfo = [
      `Full Name: ${userData.name}`,
      `Email Address: ${userData.email}`,
      `Phone Number: ${userData.phone}`,
      `Analysis Date: ${new Date(timestamp).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`
    ]
    
    personalInfo.forEach(info => {
      addText(info, 11, false, colors.secondary)
    })
    
    // Questions Asked Section
    addSectionDivider('Analysis Questions', '❓')
    addText('The following questions were used to analyze your travel personality:', 10, false, colors.muted)
    yPosition += 5
    
    questions.forEach((question, index) => {
      addText(`${index + 1}. ${question}`, 10, false, colors.secondary)
    })
    
    // Transcription Section
    addSectionDivider('Your Responses', '🎤')
    addText('Based on your recorded responses, here\'s what you shared:', 10, false, colors.muted)
    yPosition += 5
    
    // Add transcription in a professional box
    const transcriptionBox = analysis.transcription.length > 200 
      ? analysis.transcription.substring(0, 200) + '...' 
      : analysis.transcription
    
    addBox(transcriptionBox, '#f8fafc', colors.primary)
    
    // Analysis Results Section
    if (analysis.analysis) {
      addSectionDivider('Travel Personality Analysis', '🧠')
      
      // Overall Score and Confidence
      if (analysis.analysis.overallScore || analysis.analysis.confidenceLevel) {
        addText('Assessment Summary', 12, true, colors.primary)
        yPosition += 3
        
        if (analysis.analysis.overallScore) {
          const scoreText = `Overall Compatibility Score: ${analysis.analysis.overallScore}/100`
          addText(scoreText, 11, true, colors.accent)
          
          // Add score visualization
          const scoreWidth = (analysis.analysis.overallScore / 100) * (contentWidth * 0.6)
          doc.setFillColor(colors.accent)
          doc.rect(margin, yPosition, scoreWidth, 5, 'F')
          doc.setDrawColor(colors.muted)
          doc.rect(margin, yPosition, contentWidth * 0.6, 5, 'S')
          yPosition += 10
        }
        
        if (analysis.analysis.confidenceLevel) {
          addText(`Analysis Confidence: ${analysis.analysis.confidenceLevel}`, 10, false, colors.muted)
        }
        yPosition += 5
      }
      
      // Travel Personality Traits
      if (analysis.analysis.travelPersonality) {
        addText('Travel Personality Traits', 12, true, colors.primary)
        yPosition += 5
        
        const traits = analysis.analysis.travelPersonality.map(trait => {
          if (typeof trait === 'object' && trait.trait) {
            const cleanTrait = cleanText(trait.trait)
            const cleanReason = cleanText(trait.reason || '')
            return `${cleanTrait}${trait.percentage ? ` (${trait.percentage}%)` : ''}${cleanReason ? ` - ${cleanReason}` : ''}`
          }
          return cleanText(trait)
        }).filter(trait => trait) // Remove empty traits
        
        addBulletList(traits, colors.accent)
        yPosition += 8
      }
      
      // Travel Preferences
      if (analysis.analysis.preferences) {
        addText('Travel Preferences', 12, true, colors.primary)
        yPosition += 5
        
        const preferences = analysis.analysis.preferences.map(pref => {
          if (typeof pref === 'object' && pref.preference) {
            const cleanPref = cleanText(pref.preference)
            const cleanReason = cleanText(pref.reason || '')
            return `${cleanPref}${pref.percentage ? ` (${pref.percentage}%)` : ''}${cleanReason ? ` - ${cleanReason}` : ''}`
          }
          return cleanText(pref)
        }).filter(pref => pref) // Remove empty preferences
        
        addBulletList(preferences, colors.accent)
        yPosition += 8
      }
      
      // Spending Habits
      if (analysis.analysis.spendingHabits) {
        addText('Travel Spending Patterns', 12, true, colors.primary)
        yPosition += 5
        
        if (Array.isArray(analysis.analysis.spendingHabits)) {
          const cleanHabits = analysis.analysis.spendingHabits.map(cleanText).filter(habit => habit)
          addBulletList(cleanHabits, colors.accent)
        } else {
          Object.entries(analysis.analysis.spendingHabits).forEach(([category, items]) => {
            const cleanCategory = cleanText(category)
            if (cleanCategory) {
              addText(`${cleanCategory}:`, 10, true, colors.secondary)
              yPosition += 2
              
              if (Array.isArray(items)) {
                items.forEach(item => {
                  const cleanItem = cleanText(item)
                  if (cleanItem) {
                    addText(`  • ${cleanItem}`, 9, false, colors.muted)
                  }
                })
              } else {
                const cleanItem = cleanText(items)
                if (cleanItem) {
                  addText(`  • ${cleanItem}`, 9, false, colors.muted)
                }
              }
              yPosition += 3
            }
          })
        }
        yPosition += 8
      }
      
      // Destination Experience
      if (analysis.analysis.goaExperience) {
        addText('Destination Experience Insights', 12, true, colors.primary)
        yPosition += 5
        
        if (Array.isArray(analysis.analysis.goaExperience)) {
          const cleanExperiences = analysis.analysis.goaExperience.map(cleanText).filter(exp => exp)
          addBulletList(cleanExperiences, colors.accent)
        } else {
          Object.entries(analysis.analysis.goaExperience).forEach(([category, items]) => {
            const cleanCategory = cleanText(category)
            if (cleanCategory) {
              addText(`${cleanCategory}:`, 10, true, colors.secondary)
              yPosition += 2
              
              if (Array.isArray(items)) {
                items.forEach(item => {
                  const cleanItem = cleanText(item)
                  if (cleanItem) {
                    addText(`  • ${cleanItem}`, 9, false, colors.muted)
                  }
                })
              } else {
                const cleanItem = cleanText(items)
                if (cleanItem) {
                  addText(`  • ${cleanItem}`, 9, false, colors.muted)
                }
              }
              yPosition += 3
            }
          })
        }
        yPosition += 8
      }
    }
    
    // Insights and Recommendations Section
    if (analysis.insights) {
      addSectionDivider('Insights & Recommendations', '✨')
      
      // Why This Analysis Matters
      if (analysis.insights.whyUseful) {
        addText('Analysis Value', 12, true, colors.primary)
        yPosition += 5
        addBox(cleanText(analysis.insights.whyUseful), '#f0f9ff', colors.primary)
      }
      
      // Benefits
      if (analysis.insights.benefits && analysis.insights.benefits.length > 0) {
        addText('Key Benefits', 12, true, colors.primary)
        yPosition += 5
        const cleanBenefits = analysis.insights.benefits.map(cleanText).filter(benefit => benefit)
        addBulletList(cleanBenefits, colors.accent)
        yPosition += 8
      }
      
      // Opportunities
      if (analysis.insights.opportunities && analysis.insights.opportunities.length > 0) {
        addText('Growth Opportunities', 12, true, colors.primary)
        yPosition += 5
        const cleanOpportunities = analysis.insights.opportunities.map(cleanText).filter(opp => opp)
        addBulletList(cleanOpportunities, colors.primary)
        yPosition += 8
      }
      
      // Recommendations
      if (analysis.insights.recommendations && analysis.insights.recommendations.length > 0) {
        addText('Personalized Recommendations', 12, true, colors.primary)
        yPosition += 5
        
        analysis.insights.recommendations.forEach(recommendation => {
          if (typeof recommendation === 'object' && recommendation.category) {
            const cleanCategory = cleanText(recommendation.category)
            if (cleanCategory) {
              addText(`${cleanCategory}:`, 10, true, colors.danger)
              yPosition += 2
              
              if (Array.isArray(recommendation.items)) {
                recommendation.items.forEach(item => {
                  const cleanItem = cleanText(item)
                  if (cleanItem) {
                    addText(`  • ${cleanItem}`, 9, false, colors.muted)
                  }
                })
              } else {
                const cleanItem = cleanText(recommendation.items)
                if (cleanItem) {
                  addText(`  • ${cleanItem}`, 9, false, colors.muted)
                }
              }
              yPosition += 3
            }
          } else if (typeof recommendation === 'object' && recommendation.recommendation) {
            const cleanRec = cleanText(recommendation.recommendation)
            const cleanReason = cleanText(recommendation.reason || '')
            if (cleanRec) {
              addText(`• ${cleanRec}${recommendation.priority ? ` (${recommendation.priority})` : ''}`, 10, false, colors.danger)
              if (cleanReason) {
                addText(`  ${cleanReason}`, 9, false, colors.muted)
              }
              yPosition += 3
            }
          } else {
            const cleanRec = cleanText(recommendation)
            if (cleanRec) {
              addText(`• ${cleanRec}`, 10, false, colors.danger)
              yPosition += 3
            }
          }
        })
        yPosition += 8
      }
    }
    
    // Professional Footer
    addSectionDivider('Report Information', '')
    
    const reportInfo = [
      `Report Generated: ${new Date(timestamp).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })}`,
      `Analysis Method: AI-Powered Voice Analysis`,
      `Report Version: 1.0`,
      `Confidentiality: This report is confidential and intended solely for ${cleanText(userData.name)}`
    ]
    
    reportInfo.forEach(info => {
      addText(info, 9, false, colors.muted)
    })
    
    // Add professional disclaimer
    yPosition += 10
    addText('Disclaimer', 10, true, colors.secondary)
    addText('This analysis is based on voice recordings and responses provided during the assessment. Results should be considered as insights and recommendations rather than definitive personality assessments. Individual experiences may vary.', 8, false, colors.muted)
    
    // Add page numbers and footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      
      // Add footer line
      doc.setDrawColor(colors.primary)
      doc.setLineWidth(0.3)
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)
      
      // Add page numbers
      doc.setFontSize(8)
      doc.setTextColor(colors.muted)
      doc.text(`Get Your Vibe Report - Travel Personality Analysis`, margin, pageHeight - 10)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10)
    }
    
    // Download the PDF with professional filename
    const dateStr = new Date(timestamp).toISOString().split('T')[0]
    const fileName = `VibeReport_${userData.name.replace(/\s+/g, '_')}_${dateStr}.pdf`
    doc.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Fallback: show alert to user
    alert('PDF generation failed. The analysis data is still available below.')
  }
}

export const useAudioAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const analyzeAudio = useCallback(async (audioBlob, userFormData) => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")
      formData.append("name", userFormData.name)
      formData.append("email", userFormData.email)
      formData.append("phone", userFormData.phone)

      // Try the main PDF endpoint first
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ANALYZE_AUDIO), {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(API_CONFIG.REQUEST_CONFIG.TIMEOUT)
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`)
      }

      // Parse JSON response
      const data = await response.json()
      
      // Handle the new backend response format
      if (data.success && data.data) {
        const { userData, analysis, questions, timestamp } = data.data
        
        // Generate PDF on frontend
        await generatePDFReport(userData, analysis, questions, timestamp)
        
        // Set results for display
        setResults({
          transcription: analysis.transcription,
          insights: analysis.insights,
          analysis: analysis.analysis,
          questions: questions,
          userData: userData,
          timestamp: timestamp
        })
      } else if (data.error || data.message) {
        // Error response
        setResults({
          transcription: data.message || data.error || "Analysis failed",
          insights: {
            whyUseful: "There was an error processing your audio. Please try again.",
            benefits: ["Check your audio quality", "Ensure stable internet connection"],
            opportunities: ["Retry the analysis", "Contact support if issues persist"]
          }
        })
      } else {
        // Fallback for unexpected format
        setResults({
          transcription: "Analysis completed - unexpected response format",
          insights: {
            whyUseful: "Your audio has been analyzed but the response format was unexpected.",
            benefits: ["Analysis completed", "Check the raw data below"],
            opportunities: ["Review the response", "Contact support if needed"],
            rawData: data
          }
        })
      }
    } catch (error) {
      console.error("Error analyzing audio:", error)
      const errorMessage = error.name === 'TimeoutError' 
        ? "Analysis timed out. Please try again with a shorter audio recording."
        : `Error processing audio: ${error.message}. Please check your connection and try again.`
      
      setError(errorMessage)
      setResults({
        transcription: errorMessage,
        insights: {
          whyUseful: "Unable to process your audio at this time. Please ensure your internet connection is stable and try again.",
          benefits: [
            "Check your internet connection",
            "Verify your audio file is in a supported format",
            "Ensure your audio file is not too large",
            "Try recording again with clear audio"
          ],
          opportunities: [
            "Retry the analysis once connection is stable",
            "Consider recording in a quieter environment",
            "Ensure your microphone is working properly",
            "Contact support if the issue persists"
          ]
        }
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResults(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    analyzeAudio,
    isLoading,
    error,
    results,
    reset
  }
}
