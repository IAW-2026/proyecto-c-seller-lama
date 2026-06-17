import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

export type ApiRole = 'vendedor' | 'super_admin';
export type InternalServiceName =
  | 'buyer'
  | 'shipping'
  | 'payments'
  | 'control-plane'
  | 'analytics';

export type ApiAuthResult =
  | {
      ok: true;
      userId: string;
      roles: ApiRole[];
    }
  | {
      ok: false;
      response: NextResponse;
    };

type JsonError = {
  error: string;
};

const serviceApiKeyEnvVars: Record<InternalServiceName, string> = {
  buyer: 'BUYER_API_KEY',
  shipping: 'SHIPPING_API_KEY',
  payments: 'PAYMENTS_API_KEY',
  'control-plane': 'CONTROL_PLANE_API_KEY',
  analytics: 'ANALYTICS_API_KEY',
};

const internalServiceNames = new Set<InternalServiceName>(
  Object.keys(serviceApiKeyEnvVars) as InternalServiceName[]
);

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

const normalizeInternalServiceName = (
  serviceName: string | null
): InternalServiceName | null => {
  const normalized = serviceName?.trim().toLowerCase();

  if (!normalized) return null;
  if (!internalServiceNames.has(normalized as InternalServiceName)) return null;

  return normalized as InternalServiceName;
};

const hashApiKey = (apiKey: string) =>
  createHash('sha256').update(apiKey).digest();

const safeCompareApiKeys = (receivedApiKey: string, expectedApiKey: string) =>
  timingSafeEqual(hashApiKey(receivedApiKey), hashApiKey(expectedApiKey));

const getBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader) return null;

  const [scheme, ...tokenParts] = authorizationHeader.trim().split(/\s+/);
  const token = tokenParts.join(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  return token;
};

const getReceivedApiKey = (request: NextRequest | Request) =>
  request.headers.get('x-api-key') ||
  request.headers.get('x-internal-api-key') ||
  getBearerToken(request.headers.get('authorization'));

const getConfiguredServiceKeys = (
  services: readonly InternalServiceName[] = Object.keys(
    serviceApiKeyEnvVars
  ) as InternalServiceName[]
) =>
  services
    .map((serviceName) => ({
      serviceName,
      apiKey: process.env[serviceApiKeyEnvVars[serviceName]],
    }))
    .filter(
      (service): service is {
        serviceName: InternalServiceName;
        apiKey: string;
      } => Boolean(service.apiKey)
    );

export function requireServiceApiKey(
  request: NextRequest | Request,
  allowedServices: readonly InternalServiceName[]
) {
  const receivedApiKey = getReceivedApiKey(request);
  const rawServiceName = request.headers.get('x-service-name');
  const serviceName = normalizeInternalServiceName(rawServiceName);

  if (!receivedApiKey) {
    return jsonError('No autorizado', 401);
  }

  if (rawServiceName && !serviceName) {
    return jsonError('No autorizado', 401);
  }

  if (serviceName) {
    if (!allowedServices.includes(serviceName)) {
      return jsonError('Servicio no autorizado', 403);
    }

    const envVarName = serviceApiKeyEnvVars[serviceName];
    const expectedApiKey = process.env[envVarName];

    if (!expectedApiKey) {
      console.error(`${envVarName} no configurada`);
      return jsonError('Configuracion de API interna no disponible', 500);
    }

    if (!safeCompareApiKeys(receivedApiKey, expectedApiKey)) {
      return jsonError('No autorizado', 401);
    }

    return null;
  }

  const configuredAllowedServices = getConfiguredServiceKeys(allowedServices);

  if (configuredAllowedServices.length === 0) {
    console.error(
      `Ninguna API key interna configurada para: ${allowedServices.join(', ')}`
    );
    return jsonError('Configuracion de API interna no disponible', 500);
  }

  const matchedAllowedService = configuredAllowedServices.find((service) =>
    safeCompareApiKeys(receivedApiKey, service.apiKey)
  );

  if (matchedAllowedService) {
    return null;
  }

  const matchedKnownService = getConfiguredServiceKeys().find((service) =>
    safeCompareApiKeys(receivedApiKey, service.apiKey)
  );

  if (matchedKnownService) {
    return jsonError('Servicio no autorizado', 403);
  }

  return jsonError('No autorizado', 401);
}

export function requireInternalApiKey(request: NextRequest | Request) {
  const receivedApiKey = request.headers.get('x-api-key');

  if (!receivedApiKey) {
    return jsonError('No autorizado', 401);
  }

  const expectedApiKey = process.env.CONTROL_PLANE_API_KEY;

  if (!expectedApiKey) {
    console.error('CONTROL_PLANE_API_KEY no configurada');
    return jsonError('Configuracion de API interna no disponible', 500);
  }

  if (!safeCompareApiKeys(receivedApiKey, expectedApiKey)) {
    return jsonError('No autorizado', 401);
  }

  return null;
}

export function isControlPlaneApiKey(request: NextRequest | Request) {
  const receivedApiKey = request.headers.get('x-api-key');
  const expectedApiKey = process.env.CONTROL_PLANE_API_KEY;

  if (!receivedApiKey || !expectedApiKey) return false;

  return safeCompareApiKeys(receivedApiKey, expectedApiKey);
}
