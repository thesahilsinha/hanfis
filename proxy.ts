import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let cache = { at: 0, on: false, msg: '' }

async function getMaintenance() {
  if (Date.now() - cache.at < 60000) return cache
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const res = await fetch(`${url}/rest/v1/site_settings?select=maintenance_mode,maintenance_message&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    const s = (await res.json())?.[0]
    cache = { at: Date.now(), on: s?.maintenance_mode === true, msg: s?.maintenance_message || '' }
  } catch {
    cache.at = Date.now()
  }
  return cache
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin-login')) return NextResponse.next()

  if (pathname.startsWith('/admin')) {
    const auth = request.cookies.get('hanfi-admin-auth')
    if (!auth || auth.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.next()
  }

  const alwaysAllow = ['/maintenance', '/api/', '/_next/', '/favicon.ico', '/logo.jpg', '/logo.ico', '/images/']
  if (alwaysAllow.some(p => pathname.startsWith(p))) return NextResponse.next()

  const m = await getMaintenance()
  if (m.on) {
    const url = new URL('/maintenance', request.url)
    if (m.msg) url.searchParams.set('msg', m.msg)
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.jpg|logo.ico|images/).*)'],
}