import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireServiceApiKey } from '@/lib/api-auth';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

const DEFAULT_PAGE_SIZE = 10;

type OrdenItemRecord = {
  producto_id: string;
  precio_unitario: number;
  producto?: ProductoOrdenRecord | ProductoOrdenRecord[] | null;
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

type ProductoOrdenRecord = {
  clerk_user_id: string;
  titulo?: string | null;
  imagenes?: string[] | null;
};

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeString = (value: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const getProductoData = (producto: OrdenItemRecord['producto']) =>
  Array.isArray(producto) ? producto[0] : producto;

const mapOrdenResponse = (orden: OrdenRecord) => {
  const vendedorId = (orden.orden_item || []).reduce<string | null>(
    (current, item) => {
      if (current) return current;
      return getProductoData(item.producto)?.clerk_user_id ?? null;
    },
    null
  );

  const items = (orden.orden_item || []).map((item) => {
    const producto = getProductoData(item.producto);

    return {
      producto_id: item.producto_id,
      precio_unitario: item.precio_unitario,
      titulo: producto?.titulo ?? null,
      imagenes: producto?.imagenes ?? [],
    };
  });

  return {
    orden_id: orden.nro_orden,
    comprador_id: orden.clerk_user_id,
    vendedor_id: vendedorId,
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

const buildOrdenListSelect = (filterByVendedor: boolean) => `
  nro_orden,
  clerk_user_id,
  total,
  estado_general,
  estado_pago,
  estado_envio,
  direccion_envio,
  fecha_creacion,
  fecha_actualizacion,
  orden_item${filterByVendedor ? '!inner' : ''} (
    producto_id,
    precio_unitario,
    producto${filterByVendedor ? '!inner' : ''} (
      clerk_user_id,
      titulo,
      imagenes
    )
  )
`;

/*
Endpoint para listar ordenes de venta
*/
export async function GET(request: NextRequest) {
  const authError = requireServiceApiKey(request, [
    'buyer',
    'control-plane',
    'analytics',
  ]);
  if (authError) return authError;

  const { searchParams } = request.nextUrl;
  const compradorId = normalizeString(searchParams.get('comprador_id'));
  const vendedorId = normalizeString(searchParams.get('vendedor_id'));
  const estadoGeneral = normalizeString(searchParams.get('estado_general'));
  const estadoPago = normalizeString(searchParams.get('estado_pago'));
  const estadoEnvio = normalizeString(searchParams.get('estado_envio'));

  const page = parsePositiveInt(searchParams.get('page'), 1);
  const pageSize = parsePositiveInt(
    searchParams.get('pageSize'),
    DEFAULT_PAGE_SIZE
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('orden')
    .select(buildOrdenListSelect(Boolean(vendedorId)), { count: 'exact' });

  if (compradorId) {
    query = query.eq('clerk_user_id', compradorId);
  }

  if (vendedorId) {
    query = query.eq('orden_item.producto.clerk_user_id', vendedorId);
  }

  if (estadoGeneral) {
    query = query.eq('estado_general', estadoGeneral);
  }

  if (estadoPago) {
    query = query.eq('estado_pago', estadoPago);
  }

  if (estadoEnvio) {
    query = query.eq('estado_envio', estadoEnvio);
  }

  const { data, error, count } = await query
    .order('fecha_creacion', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error al listar ordenes de venta', error);
    return jsonError('No se pudieron obtener las ordenes', 500);
  }

  const ordenes = (data || []) as unknown as OrdenRecord[];
  const items = ordenes.map(mapOrdenResponse);

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
  const authError = requireServiceApiKey(request, ['buyer']);
  if (authError) return authError;

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
    console.error('Error al consultar productos para orden', productosError);
    return jsonError('No se pudo validar la orden', 500);
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
  .select('orden_id, nro_orden, estado_general, estado_pago, estado_envio, fecha_creacion')  
  .single();

  if (insertOrdenError) {
    console.error('Error al crear orden', insertOrdenError);
    return jsonError('No se pudo crear la orden', 500);
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
    console.error('Error al crear items de orden', insertItemsError);
    return jsonError('No se pudo crear la orden', 500);
  }

  const { error: updateProductosError } = await supabase
    .from('producto')
    .update({ estado_publicacion: 'vendida' })
    .in('producto_id', productIds);

  if (updateProductosError) {
    await supabase.from('orden_item').delete().eq('orden_id', createdOrden.orden_id);
    await supabase.from('orden').delete().eq('orden_id', createdOrden.orden_id);
    console.error('Error al marcar productos como vendidos', updateProductosError);
    return jsonError('No se pudo crear la orden', 500);
  }

  return NextResponse.json(
  {
    orden_id: createdOrden.nro_orden,
    estado_general: createdOrden.estado_general,
    estado_pago: createdOrden.estado_pago,
    estado_envio: createdOrden.estado_envio,
    fecha_creacion: createdOrden.fecha_creacion,
  },
  { status: 201 }
);
}
