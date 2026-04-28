import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokens } = body;

    if (!tokens) {
      return NextResponse.json({ error: 'No tokens provided' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    response.cookies.set('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    if (tokens.refreshToken) {
      response.cookies.set('refreshToken', tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 дней
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
