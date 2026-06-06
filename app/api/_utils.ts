import type { NextRequest } from 'next/server';
import { jsonError } from '@/lib/api-auth';

/*
Sirve para no repetir validaciones y respuestas en todos los route handlers.
*/

export { jsonError };

export const parseJson = async <T>(request: NextRequest) => {
  try {
    const data = (await request.json()) as T;
    return { data, error: null } as const;
  } catch {
    return { data: null, error: jsonError('Invalid JSON body', 400) } as const;
  }
};

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const estadoEnvioValues = [
  'pendiente',
  'en_preparacion',
  'despachado',
  'entregado',
  'cancelado',
] as const;

const estadoPagoValues = ['pendiente', 'aprobado', 'rechazado'] as const;

export type EstadoEnvio = (typeof estadoEnvioValues)[number];
export type EstadoPago = (typeof estadoPagoValues)[number];

export const isEstadoEnvio = (value: unknown): value is EstadoEnvio =>
  isNonEmptyString(value) && estadoEnvioValues.includes(value as EstadoEnvio);

export const isEstadoPago = (value: unknown): value is EstadoPago =>
  isNonEmptyString(value) && estadoPagoValues.includes(value as EstadoPago);
