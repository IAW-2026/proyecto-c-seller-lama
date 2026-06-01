import { supabase } from '@/lib/supabase';
import {
  ESTADO_ENVIO_VALUES,
  ESTADO_GENERAL,
  ESTADO_GENERAL_VALUES,
  ESTADO_PAGO_VALUES,
  type EstadoEnvio,
  type EstadoGeneral,
  type EstadoPago,
  type Orden,
  type OrdenConItems,
  type OrdenItem,
} from '@/types/orden';
import type {
  PaginatedVentasResult,
  VentasFilters,
  VentasSearchParams,
  VentasStatsSummary,
} from '@/types/ventas-filters';

const PAGE_SIZE = 5;
const TODOS_VALUE = 'todos';

// Sirve para evitar errores de TypeScript cuando accedes a item.orden o item.producto.
type OrdenItemWithOrden = {
  orden_item_id: string;
  orden_id: string;
  producto_id: string;
  precio_unitario: number;
  fecha_creacion: string;
  orden: Orden | null;
  producto: OrdenItem['producto'] | null;
};

const normalizeString = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeEstadoPago = (value?: string): EstadoPago | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_PAGO_VALUES.includes(value as EstadoPago)) {
    return value as EstadoPago;
  }
  return undefined;
};

const normalizeEstadoEnvio = (value?: string): EstadoEnvio | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_ENVIO_VALUES.includes(value as EstadoEnvio)) {
    return value as EstadoEnvio;
  }
  return undefined;
};

const normalizeEstadoGeneral = (value?: string): EstadoGeneral | undefined => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_GENERAL_VALUES.includes(value as EstadoGeneral)) {
    return value as EstadoGeneral;
  }
  return undefined;
};

const normalizePage = (value?: string) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const normalizeDate = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;
  return trimmed;
};

const toDateRange = (from?: string, to?: string) => {
  const range: { from?: string; to?: string } = {};

  if (from) {
    const start = new Date(`${from}T00:00:00`);
    if (!Number.isNaN(start.getTime())) {
      range.from = start.toISOString();
    }
  }

  if (to) {
    const end = new Date(`${to}T23:59:59.999`);
    if (!Number.isNaN(end.getTime())) {
      range.to = end.toISOString();
    }
  }

  return range;
};

const formatInList = (values: string[]) =>
  values.map((value) => `"${value}"`).join(',');

export const parseVentasFilters = (
  searchParams?: VentasSearchParams
): VentasFilters => {
  const search = normalizeString(searchParams?.search);
  const estado_pago = normalizeEstadoPago(searchParams?.estado_pago);
  const estado_envio = normalizeEstadoEnvio(searchParams?.estado_envio);
  const estado_general = normalizeEstadoGeneral(searchParams?.estado_general);
  const from = normalizeDate(searchParams?.from);
  const to = normalizeDate(searchParams?.to);
  const page = normalizePage(searchParams?.page);

  return {
    search,
    estado_pago,
    estado_envio,
    estado_general,
    from,
    to,
    page,
    pageSize: PAGE_SIZE,
  };
};

export const buildVentasQueryString = (
  filters: VentasFilters,
  overrides: Partial<VentasFilters> = {}
) => {
  const params = new URLSearchParams();
  const merged = {
    ...filters,
    ...overrides,
  };

  if (merged.search) params.set('search', merged.search);
  if (merged.estado_pago) params.set('estado_pago', merged.estado_pago);
  if (merged.estado_envio) params.set('estado_envio', merged.estado_envio);
  if (merged.estado_general) params.set('estado_general', merged.estado_general);
  if (merged.from) params.set('from', merged.from);
  if (merged.to) params.set('to', merged.to);
  if (merged.page && merged.page > 1) params.set('page', String(merged.page));

  const query = params.toString();
  return query ? `/ventas?${query}` : '/ventas';
};

export const getEstadoPagoOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Aprobado', value: 'aprobado' },
  { label: 'Rechazado', value: 'rechazado' },
];

export const getEstadoEnvioOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'En preparacion', value: 'en_preparacion' },
  { label: 'Despachado', value: 'despachado' },
  { label: 'Entregado', value: 'entregado' },
  { label: 'Cancelado', value: 'cancelado' },
];

export const getEstadoGeneralOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Pendiente pago', value: 'pendiente_pago' },
  { label: 'Pagada', value: 'pagada' },
  { label: 'En preparacion', value: 'en_preparacion' },
  { label: 'Enviada', value: 'enviada' },
  { label: 'Completada', value: 'completada' },
  { label: 'Cancelada', value: 'cancelada' },
];

