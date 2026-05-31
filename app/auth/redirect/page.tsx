'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [roleAttempts, setRoleAttempts] = useState(0);

  useEffect(() => {
    // Esperar que Clerk haya cargado completamente la sesión en el cliente
    if (!isLoaded) return;

    if (!user) {
      router.replace('/sign-in');
      return;
    }

    const roles = (user.publicMetadata?.roles as string[]) || [];

    if (roles.includes('super_admin')) {
      router.replace('/admin');
    } else if (roles.includes('vendedor')) {
      router.replace('/ventas');
    } else {
      if (roleAttempts < 5) {
        const timeoutId = setTimeout(async () => {
          await user.reload();
          setRoleAttempts((attempts) => attempts + 1);
        }, 800);

        return () => clearTimeout(timeoutId);
      }

      router.replace('/ventas');
    }
  }, [isLoaded, user, router, roleAttempts]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f1e7]">
      <div
        className="
        flex flex-col items-center gap-4
        rounded-2xl border border-[#d8cfbd]
        bg-[#ede6d8] px-8 py-7
        shadow-sm
    "
      >
        <div
          className="
          h-10 w-10 animate-spin rounded-full
          border-4 border-[#c7bda9]
          border-t-[#8fa18d]
        "
        />

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-semibold text-[#37413d]">
            Redirigiendo...
          </p>
        </div>
      </div>
    </div>
  );
}