import 'server-only';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export type UserRole = 'vendedor' | 'super_admin';

const normalizeRoles = (roles: unknown): UserRole[] => {
  if (!Array.isArray(roles)) return [];

  return roles.filter(
    (role): role is UserRole => role === 'vendedor' || role === 'super_admin'
  );
};

export async function getUserRolesById(userId: string): Promise<UserRole[]> {
  const client = await clerkClient();

  const user = await client.users.getUser(userId);


  return normalizeRoles(user.publicMetadata?.roles);
}

export async function getCurrentUserRoles(): Promise<UserRole[]> {
  const { userId } = await auth();

  if (!userId) return [];

  return getUserRolesById(userId);
}

export function isSuperAdmin(roles: UserRole[] | null | undefined): boolean {
  return Boolean(roles?.includes('super_admin'));
}

export async function requireSuperAdmin(): Promise<{ userId: string; roles: UserRole[] }> {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const roles = await getUserRolesById(userId);

  if (!isSuperAdmin(roles)) {
    redirect('/ventas');
  }

  return { userId, roles };
}
