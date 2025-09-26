import { NextRequest, NextResponse } from 'next/server'

function getBaseUrl(request: NextRequest) {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NGROK_URL || request.nextUrl.origin
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // If user denied access
  if (error) {
    return NextResponse.redirect(new URL('/?error=access_denied', request.url))
  }

  // If no code, redirect to Oura OAuth
  if (!code) {
    // For local development, we need to use a tunneling service like ngrok
    // or deploy to Vercel for OAuth to work since Oura requires HTTPS
    const baseUrl = getBaseUrl(request)
    const redirectUri = `${baseUrl}/auth/oura`

    const authParams = new URLSearchParams({
      client_id: process.env.OURA_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'daily heartrate personal'
    })

    const authUrl = `https://cloud.ouraring.com/oauth/authorize?${authParams.toString()}`
    return NextResponse.redirect(authUrl)
  }

  // Exchange code for tokens
  try {
    const baseUrl = getBaseUrl(request)
    const redirectUri = `${baseUrl}/auth/oura`

    const tokenResponse = await fetch('https://api.ouraring.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.OURA_CLIENT_ID!,
        client_secret: process.env.OURA_CLIENT_SECRET!,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const tokens = await tokenResponse.json()
    console.log('OAuth tokens received:', {
      access_token: tokens.access_token ? 'present' : 'missing',
      refresh_token: tokens.refresh_token ? 'present' : 'missing'
    })

    // Create response with redirect back to the correct base URL
    const response = NextResponse.redirect(new URL('/?connected=true', baseUrl))

    // Set cookies with domain for subdomain sharing
    const cookieOptions: any = {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Allow client-side access
      secure: true, // Always use secure
      sameSite: 'lax' as const
    }

    // Set domain to .steno.ai for subdomain cookie sharing
    // This allows devin.steno.ai and devinchat.steno.ai to share cookies
    if (baseUrl.includes('steno.ai')) {
      cookieOptions.domain = '.steno.ai'
    } else if (process.env.VERCEL_URL && !process.env.NGROK_URL) {
      // For other Vercel deployments
      const domain = `.${process.env.VERCEL_URL.split('.').slice(-2).join('.')}`
      cookieOptions.domain = domain
    }

    console.log('Setting cookie with options:', cookieOptions)
    response.cookies.set('oura_access_token', tokens.access_token, cookieOptions)

    if (tokens.refresh_token) {
      const refreshCookieOptions = {
        ...cookieOptions,
        httpOnly: true, // Keep refresh token secure
        maxAge: 60 * 60 * 24 * 30, // 30 days
      }
      response.cookies.set('oura_refresh_token', tokens.refresh_token, refreshCookieOptions)
    }

    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url))
  }
}