// API Configuration
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // API Endpoints
  ENDPOINTS: {
    ANALYZE_AUDIO: '/api/audio-analysis/analyze-audio',
    ANALYZE_AUDIO_JSON: '/api/audio-analysis/analyze-audio-json',
    HEALTH_CHECK: '/api/audio-analysis/health'
  },
  
  // Request configuration
  REQUEST_CONFIG: {
    TIMEOUT: 120000, // 2 minutes timeout for audio processing
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1 second delay between retries
  },
  
  // File upload configuration
  UPLOAD_CONFIG: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_AUDIO_TYPES: [
      'audio/webm',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'audio/ogg'
    ],
    ALLOWED_EXTENSIONS: ['.webm', '.mp3', '.wav', '.m4a', '.ogg']
  }
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to check if file type is allowed
export const isAllowedAudioType = (file) => {
  return API_CONFIG.UPLOAD_CONFIG.ALLOWED_AUDIO_TYPES.includes(file.type) ||
         API_CONFIG.UPLOAD_CONFIG.ALLOWED_EXTENSIONS.some(ext => 
           file.name.toLowerCase().endsWith(ext)
         )
}

// Helper function to check file size
export const isFileSizeValid = (file) => {
  return file.size <= API_CONFIG.UPLOAD_CONFIG.MAX_FILE_SIZE
}
