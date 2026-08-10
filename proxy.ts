import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow admin routes (except the login page itself) only if authenticated
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const auth = request.cookies.get('hanfi-admin-auth')
    if (!auth || auth.value !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.next()
  }

  // Allow these always regardless of maintenance
  const alwaysAllow = [
    '/admin-login',
    '/maintenance',
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/logo.jpg',
    '/images/',
  ]
  if (alwaysAllow.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check maintenance mode
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const res = await fetch(`${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode,maintenance_message&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    if (res.ok) {
      const data = await res.json()
      const settings = data?.[0]
      if (settings?.maintenance_mode === true) {
        // Redirect to maintenance page with message as query param
        const url = new URL('/maintenance', request.url)
        if (settings.maintenance_message) {
          url.searchParams.set('msg', settings.maintenance_message)
        }
        return NextResponse.rewrite(url)
      }
    }
  } catch (e) {
    // If we can't check settings, just let through
    console.error('proxy settings check failed:', e)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|logo.jpg|images/).*)',
  ]
}