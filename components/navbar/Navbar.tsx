'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { PageContainer } from '@/components/ui/PageContainer';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const roles = Array.isArray(user?.publicMetadata?.roles)
    ? user.publicMetadata.roles
    : [];
  const isSuperAdmin = roles.includes('super_admin');
  const isVendedor = roles.includes('vendedor');

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
            {isSignedIn && isSuperAdmin && (
              <span className="px-4 py-2 rounded-lg text-sm font-medium bg-[#6f7f6d] text-white shadow-md cursor-default">
                Admin
              </span>
            )}
            {isSignedIn && !isSuperAdmin && isVendedor && (
              <>
                <Link 
                  href="/ventas" 
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    hover:bg-[#7a8c78] hover:text-white hover:shadow-md
                    ${
                      pathname.startsWith('/ventas')
                        ? 'bg-[#6f7f6d] text-white shadow-md'
                        : 'text-[#f6f1e7]'
                    }
                  `}
                >
                  Ventas
                </Link>
                <Link 
                  href="/productos" 
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    hover:bg-[#7a8c78] hover:text-white hover:shadow-md
                    ${
                      pathname.startsWith('/productos')
                        ? 'bg-[#6f7f6d] text-white shadow-md'
                        : 'text-[#f6f1e7]'
                    }
                  `}
                >
                  Productos
                </Link>
              </>
            )}
          </nav>

          {/* User Button */}
          {isSignedIn && <UserButton />}
        </div>
      </PageContainer>
    </header>
  );
}
