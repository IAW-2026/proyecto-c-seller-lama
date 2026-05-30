import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { OrdenConItems } from '@/types';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

const DEFAULT_PAGE_SIZE = 10;

type OrdenItemRecord = {
  producto_id: string;
  precio_unitario: number;
};

type OrdenRecord = {
  nro_orden: string;
  clerk_user_id: string;
  total: number;
  direccion_envio: string;
  estado_general: string;
  estado_pago: string;
  estado_envio: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  orden_item: OrdenItemRecord[] | null;
};

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const mapOrdenResponse = (orden: OrdenRecord) => {
  const items = (orden.orden_item || []).map((item) => ({
    producto_id: item.producto_id,
    precio_unitario: item.precio_unitario,
  }));

  return {
    orden_id: orden.nro_orden,
    comprador_id: orden.clerk_user_id,
    items,
    producto_ids: items.map((item) => item.producto_id),
    total: orden.total,
    direccion_envio: orden.direccion_envio,
    estado_general: orden.estado_general,
    estado_pago: orden.estado_pago,
    estado_envio: orden.estado_envio,
    fecha_creacion: orden.fecha_creacion,
    fecha_actualizacion: orden.fecha_actualizacion,
  };
};

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

const ordenListSelect = `
  nro_orden,
  clerk_user_id,
  total,
  estado_general,
  estado_pago,
  estado_envio,
  direccion_envio,
  fecha_creacion,
  fecha_actualizacion,
  orden_item (
    producto_id,
    precio_unitario
  )
`;

/*
Endpoint para listar ordenes de venta de un comprador
*/
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const comprador_id = searchParams.get('comprador_id');

  if (!isNonEmptyString(comprador_id)) {
    return jsonError('comprador_id es requerido', 400);
  }

  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(
    searchParams.get('pageSize'),
    DEFAULT_PAGE_SIZE
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('orden')
    .select(ordenListSelect, { count: 'exact' })
    .eq('clerk_user_id', comprador_id)
    .order('fecha_creacion', { ascending: false })
    .range(from, to);

  if (error) {
    return jsonError(error.message, 500);
  }

  const items = (data || []).map((orden) =>
    mapOrdenResponse(orden as OrdenRecord)
  );

  return NextResponse.json(
    {
      items,
      total: count || 0,
      page,
      pageSize,
    },
    { status: 200 }
  );
}

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
    orden_id: createdOrden.orden_id,
    producto_id: item.producto_id,
    precio_unitario: item.precio_unitario,
    fecha_creacion: now,
  }));

  const { error: insertItemsError } = await supabase
    .from('orden_item')
    .insert(ordenItems);

  if (insertItemsError) {
    await supabase.from('orden').delete().eq('orden_id', createdOrden.orden_id);
    return jsonError(insertItemsError.message, 500);
  }

  const { error: updateProductosError } = await supabase
    .from('producto')
    .update({ estado_publicacion: 'vendida' })
    .in('producto_id', productIds);

  if (updateProductosError) {
    await supabase.from('orden_item').delete().eq('orden_id', createdOrden.orden_id);
    await supabase.from('orden').delete().eq('orden_id', createdOrden.orden_id);
    return jsonError(updateProductosError.message, 500);
  }

  return NextResponse.json(createdOrden, { status: 201 });
}
