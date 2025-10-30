# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Essential Variables

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Optional Environment Variables

### Backend Authentication (if your backend requires it)
```bash
BACKEND_API_KEY=your_api_key_here
BACKEND_SECRET=your_secret_here
```

### Analytics and Monitoring
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

### Feature Flags
```bash
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### PDF Generation Settings
```bash
NEXT_PUBLIC_PDF_COMPANY_NAME="Get Your Vibe Report"
NEXT_PUBLIC_PDF_COMPANY_LOGO_URL="https://your-domain.com/logo.png"
```

### Audio Recording Settings
```bash
NEXT_PUBLIC_MAX_RECORDING_DURATION=30
NEXT_PUBLIC_AUDIO_QUALITY=high
```

### Development Settings
```bash
NODE_ENV=development
```

## How to Set Up

1. Create a `.env.local` file in your project root directory
2. Add the required variables (at minimum, just `NEXT_PUBLIC_API_URL`)
3. Update the values according to your backend setup
4. Restart your development server

## Backend URL Examples

- **Local Development**: `http://localhost:5000`
- **Production**: `https://your-backend-domain.com`
- **Staging**: `https://staging.your-backend-domain.com`

## Notes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without this prefix are only available on the server side
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Use `.env.example` to document required variables for other developers

