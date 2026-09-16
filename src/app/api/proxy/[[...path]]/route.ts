import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = 'https://survey-all.ru';

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function PUT(request: NextRequest) {
  return handleProxy(request);
}

export async function PATCH(request: NextRequest) {
  return handleProxy(request);
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  
  // Извлекаем путь после /api/proxy
  const pathname = request.nextUrl.pathname.replace('/api/proxy', '');
  const searchParams = request.nextUrl.searchParams.toString();
  
  const targetUrl = `${API_URL}${pathname}${searchParams ? `?${searchParams}` : ''}`;

  console.log(`[Proxy] Forwarding ${request.method} to: ${targetUrl}`);

  const headers = new Headers();
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.text() 
        : undefined,
      cache: 'no-store',
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const text = await response.text();
    if (!text) {
      return new NextResponse(null, { status: response.status });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      return new NextResponse(text, {
        status: response.status,
        headers: { 'Content-Type': response.headers.get('Content-Type') || 'text/plain' },
      });
    }
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}
