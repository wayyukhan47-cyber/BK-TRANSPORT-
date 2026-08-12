import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Completely bypass credentials for testing
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    // Set a simple auth cookie
    response.cookies.set('admin_token', 'authenticated_user_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
