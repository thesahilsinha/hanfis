import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Upload not configured' }, { status: 501 })
}