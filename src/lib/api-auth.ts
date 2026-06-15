import 'server-only';

import { auth, clerkClient, verifyToken } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

export type ApiRole = 'vendedor' | 'super_admin';

type ApiAuthFailure = {
  ok: false;
  response: NextResponse;
};

type HumanAuthSuccess = {
  ok: true;
  userId: string;
  roles: ApiRole[];
};

type ClerkJwtPayload = Awaited<ReturnType<typeof verifyToken>>;

export const M2M_MACHINE_NAMES = [
  'buyer',
  'shipping',
  'payments',
  'control_plane',
  'analytics',
] as const;

export type M2MMachineName = (typeof M2M_MACHINE_NAMES)[number];
export type M2MAllowedMachine = M2MMachineName | string;

type M2MAuthSuccess = {
  ok: true;
  machineId: string;
  machineName: M2MMachineName | null;
  claims: ClerkJwtPayload;
};

export type ApiAuthResult = HumanAuthSuccess | ApiAuthFailure;
export type M2MAuthResult = M2MAuthSuccess | ApiAuthFailure;

export type HumanOrM2MAuthResult =
  | (HumanAuthSuccess & { authType: 'human' })
  | (M2MAuthSuccess & { authType: 'm2m' })
  | ApiAuthFailure;

type RequireHumanOrM2MOptions = {
  roles?: ApiRole | ApiRole[];
  allowedMachines?: readonly M2MAllowedMachine[];
};

type JsonError = {
  error: string;
};

const M2M_SUBJECT_PREFIX = 'mch_';

const machineEnvByName: Record<M2MMachineName, string> = {
  buyer: 'CLERK_M2M_BUYER_MACHINE_ID',
  shipping: 'CLERK_M2M_SHIPPING_MACHINE_ID',
  payments: 'CLERK_M2M_PAYMENTS_MACHINE_ID',
  control_plane: 'CLERK_M2M_CONTROL_PLANE_MACHINE_ID',
  analytics: 'CLERK_M2M_ANALYTICS_MACHINE_ID',
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

const parseCsv = (value: string | undefined) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizePemValue = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.replace(/\\n/g, '\n') : undefined;
};

const getBearerToken = (request: NextRequest | Request) => {
  const authorization = request.headers.get('authorization');

  if (!authorization) {
    return { ok: false, response: jsonError('No autenticado', 401) } as const;
  }

  const [scheme, token, ...rest] = authorization.trim().split(/\s+/);

  if (scheme?.toLowerCase() !== 'bearer' || !token || rest.length > 0) {
    return { ok: false, response: jsonError('No autorizado', 401) } as const;
  }

  return { ok: true, token } as const;
};

const getVerifyTokenOptions = () => {
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  const jwtKey = normalizePemValue(process.env.CLERK_JWT_KEY);
  const authorizedParties = parseCsv(process.env.CLERK_AUTHORIZED_PARTIES);

  if (!secretKey && !jwtKey) {
    console.error('CLERK_SECRET_KEY o CLERK_JWT_KEY no configurada');
    return {
      ok: false,
      response: jsonError('Configuracion de autenticacion no disponible', 500),
    } as const;
  }

  return {
    ok: true,
    options: {
      ...(secretKey ? { secretKey } : {}),
      ...(jwtKey ? { jwtKey } : {}),
      ...(authorizedParties.length > 0 ? { authorizedParties } : {}),
    } satisfies Parameters<typeof verifyToken>[1],
  } as const;
};

const isKnownMachineName = (value: string): value is M2MMachineName =>
  M2M_MACHINE_NAMES.includes(value as M2MMachineName);

const getConfiguredMachineId = (machineName: M2MMachineName) => {
  const value = process.env[machineEnvByName[machineName]]?.trim();
  return value || null;
};

const getMachineNameById = (machineId: string): M2MMachineName | null => {
  for (const machineName of M2M_MACHINE_NAMES) {
    if (getConfiguredMachineId(machineName) === machineId) {
      return machineName;
    }
  }

  return null;
};

const resolveAllowedMachineIds = (
  allowedMachines: readonly M2MAllowedMachine[]
) => {
  const ids = new Set<string>();
  const missingMachineConfig: M2MMachineName[] = [];

  for (const machine of allowedMachines) {
    const machineValue = machine.trim();
    if (!machineValue) continue;

    if (isKnownMachineName(machineValue)) {
      const configuredId = getConfiguredMachineId(machineValue);

      if (!configuredId) {
        missingMachineConfig.push(machineValue);
        continue;
      }

      ids.add(configuredId);
      continue;
    }

    ids.add(machineValue);
  }

  if (missingMachineConfig.length > 0) {
    console.error('Faltan machine IDs de Clerk M2M', missingMachineConfig);
    return {
      ok: false,
      response: jsonError('Configuracion de M2M no disponible', 500),
    } as const;
  }

  return { ok: true, ids } as const;
};

const normalizeRequiredRoles = (roles: ApiRole | ApiRole[] | undefined) => {
  if (!roles) return [];
  return Array.isArray(roles) ? roles : [roles];
};

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

export async function requireM2M(
  request: NextRequest | Request
): Promise<M2MAuthResult> {
  const bearer = getBearerToken(request);
  if (!bearer.ok) return bearer;

  const verifyOptions = getVerifyTokenOptions();
  if (!verifyOptions.ok) return verifyOptions;

  try {
    const claims = await verifyToken(bearer.token, verifyOptions.options);
    const machineId = typeof claims.sub === 'string' ? claims.sub : null;

    if (!machineId || !machineId.startsWith(M2M_SUBJECT_PREFIX)) {
      return { ok: false, response: jsonError('No autorizado', 403) };
    }

    return {
      ok: true,
      machineId,
      machineName: getMachineNameById(machineId),
      claims,
    };
  } catch (error) {
    console.error('Error al validar Clerk M2M JWT', error);
    return { ok: false, response: jsonError('No autorizado', 401) };
  }
}

export async function requireM2MFrom(
  request: NextRequest | Request,
  allowedMachines: readonly M2MAllowedMachine[]
): Promise<M2MAuthResult> {
  const authResult = await requireM2M(request);
  if (!authResult.ok) return authResult;

  const allowedMachineIds = resolveAllowedMachineIds(allowedMachines);
  if (!allowedMachineIds.ok) return allowedMachineIds;

  if (!allowedMachineIds.ids.has(authResult.machineId)) {
    return { ok: false, response: jsonError('No autorizado', 403) };
  }

  return authResult;
}

export async function requireHumanOrM2M(
  request: NextRequest | Request,
  options: RequireHumanOrM2MOptions = {}
): Promise<HumanOrM2MAuthResult> {
  if (request.headers.has('authorization')) {
    const m2mResult = options.allowedMachines
      ? await requireM2MFrom(request, options.allowedMachines)
      : await requireM2M(request);

    if (!m2mResult.ok) return m2mResult;

    return { ...m2mResult, authType: 'm2m' };
  }

  const humanResult = await requireAuthUser();
  if (!humanResult.ok) return humanResult;

  const requiredRoles = normalizeRequiredRoles(options.roles);

  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some((role) => humanResult.roles.includes(role))
  ) {
    return { ok: false, response: jsonError('No autorizado', 403) };
  }

  return { ...humanResult, authType: 'human' };
}
