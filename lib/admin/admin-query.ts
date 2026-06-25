import { supabase } from '@/lib/supabase';
import { ESTADOS_PUBLICACION } from '@/types/producto';
import {
  ESTADO_ENVIO_VALUES,
  ESTADO_GENERAL_VALUES,
  ESTADO_PAGO_VALUES,
  type Orden,
} from '@/types/orden';
import type { Vendedor } from '@/types';
import type {
  AdminDashboardFilters,
  AdminDashboardResult,
  AdminOrdenesFilters,
  AdminPagedResult,
  AdminProductosFilters,
  AdminSearchParams,
  AdminVendedoresFilters,
  ProductoConVendedor,
} from '@/types/admin-filters';

const PAGE_SIZE = 10;
const TODOS_VALUE = 'todos';

const normalizeSearchTerm = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.replace(/^#/, '').trim();
  return trimmed || undefined;
};

const normalizeEstadoPublicacion = (value?: string) => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADOS_PUBLICACION.includes(value as (typeof ESTADOS_PUBLICACION)[number])) {
    return value;
  }
  return undefined;
};

const normalizeEstadoPago = (value?: string) => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_PAGO_VALUES.includes(value as (typeof ESTADO_PAGO_VALUES)[number])) {
    return value;
  }
  return undefined;
};

const normalizeEstadoEnvio = (value?: string) => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_ENVIO_VALUES.includes(value as (typeof ESTADO_ENVIO_VALUES)[number])) {
    return value;
  }
  return undefined;
};

const normalizeEstadoGeneral = (value?: string) => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (ESTADO_GENERAL_VALUES.includes(value as (typeof ESTADO_GENERAL_VALUES)[number])) {
    return value;
  }
  return undefined;
};

const normalizeVendedorActivo = (value?: string) => {
  if (!value || value === TODOS_VALUE) return undefined;
  if (value === 'activa' || value === 'inactiva') return value as 'activa' | 'inactiva';
  return undefined;
};

const normalizePage = (value?: string) => {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

/* ─── Parse ─── */

export const parseAdminFilters = (
  searchParams?: AdminSearchParams
): AdminDashboardFilters => {
  const vendedores: AdminVendedoresFilters = {
    search: normalizeSearchTerm(searchParams?.vendedores_search),
    activo: normalizeVendedorActivo(searchParams?.vendedores_activo),
    page: normalizePage(searchParams?.vendedores_page),
    pageSize: PAGE_SIZE,
  };

  const productos: AdminProductosFilters = {
    search: normalizeSearchTerm(searchParams?.productos_search),
    vendedor: searchParams?.productos_vendedor && searchParams.productos_vendedor !== TODOS_VALUE
      ? searchParams.productos_vendedor.trim()
      : undefined,
    estado_publicacion: normalizeEstadoPublicacion(searchParams?.productos_estado_publicacion),
    page: normalizePage(searchParams?.productos_page),
    pageSize: PAGE_SIZE,
  };

  const ordenes: AdminOrdenesFilters = {
    search: normalizeSearchTerm(searchParams?.ordenes_search),
    estado_pago: normalizeEstadoPago(searchParams?.ordenes_estado_pago),
    estado_envio: normalizeEstadoEnvio(searchParams?.ordenes_estado_envio),
    estado_general: normalizeEstadoGeneral(searchParams?.ordenes_estado_general),
    page: normalizePage(searchParams?.ordenes_page),
    pageSize: PAGE_SIZE,
  };

  return { vendedores, productos, ordenes };
};

/* ─── Build query string ─── */

export const buildAdminQueryString = (
  filters: AdminDashboardFilters,
  overrides: {
    vendedores?: Partial<AdminVendedoresFilters>;
    productos?: Partial<AdminProductosFilters>;
    ordenes?: Partial<AdminOrdenesFilters>;
  } = {}
) => {
  const params = new URLSearchParams();
  const vendedores = { ...filters.vendedores, ...overrides.vendedores };
  const productos = { ...filters.productos, ...overrides.productos };
  const ordenes = { ...filters.ordenes, ...overrides.ordenes };

  // Vendedores params
  if (vendedores.search) params.set('vendedores_search', vendedores.search);
  if (vendedores.activo) params.set('vendedores_activo', vendedores.activo);
  if (vendedores.page && vendedores.page > 1) params.set('vendedores_page', String(vendedores.page));

  // Productos params
  if (productos.search) params.set('productos_search', productos.search);
  if (productos.vendedor) params.set('productos_vendedor', productos.vendedor);
  if (productos.estado_publicacion) params.set('productos_estado_publicacion', productos.estado_publicacion);
  if (productos.page && productos.page > 1) params.set('productos_page', String(productos.page));

  // Ordenes params
  if (ordenes.search) params.set('ordenes_search', ordenes.search);
  if (ordenes.estado_pago) params.set('ordenes_estado_pago', ordenes.estado_pago);
  if (ordenes.estado_envio) params.set('ordenes_estado_envio', ordenes.estado_envio);
  if (ordenes.estado_general) params.set('ordenes_estado_general', ordenes.estado_general);
  if (ordenes.page && ordenes.page > 1) params.set('ordenes_page', String(ordenes.page));

  const query = params.toString();
  return query ? `/admin?${query}` : '/admin';
};

/* ─── Filter options ─── */

export const getEstadoPublicacionOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Activa', value: 'activa' },
  { label: 'Inactiva', value: 'inactiva' },
  { label: 'Vendida', value: 'vendida' },
];

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
  { label: 'Liquidada', value: 'liquidada' },
];

