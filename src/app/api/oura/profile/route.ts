import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('oura_access_token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'No Oura access token found' },
      { status: 401 }
    )
  }

  try {
    const response = await fetch('https://api.ouraring.com/v2/usercollection/personal_info', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Oura profile')
    }

    const profile = await response.json()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Oura API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Oura profile' },
      { status: 500 }
    )
  }
}