import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { OrdenConItems } from '@/types';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

type OrdenItemInput = {
  producto_id: string;
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

export async function POST(request: NextRequest) {
  const { data, error } = await parseJson<OrdenCreateInput>(request);

  if (error) return error;
  if (!data) return jsonError('Body requerido', 400);

  const { orden_id, clerk_user_id, items, precio_total, pago_id, direccion_envio } = data;

  if (!isNonEmptyString(orden_id)) return jsonError('orden_id es requerido', 400);

  if (!isNonEmptyString(clerk_user_id)) return jsonError('clerk_user_id es requerido', 400);

  if (!Array.isArray(items) || items.length === 0) {
    return jsonError('items debe tener al menos un elemento', 400);
  }

  if (!items.every(isValidItem)) {
    return jsonError('items contiene elementos inválidos', 400);
  }

  if (!isNumber(precio_total) || precio_total < 0) {
    return jsonError('precio_total es requerido', 400);
  }

  if (!isNonEmptyString(pago_id)) return jsonError('pago_id es requerido', 400);
  
  if (!isNonEmptyString(direccion_envio)) {
    return jsonError('direccion_envio es requerido', 400);
  }

  const productIds = items.map((item) => item.producto_id);
  const uniqueProductIds = new Set(productIds);

  if (uniqueProductIds.size !== productIds.length) {
    return jsonError('No se puede repetir el mismo producto en una orden', 400);
  }

  const calculatedTotal = items.reduce(
    (sum, item) => sum + item.precio_unitario,
    0
  );

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

  const { data: createdOrden, error: insertOrdenError } = await supabase
    .from('orden')
    .insert({
      orden_id,
      nro_orden: orden_id,
      clerk_user_id,
      total: precio_total,
      pago_id,
      estado_pago: 'aprobado',
      estado_envio: 'pendiente',
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
    return jsonError(insertItemsError.message, 500);
  }

  const { error: updateProductosError } = await supabase
    .from('producto')
    .update({ estado_publicacion: 'vendida' })
    .in('producto_id', productIds);

  if (updateProductosError) {
    return jsonError(updateProductosError.message, 500);
  }

  const { data: ordenCompleta, error: fetchError } = await supabase
    .from('orden')
    .select(ordenSelect)
    .eq('orden_id', orden_id)
    .single();

  if (fetchError || !ordenCompleta) {
    return jsonError(fetchError?.message || 'No se pudo cargar la orden creada', 500);
  }

  return NextResponse.json(ordenCompleta, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { data: ordenes, error } = await supabase
    .from('orden')
    .select(ordenSelect);

  if (error) {
    return jsonError(error.message, 500);
  }

  return NextResponse.json((ordenes || []) as OrdenConItems[], { status: 200 });
}