export const getVendedorActivoOptions = () => [
  { label: 'Todos', value: TODOS_VALUE },
  { label: 'Activo', value: 'activa' },
  { label: 'Inactivo', value: 'inactiva' },
];

/**
 * Trae la lista de vendedores para usarlos como opciones de filtro en productos.
 */
export const getVendedorOptions = async () => {
  const { data } = await supabase
    .from('vendedor')
    .select('clerk_user_id, nombre_vendedor')
    .eq('activo', true)
    .order('nombre_vendedor', { ascending: true });

  const options = [{ label: 'Todos', value: TODOS_VALUE }];

  if (data) {
    for (const vendedor of data) {
      options.push({ label: vendedor.nombre_vendedor, value: vendedor.clerk_user_id });
    }
  }

  return options;
};

/* ─── Helpers ─── */

const toPagedResult = <T>(
  items: T[] | null,
  count: number | null,
  page: number,
  pageSize: number
): AdminPagedResult<T> => {
  const total = count || 0;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
  const currentPage = Math.min(page, totalPages);
  return {
    items: items || [],
    total,
    totalPages,
    currentPage,
  };
};

/* ─── Main data loader ─── */

export const getAdminDashboardData = async (
  searchParams?: AdminSearchParams
): Promise<AdminDashboardResult> => {
  const filters = parseAdminFilters(searchParams);

  // Independent pagination ranges
  const vendedoresFrom = (filters.vendedores.page - 1) * filters.vendedores.pageSize;
  const vendedoresTo = vendedoresFrom + filters.vendedores.pageSize - 1;

  const productosFrom = (filters.productos.page - 1) * filters.productos.pageSize;
  const productosTo = productosFrom + filters.productos.pageSize - 1;

  const ordenesFrom = (filters.ordenes.page - 1) * filters.ordenes.pageSize;
  const ordenesTo = ordenesFrom + filters.ordenes.pageSize - 1;

  // --- Vendedores query ---
  let vendedoresQuery = supabase
    .from('vendedor')
    .select('*', { count: 'exact' })
    .order('fecha_creacion', { ascending: false });

  let vendedoresStatsQuery = supabase
    .from('vendedor')
    .select('activo');

  if (filters.vendedores.search) {
    const searchTerm = `%${filters.vendedores.search}%`;
    vendedoresQuery = vendedoresQuery.or(
      `nombre_vendedor.ilike.${searchTerm},email.ilike.${searchTerm}`
    );
    vendedoresStatsQuery = vendedoresStatsQuery.or(
      `nombre_vendedor.ilike.${searchTerm},email.ilike.${searchTerm}`
    );
  }

  if (filters.vendedores.activo) {
    vendedoresQuery = vendedoresQuery.eq(
      'activo',
      filters.vendedores.activo === 'activa'
    );
    vendedoresStatsQuery = vendedoresStatsQuery.eq(
      'activo',
      filters.vendedores.activo === 'activa'
    );
  }

  // --- Productos query ---
  let productosQuery = supabase
    .from('producto')
    .select(
      `
      *,
      vendedor (
        nombre_vendedor
      )
    `,
      { count: 'exact' }
    )
    .order('fecha_creacion', { ascending: false });

  if (filters.productos.search) {
    const searchTerm = `%${filters.productos.search}%`;
    productosQuery = productosQuery.ilike('titulo', searchTerm);
  }

  if (filters.productos.estado_publicacion) {
    productosQuery = productosQuery.eq(
      'estado_publicacion',
      filters.productos.estado_publicacion
    );
  }

  if (filters.productos.vendedor) {
    productosQuery = productosQuery.eq(
      'clerk_user_id',
      filters.productos.vendedor
    );
  }

  // --- Ordenes query ---
  let ordenesQuery = supabase
    .from('orden')
    .select('*', { count: 'exact' })
    .order('fecha_creacion', { ascending: false });

  let ordenesStatsQuery = supabase
    .from('orden')
    .select('total, estado_envio, estado_general');

  if (filters.ordenes.search) {
    const searchTerm = `%${filters.ordenes.search}%`;
    ordenesQuery = ordenesQuery.ilike('nro_orden', searchTerm);
    ordenesStatsQuery = ordenesStatsQuery.ilike('nro_orden', searchTerm);
  }

  if (filters.ordenes.estado_pago) {
    ordenesQuery = ordenesQuery.eq('estado_pago', filters.ordenes.estado_pago);
    ordenesStatsQuery = ordenesStatsQuery.eq('estado_pago', filters.ordenes.estado_pago);
  }

  if (filters.ordenes.estado_envio) {
    ordenesQuery = ordenesQuery.eq('estado_envio', filters.ordenes.estado_envio);
    ordenesStatsQuery = ordenesStatsQuery.eq('estado_envio', filters.ordenes.estado_envio);
  }

  if (filters.ordenes.estado_general) {
    ordenesQuery = ordenesQuery.eq('estado_general', filters.ordenes.estado_general);
    ordenesStatsQuery = ordenesStatsQuery.eq('estado_general', filters.ordenes.estado_general);
  }

  const [
    { data: vendedores, count: vendedoresCount },
    { data: productos, count: productosCount },
    { data: ordenes, count: ordenesCount },
    { data: vendedoresStats },
    { data: ordenesStats },
  ] = await Promise.all([
    vendedoresQuery.range(vendedoresFrom, vendedoresTo),
    productosQuery.range(productosFrom, productosTo),
    ordenesQuery.range(ordenesFrom, ordenesTo),
    vendedoresStatsQuery,
    ordenesStatsQuery,
  ]);

  const pendingSellers = (vendedoresStats || []).filter((v) => !v.activo).length;
  const pendingOrders = (ordenesStats || []).filter(
    (orden) => orden.estado_general === 'pendiente_pago' || orden.estado_general === 'en_preparacion'
  ).length;
  const ingresosBrutos = (ordenesStats || []).reduce(
    (acc, orden) => acc + (orden.total || 0),
    0
  );
  const ingresosCancelados = (ordenesStats || []).reduce((acc, orden) => {
    if (orden.estado_envio === 'cancelado' || orden.estado_general === 'cancelada') {
      return acc + (orden.total || 0);
    }
    return acc;
  }, 0);

  return {
    vendedores: toPagedResult<Vendedor>(
      vendedores as Vendedor[] | null,
      vendedoresCount,
      filters.vendedores.page,
      filters.vendedores.pageSize
    ),
    productos: toPagedResult<ProductoConVendedor>(
      productos as ProductoConVendedor[] | null,
      productosCount,
      filters.productos.page,
      filters.productos.pageSize
    ),
    ordenes: toPagedResult<Orden>(
      ordenes as Orden[] | null,
      ordenesCount,
      filters.ordenes.page,
      filters.ordenes.pageSize
    ),
    stats: {
      ingresosBrutos,
      ingresosCancelados,
      pendingSellers,
      pendingOrders,
    },
    filters,
  };
};
