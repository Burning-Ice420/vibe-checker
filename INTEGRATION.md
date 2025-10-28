# Backend Integration Guide

## 🚀 **Frontend-Backend Integration Complete**

Your frontend is now fully integrated with the backend API endpoints. Here's what has been implemented:

### ✅ **Integration Features**

#### **1. API Configuration**
- **Configurable Backend URL**: Set via `NEXT_PUBLIC_API_URL` environment variable
- **Default Backend**: `http://localhost:5000` (configurable)
- **Multiple Endpoints**: Support for both PDF and JSON responses

#### **2. Custom Hook (`useAudioAnalysis`)**
- **Centralized API Logic**: All API calls handled in one place
- **Error Handling**: Comprehensive error management
- **Loading States**: Built-in loading state management
- **Timeout Handling**: 2-minute timeout for audio processing
- **Retry Logic**: Automatic retry on failure

#### **3. Dual Endpoint Support**
- **Primary**: PDF download endpoint (`/api/audio-analysis/analyze-audio`)
- **Fallback**: JSON response endpoint (`/api/audio-analysis/analyze-audio-json`)
- **Automatic Detection**: Detects response type and handles accordingly

#### **4. File Upload Features**
- **Audio Format Support**: WebM, MP3, WAV, M4A, OGG
- **File Size Validation**: 50MB maximum
- **Type Validation**: Audio files only
- **Progress Tracking**: Real-time upload progress

### 🔧 **Setup Instructions**

#### **1. Environment Configuration**
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### **2. Backend Requirements**
Ensure your backend is running on the configured URL with these endpoints:
- `POST /api/audio-analysis/analyze-audio` (PDF response)
- `POST /api/audio-analysis/analyze-audio-json` (JSON response)
- `GET /api/audio-analysis/health` (Health check)

#### **3. CORS Configuration**
Your backend should allow CORS from your frontend domain:
```javascript
// Backend CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}))
```

### 📋 **API Request Format**

The frontend sends FormData with:
```javascript
{
  audio: File, // WebM audio file
  name: String, // User's name
  email: String, // User's email
  phone: String // User's phone
}
```

### 📤 **API Response Handling**

#### **PDF Response (Primary)**
- **Content-Type**: `application/pdf`
- **Action**: Automatic download
- **Filename**: `career-analysis-{name}.pdf`
- **UI**: Success message with mock results display

#### **JSON Response (Fallback)**
- **Content-Type**: `application/json`
- **Format**:
```javascript
{
  transcription: "Audio transcript...",
  insights: {
    whyUseful: "Analysis value explanation",
    benefits: ["Benefit 1", "Benefit 2", ...],
    opportunities: ["Opportunity 1", "Opportunity 2", ...]
  }
}
```

### 🛠 **Error Handling**

#### **Network Errors**
- Connection timeout (2 minutes)
- Server unavailable
- Invalid response format

#### **Validation Errors**
- Invalid file type
- File too large (>50MB)
- Missing required fields

#### **User-Friendly Messages**
- Clear error descriptions
- Actionable suggestions
- Retry instructions

### 🎯 **User Experience Flow**

1. **Form Submission**: User fills form and records audio
2. **File Upload**: Audio and form data sent to backend
3. **Processing**: 30-60 second analysis period
4. **PDF Download**: Automatic download of analysis report
5. **Success Display**: Confirmation with insights preview
6. **Error Handling**: Clear error messages if issues occur

### 🔍 **Debugging**

#### **Console Logs**
- API request/response details
- Error messages with stack traces
- File upload progress

#### **Network Tab**
- Check API calls in browser dev tools
- Verify request/response format
- Monitor upload progress

#### **Backend Logs**
- Check server logs for processing errors
- Verify file upload success
- Monitor API response times

### 🚀 **Deployment**

#### **Frontend Deployment**
1. Set `NEXT_PUBLIC_API_URL` to your production backend URL
2. Deploy to Vercel, Netlify, or your preferred platform
3. Ensure CORS allows your frontend domain

#### **Backend Deployment**
1. Deploy backend to your server
2. Update frontend environment variable
3. Test end-to-end functionality

### 📞 **Support**

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Check CORS configuration
4. Verify file upload limits
5. Test with different audio formats

---

**Integration Status**: ✅ **Complete**  
**Last Updated**: Current  
**Compatibility**: Backend API v1.0+
