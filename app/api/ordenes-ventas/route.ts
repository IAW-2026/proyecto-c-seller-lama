import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Orden } from '@/types';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

type OrdenItemInput = {
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
};

type OrdenCreateInput = {
  orden_id: string;
  clerk_user_id: string;
  items: OrdenItemInput[];
  precio_total: number;
  pago_id: string;
  direccion_envio: string;
};

const isValidItem = (value: OrdenItemInput) =>
  isNonEmptyString(value.producto_id) &&
  isNumber(value.cantidad) &&
  value.cantidad > 0 &&
  isNumber(value.precio_unitario) &&
  value.precio_unitario >= 0;

/*
Endpoint para crear una nueva orden de venta.
*/
export async function POST(request: NextRequest) {
  const { data, error } = await parseJson<OrdenCreateInput>(request);

  if (error) return error;
  if (!data) return jsonError('Body requerido', 400);

  const {
    orden_id,
    clerk_user_id,
    items,
    precio_total,
    pago_id,
    direccion_envio,
  } = data;

  if (!isNonEmptyString(orden_id)) {
    return jsonError('orden_id es requerido', 400);
  }

  if (!isNonEmptyString(clerk_user_id)) {
    return jsonError('clerk_user_id es requerido', 400);
  }

  if (!Array.isArray(items) || items.length === 0) {
    return jsonError('items debe tener al menos un elemento', 400);
  }

  if (!items.every((item) => isValidItem(item))) {
    return jsonError('items contiene elementos invalidos', 400);
  }

  if (!isNumber(precio_total) || precio_total < 0) {
    return jsonError('precio_total es requerido', 400);
  }

  if (!isNonEmptyString(direccion_envio)) {
    return jsonError('direccion_envio es requerido', 400);
  }

  if (!isNonEmptyString(pago_id)) {
    return jsonError('pago_id es requerido', 400);
  }

  const now = new Date().toISOString();

  const rows = items.map((item) => ({
    orden_id,
    nro_orden: orden_id,
    clerk_user_id,
    producto_id: item.producto_id,
    total: precio_total,
    estado_pago: 'aprobado',
    estado_envio: 'pendiente',
    direccion_envio,
    fecha_creacion: now,
    fecha_actualizacion: now,
  }));

  const { data: created, error: insertError } = await supabase
    .from('orden')
    .insert(rows)
    .select('orden_id, estado_general, estado_pago, estado_envio, fecha_creacion');

  if (insertError) {
    return jsonError(insertError.message, 500);
  }

  const first = created?.[0];
  if (!first) {
    return jsonError('No se pudo crear la orden', 500);
  }

  return NextResponse.json(first, { status: 201 });
}

/*
Endpoint para obtener todas las órdenes de venta.
*/
export async function GET(request: NextRequest) {
  const { data: ordenes, error } = await supabase
    .from('orden')
    .select('*');

  if (error) {
    return jsonError(error.message, 500);
  }

  return NextResponse.json((ordenes || []) as Orden[], { status: 200 });
}
