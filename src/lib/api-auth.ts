import 'server-only';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

export type ApiRole = 'vendedor' | 'super_admin';

export type ApiAuthResult = {
  ok: true;
  userId: string;
  roles: ApiRole[];
} | {
  ok: false;
  response: NextResponse;
};

type JsonError = {
  error: string;
};

const normalizeRoles = (roles: unknown): ApiRole[] => {
  if (typeof roles === 'string') {
    return roles === 'vendedor' || roles === 'super_admin' ? [roles] : [];
  }

  if (!Array.isArray(roles)) return [];

  return roles.filter(
    (role): role is ApiRole => role === 'vendedor' || role === 'super_admin'
  );
};

const getUserRolesById = async (userId: string): Promise<ApiRole[]> => {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return normalizeRoles(user.publicMetadata?.roles);
};

export const jsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message } satisfies JsonError, { status });

export async function requireAuthUser(): Promise<ApiAuthResult> {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, response: jsonError('No autenticado', 401) };
  }

  try {
    const roles = await getUserRolesById(userId);

    return { ok: true, userId, roles };
  } catch (error) {
    console.error('Error al obtener roles de Clerk', error);
    return {
      ok: false,
      response: jsonError('No se pudo validar la autorizacion', 500),
    };
  }
}

export async function requireRole(role: ApiRole): Promise<ApiAuthResult> {
  const authResult = await requireAuthUser();

  if (!authResult.ok) return authResult;

  if (!authResult.roles.includes(role)) {
    return { ok: false, response: jsonError('No autorizado', 403) };
  }

  return authResult;
}

export const requireVendedor = () => requireRole('vendedor');

export const requireSuperAdmin = () => requireRole('super_admin');

export function requireInternalApiKey(request: NextRequest | Request) {
  const expectedApiKey = process.env.INTERNAL_API_KEY;

  if (!expectedApiKey) {
    console.error('INTERNAL_API_KEY no configurada');
    return jsonError('Configuracion de API interna no disponible', 500);
  }

  const receivedApiKey = request.headers.get('x-api-key');

  if (!receivedApiKey || receivedApiKey !== expectedApiKey) {
    return jsonError('No autorizado', 401);
  }

  return null;
}
