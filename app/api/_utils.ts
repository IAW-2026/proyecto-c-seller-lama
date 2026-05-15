import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type JsonError = {
  error: string;
};

export const jsonError = (message: string, status = 400) =>
  NextResponse.json({ error: message } satisfies JsonError, { status });

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

const liquidacionValues = ['pendiente', 'pagada'] as const;

export type EstadoEnvio = (typeof estadoEnvioValues)[number];
export type EstadoPago = (typeof estadoPagoValues)[number];
export type EstadoLiquidacion = (typeof liquidacionValues)[number];

export const isEstadoEnvio = (value: unknown): value is EstadoEnvio =>
  isNonEmptyString(value) && estadoEnvioValues.includes(value as EstadoEnvio);

export const isEstadoPago = (value: unknown): value is EstadoPago =>
  isNonEmptyString(value) && estadoPagoValues.includes(value as EstadoPago);

export const isEstadoLiquidacion = (value: unknown): value is EstadoLiquidacion =>
  isNonEmptyString(value) && liquidacionValues.includes(value as EstadoLiquidacion);
