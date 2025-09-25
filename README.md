# Oura + Steno Chat Demo

This is a demo application showing how to integrate Oura Ring health data with the Steno AI chat platform. It demonstrates OAuth authentication with Oura and cookie-based data sharing with a chat subdomain.

## Architecture

### Main Landing Page
- **Domain**: `your-domain.com` (this project)
- **Purpose**: Oura OAuth authentication and landing page
- **Tech**: NextJS 14, TailwindCSS

### Chat Subdomain
- **Domain**: `chat.your-domain.com` (separate deployment of steno-chat)
- **Purpose**: AI chat interface with Oura data integration
- **Tech**: Steno Chat platform

## Setup Instructions

### 1. Environment Variables

Copy `.env.local` and update the values:

```bash
# Oura OAuth Configuration (provided)
OURA_CLIENT_ID=HVLP3Q7VRJLK5RX3
OURA_CLIENT_SECRET=ANV2UNEGP2DNREWZCIECUNTOMW7S4ZYN

# Steno Chat Configuration
STENO_CHAT_ID=devin-ai-SxIFG3

# NextJS Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Production URLs (update after deployment)
VERCEL_URL=your-vercel-app.vercel.app
PRODUCTION_URL=https://your-domain.com
```

### 2. Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 3. Vercel Deployment Strategy

#### Option A: Two Separate Projects (Recommended)

1. **Main Site Deployment**:
   ```bash
   # Deploy this project to Vercel
   vercel --prod
   ```

2. **Chat Subdomain Deployment**:
   ```bash
   # Deploy the steno-chat project separately
   cd /path/to/steno-chat
   vercel --prod
   ```

3. **Domain Configuration**:
   - Point `your-domain.com` → main site Vercel project
   - Point `chat.your-domain.com` → steno-chat Vercel project
   - Both should use the same root domain for cookie sharing

#### Option B: Custom Domain Setup

1. In Vercel dashboard for main site:
   - Add custom domain: `your-domain.com`

2. In Vercel dashboard for chat:
   - Add custom domain: `chat.your-domain.com`

3. DNS Configuration:
   ```
   A     your-domain.com        → 76.76.19.61
   CNAME chat.your-domain.com  → cname.vercel-dns.com
   ```

## Cookie Sharing Strategy

The application uses cookies to share Oura authentication data between domains:

### Cookie Configuration
- **Name**: `oura_access_token`
- **Domain**: `.your-domain.com` (note the leading dot)
- **Path**: `/`
- **HttpOnly**: `false` (allows client-side access for embed script)
- **Secure**: `true` (in production)
- **SameSite**: `lax`

### How It Works

1. User authenticates with Oura on main site (`your-domain.com`)
2. OAuth callback sets cookie with domain `.your-domain.com`
3. User clicks to open chat, redirected to `chat.your-domain.com`
4. Steno chat embed script reads the cookie from the parent domain
5. Chat platform can access Oura data using the shared token

## Oura Integration

### Available Endpoints

- `GET /api/oura/profile` - User's personal information
- `GET /api/oura/sleep` - Last 7 days of sleep data
- `GET /api/oura/activity` - Activity data (can be added)

### OAuth Flow

1. User clicks "Connect Your Oura Ring"
2. Redirected to Oura OAuth: `https://cloud.ouraring.com/oauth/authorize`
3. User authorizes application
4. Oura redirects back to `/auth/oura?code=...`
5. Application exchanges code for access token
6. Token stored in cross-domain cookie
7. User redirected back to main page

## Chat Integration

The chat integration uses the Steno embed script:

```html
<script
  src="https://cdn.jsdelivr.net/gh/aisteno/embed@latest/steno-chat.js"
  data-id="devin-ai-SxIFG3"
  data-position="right"
  data-mode="fullscreen">
</script>
```

### Chat ID Configuration
- Current ID: `devin-ai-SxIFG3`
- Update the chat URLs in the React components to point to your actual chat subdomain

## Security Considerations

1. **Cookie Domain**: Ensure cookie domain matches your actual domain structure
2. **HTTPS**: Use HTTPS in production for secure cookie transmission
3. **Token Expiry**: Implement token refresh logic for long-term sessions
4. **Scope Limitation**: Only request necessary Oura data scopes

## Customization

### Update Chat URLs
Replace `https://chat.example.com` with your actual chat subdomain in:
- `src/app/page.tsx` (all button onClick handlers)

### Styling
The landing page mimics the Tony Robbins design patterns. Customize:
- Colors in `tailwind.config.ts`
- Component styling in `src/app/page.tsx`
- Global styles in `src/app/globals.css`

## Testing

### Local Testing
1. Set up ngrok or similar tunnel for OAuth callbacks
2. Update Oura OAuth redirect URI to tunnel URL
3. Test authentication flow

### Production Testing
1. Deploy to Vercel
2. Configure custom domains
3. Update OAuth redirect URI to production URL
4. Test end-to-end flow

## Troubleshooting

### Common Issues

1. **Cookie not sharing**: Check domain configuration
2. **OAuth redirect error**: Verify redirect URI matches exactly
3. **Chat not loading**: Check chat subdomain deployment
4. **API errors**: Verify Oura token validity and scopes