# Futuristic Music Kiosk

AI-powered music generation kiosk with voice cloning, album covers, and music videos.

## Features

- 🎵 AI Music Generation (Sonauto API)
- 🤖 AI Description Enhancement (Gemini API)
- 🎤 Voice Cloning (Replicate API)
- 🎨 Album Cover Generation (Replicate API)
- 🎬 Music Video Creation (Replicate API)
- 💳 Payment Integration (Cash App)
- 🔒 CEO Testing Panel (Secret Bypass)
- 📊 Admin Dashboard
- 📱 Mobile Responsive

## Deployment Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env` file in the root of the project and add your API keys:
```
API_KEY=YOUR_GEMINI_API_KEY
```
*Note: Other API keys for Sonauto and Replicate are currently set in `constants.tsx` but should also be moved to environment variables for a full production deployment.*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy to a Hosting Service
- Upload the contents of the `dist/` folder to your hosting provider.
- Ensure you have set the necessary environment variables in your hosting service's dashboard.

## API Keys Required

- **Sonauto API**: Music generation (Paid tier)
- **Gemini API**: AI enhancement (Paid tier)
- **Replicate API**: Voice cloning, videos, images ($10 credit)

## Configuration

### Pricing Tiers
Configuration can be managed in the Admin Dashboard. Default values are set in `constants.tsx`.
- Voice Mode: $10-$500 (6 tiers)
- Instrumental: $25 (fixed)
- Express: $15 (fixed)

### CEO Bypass
A secret testing panel can be accessed for development and demonstration purposes.
**Activation**: Click the main title on the home screen 5 times.
**PIN**: Enter "BYPASS" or the admin pin (default "505090").

## Support

For issues or questions, contact: richdavis2011@gmail.com

## License

Proprietary - All rights reserved
