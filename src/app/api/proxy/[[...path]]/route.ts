import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { auditorAuthRefresh } from '@/core/middlewares/api/auditor-auth-refresh'

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://survey-all.ru'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

type TokenPair = {
  accessToken: string
  refreshToken?: string
}

export async function GET(request: NextRequest) {
  return handleProxy(request)
}

export async function POST(request: NextRequest) {
  return handleProxy(request)
}

export async function PUT(request: NextRequest) {
  return handleProxy(request)
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request)
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request)
}

function applyTokenCookies(response: NextResponse, tokens: TokenPair) {
  response.cookies.set('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  })
  if (tokens.refreshToken) {
    response.cookies.set('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 30,
    })
  }
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
}

async function toNextResponse(upstream: Response): Promise<NextResponse> {
  if (upstream.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const text = await upstream.text()
  if (!text) {
    return new NextResponse(null, { status: upstream.status })
  }

  try {
    const data = JSON.parse(text)
    return NextResponse.json(data, { status: upstream.status })
  } catch {
    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'text/plain' },
    })
  }
}

async function forwardUpstream(
  targetUrl: string,
  method: string,
  body: string | undefined,
  accessToken: string | undefined,
): Promise<Response> {
  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return fetch(targetUrl, {
    method,
    headers,
    body: method !== 'GET' && method !== 'HEAD' ? body : undefined,
    cache: 'no-store',
  })
}

async function handleProxy(request: NextRequest) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  const pathname = request.nextUrl.pathname.replace('/api/proxy', '')
  const searchParams = request.nextUrl.searchParams.toString()
  const targetUrl = `${API_URL}${pathname}${searchParams ? `?${searchParams}` : ''}`

  console.log(`[Proxy] Forwarding ${request.method} to: ${targetUrl}`)

  // тело читаем один раз — нужен для retry после refresh
  const body =
    request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined

  try {
    let upstream = await forwardUpstream(targetUrl, request.method, body, accessToken)

    const isAuthRefreshCall = pathname.includes('/auditor-auth/refresh')
    const canRefresh =
      upstream.status === 401 && Boolean(refreshToken) && !isAuthRefreshCall

    if (canRefresh && refreshToken) {
      console.log('[Proxy] 401 — trying refresh token…')
      const refreshData = await auditorAuthRefresh(refreshToken)

      if (refreshData?.accessToken) {
        console.log('[Proxy] Refresh ok — retrying request')
        upstream = await forwardUpstream(
          targetUrl,
          request.method,
          body,
          refreshData.accessToken as string,
        )

        const response = await toNextResponse(upstream)
        applyTokenCookies(response, {
          accessToken: refreshData.accessToken,
          refreshToken: refreshData.refreshToken,
        })
        return response
      }

      console.log('[Proxy] Refresh failed — clearing cookies')
      const failed = await toNextResponse(upstream)
      clearAuthCookies(failed)
      return failed
    }

    return await toNextResponse(upstream)
  } catch (error) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
