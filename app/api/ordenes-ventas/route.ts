import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireServiceApiKey } from '@/lib/api-auth';
import { ESTADO_ENVIO, ESTADO_GENERAL, ESTADO_PAGO } from '@/types/orden';
import { isNonEmptyString, isNumber, jsonError, parseJson } from '@/app/api/_utils';

const DEFAULT_PAGE_SIZE = 10;

type OrdenItemRecord = {
  orden_id: string;
  producto_id: string;
  precio_unitario: number;
};

type OrdenRecord = {
  orden_id: string;
  nro_orden: string;
  clerk_user_id: string;
  total: number;
  direccion_envio: string;
  estado_general: string;
  estado_pago: string;
  estado_envio: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
};

type ProductoOrdenRecord = {
  producto_id: string;
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

const mapOrdenResponse = (
  orden: OrdenRecord,
  ordenItemsByOrdenId: Map<string, OrdenItemRecord[]>,
  productosById: Map<string, ProductoOrdenRecord>
) => {
  const ordenItems = ordenItemsByOrdenId.get(orden.orden_id) || [];
  const vendedorId = ordenItems.reduce<string | null>(
    (current, item) => {
      if (current) return current;
      return productosById.get(item.producto_id)?.clerk_user_id ?? null;
    },
    null
  );

  const items = ordenItems.map((item) => {
    const producto = productosById.get(item.producto_id);

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

const ordenListSelect = `
  orden_id,
  nro_orden,
  clerk_user_id,
  total,
  estado_general,
  estado_pago,
  estado_envio,
  direccion_envio,
  fecha_creacion,
  fecha_actualizacion
`;

const ordenItemListSelect = `
  orden_id,
  producto_id,
  precio_unitario
`;

const productoListSelect = `
  producto_id,
  clerk_user_id,
  titulo,
  imagenes
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
  let ordenIdsByVendedor: string[] | null = null;

  if (vendedorId) {
    const { data: productosVendedor, error: productosVendedorError } =
      await supabase
        .from('producto')
        .select('producto_id')
        .eq('clerk_user_id', vendedorId);

    if (productosVendedorError) {
      console.error(
        'Error real al listar ordenes de venta: no se pudieron obtener productos del vendedor',
        productosVendedorError
      );
      return jsonError('No se pudieron obtener las ordenes', 500);
    }

    const productoIdsVendedor = (productosVendedor || []).map(
      (producto) => producto.producto_id
    );

    if (productoIdsVendedor.length === 0) {
      return NextResponse.json({ items: [], total: 0, page, pageSize }, { status: 200 });
    }

    const { data: ordenItemsVendedor, error: ordenItemsVendedorError } =
      await supabase
        .from('orden_item')
        .select('orden_id')
        .in('producto_id', productoIdsVendedor);

    if (ordenItemsVendedorError) {
      console.error(
        'Error real al listar ordenes de venta: no se pudieron obtener orden_items del vendedor',
        ordenItemsVendedorError
      );
      return jsonError('No se pudieron obtener las ordenes', 500);
    }

    ordenIdsByVendedor = Array.from(
      new Set((ordenItemsVendedor || []).map((item) => item.orden_id))
    );

    if (ordenIdsByVendedor.length === 0) {
      return NextResponse.json({ items: [], total: 0, page, pageSize }, { status: 200 });
    }
  }

  let query = supabase
    .from('orden')
    .select(ordenListSelect, { count: 'exact' });

  if (compradorId) {
    query = query.eq('clerk_user_id', compradorId);
  }

  if (ordenIdsByVendedor) {
    query = query.in('orden_id', ordenIdsByVendedor);
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
    console.error(
      'Error real al listar ordenes de venta: no se pudieron obtener ordenes',
      error
    );
    return jsonError('No se pudieron obtener las ordenes', 500);
  }

  const ordenes = (data || []) as unknown as OrdenRecord[];

  if (ordenes.length === 0) {
    return NextResponse.json(
      {
        items: [],
        total: count || 0,
        page,
        pageSize,
      },
      { status: 200 }
    );
  }

  const ordenIds = ordenes.map((orden) => orden.orden_id);
  const { data: ordenItemsData, error: ordenItemsError } = await supabase
    .from('orden_item')
    .select(ordenItemListSelect)
    .in('orden_id', ordenIds);

  if (ordenItemsError) {
    console.error(
      'Error real al listar ordenes de venta: no se pudieron obtener orden_items',
      ordenItemsError
    );
    return jsonError('No se pudieron obtener las ordenes', 500);
  }

  const ordenItems = (ordenItemsData || []) as unknown as OrdenItemRecord[];
  const productoIds = Array.from(
    new Set(ordenItems.map((item) => item.producto_id))
  );
  let productos: ProductoOrdenRecord[] = [];

  if (productoIds.length > 0) {
    const { data: productosData, error: productosError } = await supabase
      .from('producto')
      .select(productoListSelect)
      .in('producto_id', productoIds);

    if (productosError) {
      console.error(
        'Error real al listar ordenes de venta: no se pudieron obtener productos',
        productosError
      );
      return jsonError('No se pudieron obtener las ordenes', 500);
    }

    productos = (productosData || []) as unknown as ProductoOrdenRecord[];
  }

  const ordenItemsByOrdenId = ordenItems.reduce((map, item) => {
    const items = map.get(item.orden_id) || [];
    items.push(item);
    map.set(item.orden_id, items);
    return map;
  }, new Map<string, OrdenItemRecord[]>());

  const productosById = productos.reduce((map, producto) => {
    map.set(producto.producto_id, producto);
    return map;
  }, new Map<string, ProductoOrdenRecord>());

  const items = ordenes.map((orden) =>
    mapOrdenResponse(orden, ordenItemsByOrdenId, productosById)
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
