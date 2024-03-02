import { NextResponse } from 'next/server'
const jose = require('jose')

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    console.log(token.replace('Bearer ', ''))
    const decoded = await jose.jwtVerify(token.replace('Bearer ', ''), new TextEncoder().encode(process.env.JWT_SECRET))
    request.headers.set('userId', decoded.payload.userId)
    return NextResponse.next()
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'JWT invalid' }, { status: 401 })
  }
}
 
export const config = {
  matcher: '/api/notes/:path*',
}