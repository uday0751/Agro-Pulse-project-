import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

const PROTECTED_ROUTES = ["/seller", "/profile", "/profile-setup", "/settings"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow Next.js internals and static files early bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files like favicon, images
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = pathname === "/auth"

  // Fast-path bypass for public routes: render immediately without blocking remote network calls
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // If Supabase environment variables are missing, fail open for public or redirect protected
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({ request: { headers: request.headers } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && isProtectedRoute) {
      const loginUrl = new URL("/auth", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch (error) {
    console.error("Middleware Supabase error:", error)
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
