"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function FormScreen({ onSubmit }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" })
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" })
  const [focusedField, setFocusedField] = useState(null)

  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "" }
    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const inputVariants = {
    focused: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    unfocused: {
      scale: 1,
      transition: { duration: 0.2 }
    }
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
          {/* Header */}
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
                🏖️ Get Your Vibe Report
              </h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                Discover your travel personality with AI-powered analysis
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Name Field */}
            <motion.div 
              variants={inputVariants}
              animate={focusedField === 'name' ? 'focused' : 'unfocused'}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 bg-input/50 border-2 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all duration-200 ${
                  errors.name ? 'border-destructive' : 'border-border focus:border-accent'
                }`}
              />
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div 
              variants={inputVariants}
              animate={focusedField === 'email' ? 'focused' : 'unfocused'}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 bg-input/50 border-2 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all duration-200 ${
                  errors.email ? 'border-destructive' : 'border-border focus:border-accent'
                }`}
              />
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Phone Field */}
            <motion.div 
              variants={inputVariants}
              animate={focusedField === 'phone' ? 'focused' : 'unfocused'}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-4 bg-input/50 border-2 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all duration-200 ${
                  errors.phone ? 'border-destructive' : 'border-border focus:border-accent'
                }`}
              />
              {errors.phone && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-accent via-primary to-accent text-accent-foreground font-semibold rounded-xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 text-base relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Start My Vibe Analysis 🚀
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </motion.div>
  )
}