const summarizeVentasStats = (ordenes: OrdenConItems[]): VentasStatsSummary => {
  const totalVentas = ordenes.reduce(
    (count, orden) => count + orden.items.length,
    0
  );

  const ventasCompletas = ordenes.reduce((count, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.COMPLETADA) return count;
    return count + orden.items.length;
  }, 0);

  const ventasCanceladas = ordenes.reduce((count, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.CANCELADA) return count;
    return count + orden.items.length;
  }, 0);

  const ventasPendientes = ordenes.reduce((count, orden) => {
    if (
      orden.estado_general === ESTADO_GENERAL.COMPLETADA ||
      orden.estado_general === ESTADO_GENERAL.CANCELADA
    ) {
      return count;
    }
    return count + orden.items.length;
  }, 0);

  const totalIngresos = ordenes.reduce((sum, orden) => {
    if (orden.estado_general !== ESTADO_GENERAL.COMPLETADA) return sum;
    const ordenTotal = orden.items.reduce(
      (ordenSum, item) => ordenSum + (item.precio_unitario || 0),
      0
    );
    return sum + ordenTotal;
  }, 0);

  return {
    totalVentas,
    totalIngresos,
    ventasPendientes,
    ventasCompletas,
    ventasCanceladas,
  };
};

export const getVentasConFiltros = async ({
  userId,
  searchParams,
}: {
  userId: string;
  searchParams?: VentasSearchParams;
}): Promise<PaginatedVentasResult> => {
  const filters = parseVentasFilters(searchParams);
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;
  const dateRange = toDateRange(filters.from, filters.to);

  let query = supabase
    .from('orden_item')
    .select(
      `
      orden_item_id,
      orden_id,
      producto_id,
      precio_unitario,
      fecha_creacion,
      orden:fk_orden_item_orden!inner (
        orden_id,
        clerk_user_id,
        nro_orden,
        total,
        estado_general,
        estado_pago,
        estado_envio,
        direccion_envio,
        fecha_creacion,
        fecha_actualizacion
      ),
      producto:fk_orden_item_producto!inner (
        titulo,
        clerk_user_id,
        estado_publicacion
      )
    `,
      { count: 'exact' }
    )
    .eq('producto.clerk_user_id', userId)
    .order('fecha_creacion', { ascending: false, foreignTable: 'orden' });

  if (filters.search) {
    const normalizedSearch = filters.search.replace(/^#/, '');
    const searchTerm = `%${normalizedSearch}%`;

    const { data: ordenMatches } = await supabase
      .from('orden')
      .select('orden_id')
      .or(`nro_orden.ilike.${searchTerm},direccion_envio.ilike.${searchTerm}`);

    const { data: productoMatches } = await supabase
      .from('producto')
      .select('producto_id')
      .eq('clerk_user_id', userId)
      .ilike('titulo', searchTerm);

    const ordenIds = (ordenMatches || []).map((orden) => orden.orden_id);
    const productoIds = (productoMatches || []).map(
      (producto) => producto.producto_id
    );

    if (ordenIds.length === 0 && productoIds.length === 0) {
      return {
        ordenes: [],
        total: 0,
        totalPages: 1,
        currentPage: filters.page,
        filters,
        stats: summarizeVentasStats([]),
      };
    }

    const orClauses: string[] = [];

    if (ordenIds.length > 0) {
      orClauses.push(`orden_id.in.(${formatInList(ordenIds)})`);
    }

    if (productoIds.length > 0) {
      orClauses.push(`producto_id.in.(${formatInList(productoIds)})`);
    }

    query = query.or(orClauses.join(','));
  }

  if (filters.estado_pago) {
    query = query.eq('orden.estado_pago', filters.estado_pago);
  }

  if (filters.estado_envio) {
    query = query.eq('orden.estado_envio', filters.estado_envio);
  }

  if (filters.estado_general) {
    query = query.eq('orden.estado_general', filters.estado_general);
  }

  if (dateRange.from) {
    query = query.gte('orden.fecha_creacion', dateRange.from);
  }

  if (dateRange.to) {
    query = query.lte('orden.fecha_creacion', dateRange.to);
  }

  const { data: ordenItems, error, count } = await query.range(from, to);

  if (error) {
    return {
      ordenes: [],
      total: 0,
      totalPages: 1,
      currentPage: filters.page,
      filters,
      stats: summarizeVentasStats([]),
    };
  }

  const items = (ordenItems ?? []).map((item) => ({
    ...item,
    orden: Array.isArray(item.orden) ? item.orden[0] : item.orden,
    producto: Array.isArray(item.producto) ? item.producto[0] : item.producto,
  })) as OrdenItemWithOrden[];

  const ordenesMap = new Map<string, OrdenConItems>();

  items.forEach((item) => {
    const orden = item.orden;
    const producto = item.producto;

    if (!orden) return;

    const normalizedItem: OrdenItem = {
      orden_item_id: item.orden_item_id,
      orden_id: item.orden_id,
      producto_id: item.producto_id,
      precio_unitario: item.precio_unitario,
      fecha_creacion: item.fecha_creacion,
      producto,
    };

    const existing = ordenesMap.get(orden.orden_id);

    if (!existing) {
      ordenesMap.set(orden.orden_id, {
        ...orden,
        items: [normalizedItem],
      });
      return;
    }

    existing.items.push(normalizedItem);
  });

  const ordenes = Array.from(ordenesMap.values()).sort((a, b) =>
    b.fecha_creacion.localeCompare(a.fecha_creacion)
  );

  const total = count || 0;
  const totalPages = total > 0 ? Math.ceil(total / filters.pageSize) : 1;
  const currentPage = Math.min(filters.page, totalPages);

  return {
    ordenes,
    total,
    totalPages,
    currentPage,
    filters,
    stats: summarizeVentasStats(ordenes),
  };
};
