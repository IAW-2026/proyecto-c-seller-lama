import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getUserRolesById, isSuperAdmin } from '@/lib/auth/roles';

export default async function AuthRedirectPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const roles = await getUserRolesById(userId);

  if (isSuperAdmin(roles)) {
    redirect('/admin');
  }

  if (roles.includes('vendedor')) {
    redirect('/ventas');
  }

  redirect('/sign-in');
}
