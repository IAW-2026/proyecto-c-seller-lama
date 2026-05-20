import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Definir rutas públicas
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-in/(.*)',
  '/sign-up',
  '/sign-up/(.*)',
  '/api/webhooks/clerk',
]);

const isAuthRoute = createRouteMatcher([
  '/sign-in',
  '/sign-in/(.*)',
  '/sign-up',
  '/sign-up/(.*)',
]);

// Definir rutas privadas que requieren autenticación
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

  // Si la ruta es privada y NO hay usuario autenticado
  if (isPrivateRoute(req) && !userId) {
    // Redirigir a sign-in
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Si está autenticado en una ruta pública (sign-in, sign-up)
  // Redirigir a ventas después del login
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/auth/redirect', req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
};