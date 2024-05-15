// import { useSession } from 'next-auth/react';

// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from './auth';

// export default async function middleware(request: NextRequest) {
//   // Your middleware logic here
//   const user = await auth();
//   // Example: Conditional logic based on pathname
//   if (!user || user === undefined) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next(); // Pass the request on by default
// }

// export const config = {
//   matcher: ['/trips', '/reservations', '/properties', '/favorites'],
// };

import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  // Public routes definition (assuming you want these routes to be accessible without authentication)

  // ... rest of your middleware logic (if any)
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
