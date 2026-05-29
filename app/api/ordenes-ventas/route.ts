import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { OrdenConItems } from '@/types';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

type OrdenItemInput = {
  producto_id: string;
  precio_unitario: number;
};

type OrdenCreateInput = {
  orden_id: string;
  comprador_id: string;
  items: OrdenItemInput[];
  precio_total: number;
  direccion_envio: string;
};

type ProductoOrden = {
  producto_id: string;
  clerk_user_id: string;
  estado_publicacion: string;
};

const isValidItem = (value: OrdenItemInput) =>
  isNonEmptyString(value.producto_id) &&
  isNumber(value.precio_unitario) &&
  value.precio_unitario >= 0;

const ordenSelect = `
  *,
  orden_item (
    orden_item_id,
    orden_id,
    producto_id,
    precio_unitario,
    fecha_creacion,
    producto:producto_id (
      titulo,
      clerk_user_id
    )
  )
`;

/*
Endpoint para crear una nueva orden de venta 
*/
export async function POST(request: NextRequest) {
  const { data, error } = await parseJson<OrdenCreateInput>(request);

  if (error) return error;
  if (!data) return jsonError('Body requerido', 400);

  const { orden_id, comprador_id, items, precio_total, direccion_envio } = data;

  if (!isNonEmptyString(orden_id)) return jsonError('orden_id es requerido', 400);

  if (!isNonEmptyString(comprador_id)) return jsonError('comprador_id es requerido', 400);

  if (!Array.isArray(items) || items.length === 0) {
    return jsonError('items debe tener al menos un elemento', 400);
  }

  if (!items.every(isValidItem)) {
    return jsonError('items contiene elementos inválidos', 400);
  }

  if (!isNumber(precio_total) || precio_total < 0) {
    return jsonError('precio_total es requerido', 400);
  }

  if (!isNonEmptyString(direccion_envio)) {
    return jsonError('direccion_envio es requerido', 400);
  }

  const productIds = items.map((item) => item.producto_id);
  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    return jsonError('No se puede repetir el mismo producto en una orden', 400);
  }

  const calculatedTotal = items.reduce((sum, item) => sum + item.precio_unitario, 0);

  if (calculatedTotal !== precio_total) {
    return jsonError('precio_total no coincide con la suma de los items', 400);
  }

  const { data: productos, error: productosError } = await supabase
    .from('producto')
    .select('producto_id, clerk_user_id, estado_publicacion')
    .in('producto_id', productIds);

  if (productosError) {
    return jsonError(productosError.message, 500);
  }

  const productosEncontrados = (productos || []) as ProductoOrden[];

  if (productosEncontrados.length !== productIds.length) {
    return jsonError('Uno o más productos no existen', 400);
  }

  const vendedores = new Set(
    productosEncontrados.map((producto) => producto.clerk_user_id)
  );

  if (vendedores.size !== 1) {
    return jsonError(
      'Todos los productos de una orden deben pertenecer al mismo vendedor',
      400
    );
  }

  const productosNoActivos = productosEncontrados.filter(
    (producto) => producto.estado_publicacion !== 'activa'
  );

  if (productosNoActivos.length > 0) {
    return jsonError(
      'Uno o más productos no están disponibles para la venta',
      400
    );
  }

  const now = new Date().toISOString();
  const vendedorId = productosEncontrados[0]?.clerk_user_id;

  const { data: createdOrden, error: insertOrdenError } = await supabase
  .from('orden')
  .insert({
    nro_orden: orden_id,
    clerk_user_id: comprador_id,
    total: precio_total,
    estado_general: ESTADO_GENERAL.PENDIENTE_PAGO,
    estado_pago: ESTADO_PAGO.PENDIENTE,
    estado_envio: ESTADO_ENVIO.PENDIENTE,
    direccion_envio,
    fecha_creacion: now,
    fecha_actualizacion: now,
  })
  .select('orden_id, estado_general, estado_pago, estado_envio, fecha_creacion')
  .single();

  if (insertOrdenError) {
    return jsonError(insertOrdenError.message, 500);
  }

  const ordenItems = items.map((item) => ({
    orden_id,
    producto_id: item.producto_id,
    precio_unitario: item.precio_unitario,
    fecha_creacion: now,
  }));

  const { error: insertItemsError } = await supabase
    .from('orden_item')
    .insert(ordenItems);

  if (insertItemsError) {
    await supabase.from('orden').delete().eq('orden_id', orden_id);
    return jsonError(insertItemsError.message, 500);
  }

  const { error: updateProductosError } = await supabase
    .from('producto')
    .update({ estado_publicacion: 'vendida' })
    .in('producto_id', productIds);

  if (updateProductosError) {
    await supabase.from('orden_item').delete().eq('orden_id', orden_id);
    await supabase.from('orden').delete().eq('orden_id', orden_id);
    return jsonError(updateProductosError.message, 500);
  }

  return NextResponse.json(createdOrden, { status: 201 });
}
