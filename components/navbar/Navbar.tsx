'use client';

import { Show, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';

export function Navbar() {
  return (
    <header className="bg-[#8fa18d] border-b border-[#6f7f6d]/20 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <PageContainer>
        <div className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="group text-lg font-semibold text-[#f6f1e7] transition-opacity hover:opacity-80"
          >
            LAMA
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8">
            <Show when="signed-in">
              <Link 
                href="/dashboard" 
                className="text-[#f6f1e7] text-sm font-medium hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/productos" 
                className="text-[#f6f1e7] text-sm font-medium hover:text-white transition-colors"
              >
                Productos
              </Link>
              <Link 
                href="/ventas" 
                className="text-[#f6f1e7] text-sm font-medium hover:text-white transition-colors"
              >
                Ventas
              </Link>
            </Show>
          </nav>

          {/* User Button */}
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </PageContainer>
    </header>
  );
}
