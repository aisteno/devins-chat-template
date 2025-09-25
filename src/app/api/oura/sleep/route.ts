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
    // Get last 7 days of sleep data
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const response = await fetch(
      `https://api.ouraring.com/v2/usercollection/sleep?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Oura sleep data')
    }

    const sleepData = await response.json()
    return NextResponse.json(sleepData)
  } catch (error) {
    console.error('Oura API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Oura sleep data' },
      { status: 500 }
    )
  }
}