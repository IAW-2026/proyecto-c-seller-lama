import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAuthRoute = createRouteMatcher([
  '/sign-in',
  '/sign-in/(.*)',
  '/sign-up',
  '/sign-up/(.*)',
]);

// Paginas privadas. Las APIs se autorizan dentro de cada route handler.
const isPrivateRoute = createRouteMatcher([
  '/admin',
  '/admin/(.*)',
  '/productos',
  '/productos/(.*)',
  '/ventas',
  '/ventas/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isPrivateRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/auth/redirect', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes, but route handlers decide authorization.
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes.
    '/__clerk/(.*)',
  ],
};
