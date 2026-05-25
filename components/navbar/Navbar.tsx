'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? user.publicMetadata.roles
    : [];
  const isSuperAdmin = roles.includes('super_admin');
  const isVendedor = roles.includes('vendedor');
  const isLanding = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Compact on internal pages, tall on landing
  const navHeight = isLanding ? 'h-16 md:h-[72px]' : 'h-14 md:h-[56px]';
  const logoSize = isLanding ? 'text-2xl' : 'text-xl';

  const navBg = isLanding && !scrolled
    ? 'bg-transparent'
    : 'bg-[#8fa18d]/95 backdrop-blur-xl shadow-lg shadow-black/5';

  const navLink = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`
          relative px-3.5 py-1.5 rounded-lg text-[13px] font-medium tracking-wide
          transition-all duration-300
          ${active
            ? 'bg-white/20 text-white shadow-inner'
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500 ease-out
        ${navBg}
      `}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
        <div className={`flex items-center justify-between ${navHeight} transition-all duration-500`}>
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
          >
            <span className={`${logoSize} font-bold tracking-[0.15em] text-white transition-all duration-500 hover:opacity-80`}>
              LAMA
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 border border-white/20 rounded px-1.5 py-0.5">
              Seller
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {isSignedIn && isSuperAdmin && (
              navLink('/admin', 'Admin')
            )}
            {isSignedIn && !isSuperAdmin && isVendedor && (
              <>
                {navLink('/ventas', 'Ventas')}
                {navLink('/productos', 'Productos')}
              </>
            )}
          </nav>

          {/* Right side: auth buttons + user button */}
          <div className="flex items-center gap-3">
            {!isSignedIn && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="px-5 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2 rounded-full text-sm font-semibold bg-white text-[#37413d] hover:bg-white/90 transition-all duration-300 shadow-lg shadow-black/10"
                >
                  Crear cuenta
                </Link>
              </div>
            )}

            {isSignedIn && <UserButton />}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              aria-label="Menú"
            >
              <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-400 ease-out
          ${mobileOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'}
          bg-[#8fa18d]/98 backdrop-blur-xl
        `}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {isSignedIn && isSuperAdmin && (
            <Link
              href="/admin"
              className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Admin
            </Link>
          )}
          {isSignedIn && !isSuperAdmin && isVendedor && (
            <>
              <Link href="/ventas" className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Ventas
              </Link>
              <Link href="/productos" className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Productos
              </Link>
            </>
          )}
          {!isSignedIn && (
            <>
              <Link href="/sign-in" className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/sign-up" className="px-4 py-3 rounded-lg text-sm font-semibold bg-white text-[#37413d] text-center hover:bg-white/90 transition-colors">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
